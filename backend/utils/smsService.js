import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Sends an SMS using the WinSMS REST API.
 * 
 * @param {string} message - The message content to send.
 * @param {string[]} recipientNumbers - An array of recipient mobile numbers. If empty or null, it falls back to WINSMS_ADMIN_NUMBER.
 * @returns {Promise<boolean>} - True if successful, false otherwise.
 */
export const sendSms = async (message, recipientNumbers = null) => {
    try {
        const apiKey = process.env.WINSMS_API_KEY;
        const adminNumbers = process.env.WINSMS_ADMIN_NUMBER;

        if (!apiKey) {
            console.warn("WinSMS API Key not set. SMS not sent.");
            return false;
        }

        let recipients = [];

        // Determine recipients
        if (recipientNumbers && Array.isArray(recipientNumbers) && recipientNumbers.length > 0) {
            recipients = recipientNumbers.map(num => ({ mobileNumber: num.trim() }));
        } else if (adminNumbers) {
            recipients = adminNumbers.split(',').map(num => ({ mobileNumber: num.trim() }));
        } else {
            console.warn("No recipients provided and WINSMS_ADMIN_NUMBER not set. SMS not sent.");
            return false;
        }

        // WinSMS REST API endpoint
        const url = 'https://api.winsms.co.za/api/rest/v1/sms/outgoing/send';

        const payload = {
            message: message,
            recipients: recipients
        };

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            }
        };

        const response = await axios.post(url, payload, config);

        console.log("SMS sent successfully:", response.data);
        return true;

    } catch (error) {
        // Handle axios specific error logging
        if (error.response) {
            console.error("Error sending SMS:", error.response.data);
            console.error("Status:", error.response.status);
        } else {
            console.error("Error sending SMS:", error.message);
        }
        return false;
    }
};
