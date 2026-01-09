import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as SecureStore from 'expo-secure-store';
import api from './api';


const BACKGROUND_NOTIFICATION_TASK = 'background-notification-task';

// Initialize notification handler
export function initializeNotificationHandler() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });
}

// Define the background task
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
    try {
        console.log('[Background Task] Checking for new notifications...');

        // 1. Retrieve credentials from SecureStore
        const storedUser = await SecureStore.getItemAsync('auth_user');
        const storedDomain = await SecureStore.getItemAsync('tenant_domain');

        if (!storedUser || !storedDomain) {
            console.log('[Background Task] No credentials found, skipping.');
            return BackgroundFetch.BackgroundFetchResult.NoData;
        }

        const user = JSON.parse(storedUser);
        const email = user.email;

        // 2. Fetch unread notifications count using mobile endpoint
        const response = await api.post('/mobile/notifications/unread-count', {
            email,
            domain: storedDomain
        });
        const { count } = response.data;

        if (count > 0) {
            // 3. Fetch the latest notifications using mobile endpoint
            const notificationsResponse = await api.post('/mobile/notifications/latest', {
                email,
                domain: storedDomain
            });
            const notifications = notificationsResponse.data;

            // Show notification for the most recent unread one
            const latestUnread = notifications.find((n: any) => !n.is_read);

            if (latestUnread) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'BayIot Alert',
                        body: latestUnread.message,
                        data: { notificationId: latestUnread.id, deviceId: latestUnread.device_id },
                        sound: true,
                    },
                    trigger: null, // Show immediately
                });

                console.log('[Background Task] Notification displayed:', latestUnread.message);
            }
        }

        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
        console.error('[Background Task] Error:', error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

// Register the background fetch task
export async function registerBackgroundFetchAsync() {
    try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
            minimumInterval: 15, // 15 seconds (minimum allowed)
            stopOnTerminate: false, // Continue after app is closed
            startOnBoot: true, // Start on device boot
        });
        console.log('[Background Fetch] Task registered successfully');
    } catch (err) {
        console.error('[Background Fetch] Task registration failed:', err);
    }
}

// Unregister the background fetch task
export async function unregisterBackgroundFetchAsync() {
    try {
        await BackgroundFetch.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
        console.log('[Background Fetch] Task unregistered');
    } catch (err) {
        console.error('[Background Fetch] Task unregistration failed:', err);
    }
}

// Request notification permissions
export async function requestNotificationPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.warn('[Notifications] Permission not granted');
        return false;
    }

    console.log('[Notifications] Permission granted');
    return true;
}

// Check if background fetch is available
export async function checkBackgroundFetchStatus() {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);

    console.log('[Background Fetch] Status:', status);
    console.log('[Background Fetch] Is Registered:', isRegistered);

    return { status, isRegistered };
}
