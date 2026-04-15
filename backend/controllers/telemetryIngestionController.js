import Telemetry from '../models/Telemetry.js';
import Device from '../models/Device.js';
import TenantCustomer from '../models/TenantCustomer.js';
import { sendSms } from '../utils/smsService.js';

const SMS_COOLDOWN_MS = (parseInt(process.env.SMS_COOLDOWN_MINUTES, 10) || 15) * 60 * 1000;

export const ingestTelemetry = async (req, res) => {
    try {
        const { deviceId, temperature, humidity, doorStatus, batteryLevel } = req.body;
        console.log(`[INGEST] Received telemetry:`, req.body);

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
        console.log(`[INGEST] Telemetry saved for device: ${deviceId}`);

        // 2. Evaluate Alerts
        const device = await Device.findOne({ where: { device_id: deviceId } });

        if (!device) {
            console.warn(`[INGEST] No device found in DB with device_id: ${deviceId}`);
            return res.status(201).json({ message: 'Telemetry ingested, but no matching device config found.', telemetry });
        }

        console.log(`[INGEST] Device found: id=${device.id}, sms_enabled=${device.sms_alerts_enabled}, phone=${device.alert_phone_number}`);

        if (!device.sms_alerts_enabled) {
            console.log(`[INGEST] SMS alerts disabled for ${deviceId}. Skipping alert check.`);
            return res.status(201).json({ message: 'Telemetry ingested successfully', telemetry });
        }

        if (!device.alert_phone_number) {
            console.log(`[INGEST] No alert phone number configured for ${deviceId}. Skipping.`);
            return res.status(201).json({ message: 'Telemetry ingested successfully', telemetry });
        }

        const now = new Date();
        let shouldSendSms = false;
        let smsMessage = '';

        const lastSmsTime = device.last_sms_sent_at ? new Date(device.last_sms_sent_at).getTime() : 0;
        const msSinceLastSms = now.getTime() - lastSmsTime;
        const canSendSms = msSinceLastSms > SMS_COOLDOWN_MS;
        console.log(`[INGEST] SMS cooldown: last sent ${Math.round(msSinceLastSms / 1000)}s ago, cooldown=${SMS_COOLDOWN_MS / 1000}s, canSend=${canSendSms}`);

        let deviceUpdated = false;

        // -- Temperature Check --
        if (temperature !== undefined && temperature !== null) {
            console.log(`[INGEST] Temp check: value=${temperature}, min=${device.min_temperature}, max=${device.max_temperature}`);
            if (device.min_temperature !== null && temperature < device.min_temperature) {
                shouldSendSms = true;
                smsMessage = `Alert: Device ${deviceId} temperature (${temperature}°C) is below minimum threshold (${device.min_temperature}°C).`;
            } else if (device.max_temperature !== null && temperature > device.max_temperature) {
                shouldSendSms = true;
                smsMessage = `Alert: Device ${deviceId} temperature (${temperature}°C) is above maximum threshold (${device.max_temperature}°C).`;
            }
        }

        // -- Door Check --
        // door_status: 0 = OPEN, 1 = CLOSED (may arrive as string from Node-RED)
        if (doorStatus !== undefined && doorStatus !== null) {
            const isDoorOpen = Number(doorStatus) === 0;
            console.log(`[INGEST] Door check: doorStatus=${doorStatus}, isDoorOpen=${isDoorOpen}, door_opened_at=${device.door_opened_at}, limit=${device.door_open_time_limit}s`);

            if (isDoorOpen) {
                if (!device.door_opened_at) {
                    console.log(`[INGEST] Door just opened — recording timestamp.`);
                    device.door_opened_at = now;
                    deviceUpdated = true;
                } else {
                    const timeOpenMs = now.getTime() - new Date(device.door_opened_at).getTime();
                    const limitMs = (device.door_open_time_limit || 60) * 1000;
                    console.log(`[INGEST] Door open for ${Math.round(timeOpenMs / 1000)}s, limit=${limitMs / 1000}s`);
                    if (timeOpenMs > limitMs) {
                        console.log(`[INGEST] Door open time exceeded! Triggering SMS.`);
                        if (!shouldSendSms) {
                            shouldSendSms = true;
                            smsMessage = `Alert: Device ${deviceId} door has been open for more than ${device.door_open_time_limit || 60} seconds!`;
                        } else {
                            smsMessage += ` Also, door has been open too long.`;
                        }
                    }
                }
            } else {
                console.log(`[INGEST] Door is closed — resetting timer.`);
                if (device.door_opened_at) {
                    device.door_opened_at = null;
                    deviceUpdated = true;
                }
            }
        }

        // -- Send SMS --
        console.log(`[INGEST] shouldSendSms=${shouldSendSms}, canSendSms=${canSendSms}`);
        if (shouldSendSms && canSendSms) {

            // --- SMS Credit Check ---
            let creditBlocked = false;
            let customer = null;
            if (device.tenant_customer_id) {
                customer = await TenantCustomer.findByPk(device.tenant_customer_id);
                if (customer && customer.sms_credit_limit > 0 && customer.sms_credit_used >= customer.sms_credit_limit) {
                    creditBlocked = true;
                    console.warn(`[INGEST] SMS blocked — customer #${customer.id} (${customer.name}) has exhausted their SMS credit limit (${customer.sms_credit_limit}).`);
                }
            }

            if (!creditBlocked) {
                console.log(`[INGEST] Sending SMS to ${device.alert_phone_number}: "${smsMessage}"`);
                const smsSent = await sendSms(smsMessage, [device.alert_phone_number]);
                console.log(`[INGEST] SMS send result: ${smsSent}`);
                if (smsSent) {
                    device.last_sms_sent_at = now;
                    deviceUpdated = true;
                    // Deduct 1 credit from customer if assigned
                    if (customer) {
                        customer.sms_credit_used = customer.sms_credit_used + 1;
                        await customer.save();
                        console.log(`[INGEST] Customer #${customer.id} credit: ${customer.sms_credit_used}/${customer.sms_credit_limit}`);
                    }
                }
            }
        } else if (shouldSendSms && !canSendSms) {
            console.log(`[INGEST] SMS suppressed by cooldown.`);
        }

        if (deviceUpdated) {
            await device.save();
            console.log(`[INGEST] Device state saved.`);
        }

        res.status(201).json({ message: 'Telemetry ingested successfully', telemetry });

    } catch (error) {
        console.error('[INGEST] Error:', error);
        res.status(500).json({ message: 'Server error processing telemetry' });
    }
};
