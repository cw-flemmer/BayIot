import Telemetry from '../models/Telemetry.js';
import Device from '../models/Device.js';
import { sendSms } from '../utils/smsService.js';

const SMS_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes

export const ingestTelemetry = async (req, res) => {
    try {
        const { deviceId, temperature, humidity, doorStatus, batteryLevel } = req.body;

        if (!deviceId) {
            return res.status(400).json({ message: 'deviceId is required' });
        }

        // 1. Create Telemetry Record
        const telemetry = await Telemetry.create({
            device_id: deviceId,
            temperature,
            humidity,
            door_status: doorStatus,
            battery_level: batteryLevel,
        });

        // 2. Evaluate Alerts
        const device = await Device.findOne({ where: { device_id: deviceId } });
        if (device && device.sms_alerts_enabled && device.alert_phone_number) {
            const now = new Date();
            let shouldSendSms = false;
            let smsMessage = '';

            const lastSmsTime = device.last_sms_sent_at ? new Date(device.last_sms_sent_at).getTime() : 0;
            const canSendSms = (now.getTime() - lastSmsTime) > SMS_COOLDOWN_MS;

            let deviceUpdated = false;

            // -- Temperature Check --
            if (temperature !== undefined && temperature !== null) {
                if (device.min_temperature !== null && temperature < device.min_temperature) {
                    shouldSendSms = true;
                    smsMessage = `Alert: Device ${deviceId} temperature (${temperature}°C) is below minimum threshold (${device.min_temperature}°C).`;
                } else if (device.max_temperature !== null && temperature > device.max_temperature) {
                    shouldSendSms = true;
                    smsMessage = `Alert: Device ${deviceId} temperature (${temperature}°C) is above maximum threshold (${device.max_temperature}°C).`;
                }
            }

            // -- Door Check --
            // door_status: 0 = OPEN, 1 = CLOSED
            if (doorStatus !== undefined && doorStatus !== null) {
                const isDoorOpen = doorStatus === false || doorStatus === 0;

                if (isDoorOpen) {
                    if (!device.door_opened_at) {
                        // Door just opened — record the time, don't alert yet
                        device.door_opened_at = now;
                        deviceUpdated = true;
                    } else {
                        // Door already open — check how long
                        const timeOpenMs = now.getTime() - new Date(device.door_opened_at).getTime();
                        const limitMs = (device.door_open_time_limit || 60) * 1000;
                        if (timeOpenMs > limitMs) {
                            if (!shouldSendSms) {
                                shouldSendSms = true;
                                smsMessage = `Alert: Device ${deviceId} door has been open for more than ${device.door_open_time_limit || 60} seconds!`;
                            } else {
                                smsMessage += ` Also, door has been open too long.`;
                            }
                        }
                    }
                } else {
                    // Door is now closed — reset the timer
                    if (device.door_opened_at) {
                        device.door_opened_at = null;
                        deviceUpdated = true;
                    }
                }
            }

            // -- Send SMS and update Device state --
            if (shouldSendSms && canSendSms) {
                const smsSent = await sendSms(smsMessage, [device.alert_phone_number]);
                if (smsSent) {
                    device.last_sms_sent_at = now;
                    deviceUpdated = true;
                }
            }

            if (deviceUpdated) {
                await device.save();
            }
        }

        res.status(201).json({ message: 'Telemetry ingested successfully', telemetry });

    } catch (error) {
        console.error('Telemetry ingestion error:', error);
        res.status(500).json({ message: 'Server error processing telemetry' });
    }
};
