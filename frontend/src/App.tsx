import { useState } from 'react';
import { Webhook, Send, FileText, Menu, X } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import SubscriptionManager from './components/SubscriptionManager';
import WebhookSender from './components/WebhookSender';
import DeliveryLogs from './components/DeliveryLogs';
import type { TabType } from './types';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('subscriptions');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tabs = [
    { id: 'subscriptions' as TabType, label: 'Subscriptions', icon: Webhook },
    { id: 'send' as TabType, label: 'Send Webhook', icon: Send },
    { id: 'logs' as TabType, label: 'Delivery Logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid rgba(148, 163, 184, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div
          className={`glass-strong border-r border-gray-800 transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden`}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-2 rounded-lg">
                <Webhook size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">HookHub</h1>
                <p className="text-xs text-gray-400">Webhook Manager</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
            <div className="text-xs text-gray-500">
              <p>Backend: localhost:8080</p>
              <p className="mt-1">Status: <span className="text-green-400">● Connected</span></p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="glass-strong border-b border-gray-800 sticky top-0 z-10">
            <div className="flex items-center justify-between px-8 py-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-400">
                  Welcome to HookHub Dashboard
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              {activeTab === 'subscriptions' && <SubscriptionManager />}
              {activeTab === 'send' && <WebhookSender />}
              {activeTab === 'logs' && <DeliveryLogs />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
