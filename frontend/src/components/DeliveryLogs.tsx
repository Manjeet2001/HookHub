import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { statusAPI, subscriptionAPI } from '../services/api';
import type { DeliveryLog, Subscription } from '../types';
import Card from './Card';
import StatusBadge from './StatusBadge';
import toast from 'react-hot-toast';

const DeliveryLogs: React.FC = () => {
  const [logs, setLogs] = useState<DeliveryLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'subscription' | 'task'>('subscription');
  const [searchId, setSearchId] = useState('');
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [filterOutcome, setFilterOutcome] = useState<string>('all');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [recentTaskIds, setRecentTaskIds] = useState<Array<{ id: string; eventType: string }>>([]);
  const [timePeriod, setTimePeriod] = useState<'recent' | '24' | '48' | '72'>('recent');

  useEffect(() => {
    loadSubscriptions();
    loadRecentLogs(); // Auto-load recent logs on mount
  }, []);

  const loadSubscriptions = async () => {
    try {
      const data = await subscriptionAPI.getAll();
      setSubscriptions(data);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    }
  };

  const loadRecentLogs = async (hours?: number) => {
    setLoading(true);
    try {
      const data = await statusAPI.getRecent(hours);
      setLogs(data);
      
      // Extract unique task IDs for the dropdown
      const uniqueTasks = new Map<string, string>();
      data.forEach(log => {
        if (!uniqueTasks.has(log.deliveryTaskId)) {
          uniqueTasks.set(log.deliveryTaskId, log.subscriptionId);
        }
      });
      const taskList = Array.from(uniqueTasks.entries()).map(([id, subId]) => {
        const sub = subscriptions.find(s => s.id === subId);
        return { id, eventType: sub?.eventType || 'Unknown' };
      });
      setRecentTaskIds(taskList);
      
      if (data.length === 0) {
        toast('No recent logs found', { icon: '📭' });
      }
    } catch (error) {
      toast.error('Failed to load recent logs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimePeriodChange = (period: 'recent' | '24' | '48' | '72') => {
    setTimePeriod(period);
    const hours = period === 'recent' ? undefined : parseInt(period);
    loadRecentLogs(hours);
  };

  const loadRecentTaskIds = async () => {
    try {
      const logs = await statusAPI.getRecent();
      // Extract unique task IDs
      const uniqueTasks = new Map<string, string>();
      logs.forEach(log => {
        if (!uniqueTasks.has(log.deliveryTaskId)) {
          uniqueTasks.set(log.deliveryTaskId, log.subscriptionId);
        }
      });
      const taskList = Array.from(uniqueTasks.entries()).map(([id, subId]) => {
        const sub = subscriptions.find(s => s.id === subId);
        return { id, eventType: sub?.eventType || 'Unknown' };
      });
      setRecentTaskIds(taskList);
    } catch (error) {
      console.error('Failed to load recent task IDs:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast.error('Please enter a search ID');
      return;
    }

    setLoading(true);
    try {
      console.log(`Searching for ${searchType}:`, searchId);
      const data = searchType === 'subscription'
        ? await statusAPI.getBySubscription(searchId)
        : await statusAPI.getByTask(searchId);
      
      console.log(`API returned ${data.length} logs:`, data);
      setLogs(data);
      if (data.length === 0) {
        toast('No logs found', { icon: '📭' });
      } else {
        toast.success(`Found ${data.length} log(s)`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to load logs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Filter logs by outcome only (no time filtering)
  const filteredLogs = logs.filter(log => {
    return filterOutcome === 'all' || log.outcome === filterOutcome;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">Delivery Logs</h2>
          <p className="text-gray-400 mt-1">Monitor webhook delivery status and history</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timePeriod}
            onChange={(e) => handleTimePeriodChange(e.target.value as 'recent' | '24' | '48' | '72')}
            disabled={loading}
            className="input-field"
          >
            <option value="recent">Load Recent Logs</option>
            <option value="24">Past 24 Hours</option>
            <option value="48">Past 48 Hours</option>
            <option value="72">Past 72 Hours</option>
          </select>
          {loading && <Loader2 className="animate-spin text-primary-400" size={20} />}
        </div>
      </div>

      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search By
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'subscription' | 'task')}
              className="input-field w-full max-w-xs"
            >
              <option value="subscription">Subscription ID</option>
              <option value="task">Task ID</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {searchType === 'subscription' ? 'Select Subscription' : 'Select Task ID'}
            </label>
            {searchType === 'subscription' ? (
              <select
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="input-field w-full"
              >
                <option value="">Select a subscription...</option>
                {subscriptions.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.targetUrl.substring(0, 70)}...
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="input-field w-full"
              >
                <option value="">Select a task ID...</option>
                {recentTaskIds.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.id.substring(0, 16)}...
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Search size={20} />
              )}
              Search
            </button>
            <button
              onClick={() => {
                setLogs([]);
                setSearchId('');
              }}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw size={20} />
              Clear
            </button>
          </div>
        </div>
      </Card>

      {logs.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300">Filter:</label>
              <div className="flex gap-2">
                {['all', 'SUCCESS', 'FAILED_ATTEMPT', 'FAILURE'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterOutcome(status)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      filterOutcome === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {status === 'all' ? 'All' : status}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Showing <span className="text-white font-semibold">{filteredLogs.length}</span> of <span className="text-white font-semibold">{logs.length}</span> logs
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
                    Task ID
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
                    Timestamp
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
                    Attempt
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
                    HTTP Code
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 text-sm font-mono text-gray-300">
                        {log.deliveryTaskId.substring(0, 8)}...
                      </td>
                      <td className="py-3 text-sm text-gray-400">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="py-3 text-sm text-gray-400">
                        {log.attemptNumber}
                      </td>
                      <td className="py-3">
                        <StatusBadge outcome={log.outcome} />
                      </td>
                      <td className="py-3">
                        <span className={`text-sm font-medium ${
                          log.httpStatusCode >= 200 && log.httpStatusCode < 300
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}>
                          {log.httpStatusCode}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                          className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1"
                        >
                          {expandedLog === log.id ? (
                            <>
                              <ChevronUp size={16} />
                              Hide
                            </>
                          ) : (
                            <>
                              <ChevronDown size={16} />
                              View
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedLog === log.id && (
                      <tr className="bg-gray-900/50">
                        <td colSpan={6} className="py-3 px-4">
                          <div className="text-sm space-y-3">
                            <div>
                              <p className="text-gray-400 mb-1 font-semibold">Delivery Information:</p>
                              <div className="bg-gray-950 p-3 rounded text-xs space-y-1 text-gray-300">
                                <p><span className="text-gray-500">Target URL:</span> {log.targetUrl}</p>
                                <p><span className="text-gray-500">Subscription ID:</span> {log.subscriptionId}</p>
                                <p><span className="text-gray-500">Task ID:</span> {log.deliveryTaskId}</p>
                                <p><span className="text-gray-500">Timestamp:</span> {new Date(log.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                            {log.errorDetails && (
                              <div>
                                <p className="text-red-400 mb-1 font-semibold">Error Details:</p>
                                <p className="text-red-400 font-mono text-xs bg-gray-950 p-3 rounded whitespace-pre-wrap">
                                  {log.errorDetails}
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && logs.length > 0 && (
            <p className="text-center text-gray-500 py-4">
              No logs match the selected filter
            </p>
          )}
        </Card>
      )}
    </div>
  );
};

export default DeliveryLogs;
