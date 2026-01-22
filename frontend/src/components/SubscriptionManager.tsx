import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { subscriptionAPI } from '../services/api';
import type { Subscription, CreateSubscriptionRequest } from '../types';
import Card from './Card';
import toast from 'react-hot-toast';

const SubscriptionManager: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateSubscriptionRequest>({
    targetUrl: '',
    eventType: '',
    secret: '',
  });

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const data = await subscriptionAPI.getAll();
      setSubscriptions(data);
    } catch (error) {
      toast.error('Failed to load subscriptions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.targetUrl || !formData.eventType) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await subscriptionAPI.create(formData);
      toast.success('Subscription created successfully!');
      setFormData({ targetUrl: '', eventType: '', secret: '' });
      setShowForm(false);
      loadSubscriptions();
    } catch (error) {
      toast.error('Failed to create subscription');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;

    try {
      await subscriptionAPI.delete(id);
      toast.success('Subscription deleted successfully!');
      loadSubscriptions();
    } catch (error) {
      toast.error('Failed to delete subscription');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Subscriptions</h2>
          <p className="text-gray-400 mt-1">Manage webhook subscriptions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          New Subscription
        </button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Subscription</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target URL *
              </label>
              <input
                type="url"
                value={formData.targetUrl}
                onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                placeholder="https://webhook.site/your-unique-id"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Type *
              </label>
              <input
                type="text"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                placeholder="user.created"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Secret (Optional)
              </label>
              <input
                type="text"
                value={formData.secret}
                onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                placeholder="your-secret-key"
                className="input-field"
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                Create Subscription
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-primary-500" size={40} />
        </div>
      ) : subscriptions.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400">No subscriptions found. Create one to get started!</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map((subscription) => (
            <Card key={subscription.id} hover className="relative">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {subscription.eventType}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">
                      ID: {subscription.id}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(subscription.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2"
                    title="Delete subscription"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">
                      Target URL
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-300 truncate flex-1">
                        {subscription.targetUrl}
                      </p>
                      <a
                        href={subscription.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>

                  {subscription.secret && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Secret
                      </label>
                      <p className="text-sm text-gray-400 font-mono mt-1">
                        {'•'.repeat(20)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;
