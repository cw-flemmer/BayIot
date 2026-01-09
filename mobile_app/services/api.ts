import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace with your local machine's IP (e.g., http://192.168.1.50:5000)
// or use 10.0.2.2 for Android Emulator
const BASE_URL = 'http://156.155.253.143:3000/api';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});



export default api;
