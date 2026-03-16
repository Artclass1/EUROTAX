import React from 'react';
import { Building2, Calculator, FileText, MessageSquare, Settings, Globe, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  jurisdiction: string;
  setJurisdiction: (j: string) => void;
}

const EU_COUNTRIES = [
  'European Union (General)', 'Germany', 'United Kingdom', 'France', 'Estonia', 'Ireland', 'Netherlands', 'Cyprus', 'Spain', 'Italy'
];

export default function Layout({ children, activeTab, setActiveTab, jurisdiction, setJurisdiction }: LayoutProps) {
  return (
    <div className="flex h-screen w-full bg-background text-zinc-300 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-surface flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
          <span className="text-white font-semibold tracking-wide uppercase text-sm">EuroTax AI</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <NavItem 
            icon={<MessageSquare className="w-4 h-4" />} 
            label="AI Consultant" 
            isActive={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
          />
          <NavItem 
            icon={<Calculator className="w-4 h-4" />} 
            label="Tax Dashboard" 
            isActive={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<Building2 className="w-4 h-4" />} 
            label="Company Formation" 
            isActive={activeTab === 'formation'} 
            onClick={() => setActiveTab('formation')} 
          />
          <NavItem 
            icon={<FileText className="w-4 h-4" />} 
            label="Compliance Docs" 
            isActive={activeTab === 'docs'} 
            onClick={() => setActiveTab('docs')} 
          />
        </nav>

        <div className="p-4 border-t border-white/10">
          <NavItem 
            icon={<Settings className="w-4 h-4" />} 
            label="Settings" 
            isActive={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
          <div className="mt-4 px-3 py-2 bg-white/5 rounded-md border border-white/10">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">System Status</div>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Real-time Sync Active
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-medium text-white capitalize">
              {activeTab === 'chat' ? 'AI Tax Consultant' : activeTab.replace('-', ' ')}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-zinc-500" />
            <select 
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="bg-surface border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer pr-8 relative"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
            >
              {EU_COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200",
        isActive 
          ? "bg-white text-black font-medium shadow-sm" 
          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
