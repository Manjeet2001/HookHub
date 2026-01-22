export interface Subscription {
  id: string;
  targetUrl: string;
  eventType: string;
  secret?: string;
  createdAt?: string;
}

export interface CreateSubscriptionRequest {
  targetUrl: string;
  eventType: string;
  secret?: string;
}

export interface WebhookPayload {
  eventType: string;
  payload: Record<string, any>;
}

export interface DeliveryLog {
  id: number;
  deliveryTaskId: string;
  subscriptionId: string;
  targetUrl: string;
  timestamp: string;
  attemptNumber: number;
  outcome: 'SUCCESS' | 'FAILED_ATTEMPT' | 'FAILURE';
  httpStatusCode: number;
  errorDetails?: string;
}

export type TabType = 'subscriptions' | 'send' | 'logs';
