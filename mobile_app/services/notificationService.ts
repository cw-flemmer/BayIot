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

// Helper to fetch and show notifications
export async function fetchAndNotify() {
    try {
        console.log('[Notification Service] Checking for new notifications...');

        const storedUser = await SecureStore.getItemAsync('auth_user');
        const storedDomain = await SecureStore.getItemAsync('tenant_domain');

        if (!storedUser || !storedDomain) {
            return { result: BackgroundFetch.BackgroundFetchResult.NoData, count: 0 };
        }

        const user = JSON.parse(storedUser);
        const email = user.email;

        // Fetch unread notifications count
        const response = await api.post('/mobile/notifications/unread-count', {
            email,
            domain: storedDomain
        });
        const { count } = response.data;

        if (count > 0) {
            // Fetch the latest notifications
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
                        sound: 'default', // Explicit sound
                        priority: Notifications.AndroidNotificationPriority.HIGH,
                    },
                    trigger: null,
                });

                console.log('[Notification Service] Notification displayed:', latestUnread.message);
            }
            return { result: BackgroundFetch.BackgroundFetchResult.NewData, count };
        }

        return { result: BackgroundFetch.BackgroundFetchResult.NoData, count: 0 };
    } catch (error: any) {
        if (error.response) {
            console.error('[Notification Service] Error Response:', error.response.data);
        } else {
            console.error('[Notification Service] Error:', error.message);
        }
        return { result: BackgroundFetch.BackgroundFetchResult.Failed, count: 0 };
    }
}

// Define the background task
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
    const { result } = await fetchAndNotify();
    return result;
});

// Start a 60-second "Foreground Poll"
// Note: This works while app is open, but combined with a Foreground Service permission 
// and a sticky notification, it becomes much more reliable than BackgroundFetch.
let pollInterval: NodeJS.Timeout | null = null;

export function startForegroundPoll() {
    if (pollInterval) return;

    console.log('[Notification Service] Starting 60s foreground poll');
    pollInterval = setInterval(async () => {
        await fetchAndNotify();
    }, 60000); // 60 seconds
}

export function stopForegroundPoll() {
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
}

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
