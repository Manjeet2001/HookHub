import axios from 'axios';
import type { Subscription, CreateSubscriptionRequest, WebhookPayload, DeliveryLog } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Subscription APIs
export const subscriptionAPI = {
  create: async (data: CreateSubscriptionRequest): Promise<Subscription> => {
    const response = await api.post<Subscription>('/subscriptions', data);
    return response.data;
  },

  getAll: async (): Promise<Subscription[]> => {
    const response = await api.get<Subscription[]>('/subscriptions');
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/subscriptions/${id}`);
  },
};

// Webhook APIs
export const webhookAPI = {
  send: async (subscriptionId: string, data: WebhookPayload): Promise<void> => {
    await api.post(`/webhooks/${subscriptionId}`, data);
  },
};

// Status/Logs APIs
export const statusAPI = {
  getBySubscription: async (subscriptionId: string): Promise<DeliveryLog[]> => {
    const response = await api.get<DeliveryLog[]>(`/status/subscription/${subscriptionId}`);
    return response.data;
  },

  getByTask: async (taskId: string): Promise<DeliveryLog[]> => {
    const response = await api.get<DeliveryLog[]>(`/status/task/${taskId}`);
    return response.data;
  },

  getRecent: async (hours?: number): Promise<DeliveryLog[]> => {
    const url = hours ? `/status/recent?hours=${hours}` : '/status/recent';
    const response = await api.get<DeliveryLog[]>(url);
    return response.data;
  },
};

export default api;
