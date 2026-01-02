import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('microtask_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('microtask_token');
            localStorage.removeItem('microtask_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data: { name: string; email: string; photoUrl: string; role: string; firebaseUid: string }) =>
        api.post('/auth/register', data),
    login: (data: { email: string; firebaseUid: string }) =>
        api.post('/auth/login', data),
    googleLogin: (data: { name: string; email: string; photoUrl: string; firebaseUid: string }) =>
        api.post('/auth/google-login', data),
    verify: () => api.get('/auth/verify'),
};

// User API
export const userAPI = {
    getAll: () => api.get('/users'),
    getById: (id: string) => api.get(`/users/${id}`),
    updateRole: (id: string, role: string) => api.patch(`/users/${id}/role`, { role }),
    delete: (id: string) => api.delete(`/users/${id}`),
    getTopWorkers: () => api.get('/users/top/workers'),
};

// Task API
export const taskAPI = {
    getAvailable: () => api.get('/tasks'),
    getAll: () => api.get('/tasks/all'),
    getBuyerTasks: () => api.get('/tasks/buyer'),
    getById: (id: string) => api.get(`/tasks/${id}`),
    create: (data: {
        title: string;
        detail: string;
        requiredWorkers: number;
        payableAmount: number;
        completionDate: string;
        submissionInfo: string;
        imageUrl?: string;
    }) => api.post('/tasks', data),
    update: (id: string, data: { title?: string; detail?: string; submissionInfo?: string }) =>
        api.patch(`/tasks/${id}`, data),
    delete: (id: string) => api.delete(`/tasks/${id}`),
};

// Submission API
export const submissionAPI = {
    create: (data: { taskId: string; submissionDetails: string }) =>
        api.post('/submissions', data),
    getWorkerSubmissions: (page = 1, limit = 10) =>
        api.get(`/submissions/worker?page=${page}&limit=${limit}`),
    getWorkerApproved: () => api.get('/submissions/worker/approved'),
    getBuyerSubmissions: () => api.get('/submissions/buyer'),
    approve: (id: string) => api.patch(`/submissions/${id}/approve`),
    reject: (id: string) => api.patch(`/submissions/${id}/reject`),
};

// Withdrawal API
export const withdrawalAPI = {
    create: (data: { withdrawalCoin: number; paymentSystem: string; accountNumber: string }) =>
        api.post('/withdrawals', data),
    getWorkerWithdrawals: () => api.get('/withdrawals/worker'),
    getPending: () => api.get('/withdrawals'),
    approve: (id: string) => api.patch(`/withdrawals/${id}/approve`),
};

// Payment API
export const paymentAPI = {
    getPackages: () => api.get('/payments/packages'),
    process: (data: { packageId: number; cardNumber?: string; expiryDate?: string; cvv?: string }) =>
        api.post('/payments/process', data),
    getHistory: () => api.get('/payments/history'),
    getTotal: () => api.get('/payments/total'),
};

// Notification API
export const notificationAPI = {
    getAll: () => api.get('/notifications'),
    getUnreadCount: () => api.get('/notifications/unread-count'),
    markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
    markAllAsRead: () => api.patch('/notifications/read-all'),
};

// Stats API
export const statsAPI = {
    getAdmin: () => api.get('/stats/admin'),
    getBuyer: () => api.get('/stats/buyer'),
    getWorker: () => api.get('/stats/worker'),
};

// Image Upload API
export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    // Get API Key from env
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

    if (!apiKey || apiKey.includes('INSERT')) {
        console.warn('ImgBB API Key is missing or invalid.');
        // For demo/development purposes if key is missing, return a dummy URL or throw error
        // throw new Error('ImgBB API Key is missing');
    }

    try {
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
        return response.data.data.url;
    } catch (error) {
        console.error('Image upload failed:', error);
        throw error;
    }
};

export default api;
