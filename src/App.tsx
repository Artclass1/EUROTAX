import { useState } from 'react';
import Layout from './components/Layout';
import Chat from './components/Chat';
import Dashboard from './components/Dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [jurisdiction, setJurisdiction] = useState('Germany');

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      jurisdiction={jurisdiction} 
      setJurisdiction={setJurisdiction}
    >
      {activeTab === 'chat' && <Chat jurisdiction={jurisdiction} />}
      {activeTab === 'dashboard' && <Dashboard jurisdiction={jurisdiction} />}
      {activeTab === 'formation' && (
        <div className="flex items-center justify-center h-full text-zinc-500">
          <div className="text-center">
            <h2 className="text-xl text-white mb-2">Company Formation Module</h2>
            <p>Select "AI Consultant" to begin the guided formation process.</p>
          </div>
        </div>
      )}
      {activeTab === 'docs' && (
        <div className="flex items-center justify-center h-full text-zinc-500">
          <div className="text-center">
            <h2 className="text-xl text-white mb-2">Compliance Documents</h2>
            <p>Document generation and storage coming soon.</p>
          </div>
        </div>
      )}
      {activeTab === 'settings' && (
        <div className="flex items-center justify-center h-full text-zinc-500">
          <div className="text-center">
            <h2 className="text-xl text-white mb-2">System Settings</h2>
            <p>Configure integrations and API access.</p>
          </div>
        </div>
      )}
    </Layout>
  );
}
