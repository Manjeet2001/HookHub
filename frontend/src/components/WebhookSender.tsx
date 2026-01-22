import React, { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { subscriptionAPI, webhookAPI } from '../services/api';
import type { Subscription } from '../types';
import Card from './Card';
import toast from 'react-hot-toast';

const WebhookSender: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState('');
  const [eventType, setEventType] = useState('');
  const [payload, setPayload] = useState('{\n  "userId": "12345",\n  "name": "John Doe",\n  "email": "john@example.com"\n}');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const data = await subscriptionAPI.getAll();
      setSubscriptions(data);
      if (data.length > 0) {
        setSelectedSubscription(data[0].id);
        setEventType(data[0].eventType);
      }
    } catch (error) {
      toast.error('Failed to load subscriptions');
      console.error(error);
    }
  };

  const handleSubscriptionChange = (id: string) => {
    setSelectedSubscription(id);
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      setEventType(sub.eventType);
    }
  };

  const handleSend = async () => {
    if (!selectedSubscription || !eventType) {
      toast.error('Please select a subscription and enter event type');
      return;
    }

    try {
      JSON.parse(payload); // Validate JSON
    } catch {
      toast.error('Invalid JSON payload');
      return;
    }

    setLoading(true);
    try {
      await webhookAPI.send(selectedSubscription, {
        eventType,
        payload: JSON.parse(payload),
      });
      toast.success('Webhook sent successfully!');
    } catch (error) {
      toast.error('Failed to send webhook');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const examplePayloads = {
    'user.created': '{\n  "userId": "12345",\n  "name": "John Doe",\n  "email": "john@example.com"\n}',
    'order.completed': '{\n  "orderId": "ORD-789",\n  "amount": 99.99,\n  "status": "completed"\n}',
    'payment.success': '{\n  "paymentId": "PAY-456",\n  "amount": 199.99,\n  "currency": "USD"\n}',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Send Webhook</h2>
        <p className="text-gray-400 mt-1">Test webhook delivery to subscriptions</p>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Subscription
            </label>
            {subscriptions.length === 0 ? (
              <p className="text-gray-500 text-sm">No subscriptions available. Create one first!</p>
            ) : (
              <select
                value={selectedSubscription}
                onChange={(e) => handleSubscriptionChange(e.target.value)}
                className="input-field"
              >
                {subscriptions.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.eventType} - {sub.targetUrl.substring(0, 50)}...
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Type
            </label>
            <input
              type="text"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              placeholder="user.created"
              className="input-field"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Payload (JSON)
              </label>
              <div className="flex gap-2">
                {Object.entries(examplePayloads).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setPayload(value)}
                    className="text-xs text-primary-400 hover:text-primary-300"
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              rows={12}
              className="input-field font-mono text-sm"
              placeholder='{\n  "key": "value"\n}'
            />
          </div>

          <button
            onClick={handleSend}
            disabled={loading || !selectedSubscription}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Webhook
              </>
            )}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default WebhookSender;
