import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Euro, FileCheck, AlertCircle } from 'lucide-react';

const mockTaxData = [
  { month: 'Jan', revenue: 45000, tax: 9000 },
  { month: 'Feb', revenue: 52000, tax: 10400 },
  { month: 'Mar', revenue: 48000, tax: 9600 },
  { month: 'Apr', revenue: 61000, tax: 12200 },
  { month: 'May', revenue: 59000, tax: 11800 },
  { month: 'Jun', revenue: 67000, tax: 13400 },
];

export default function Dashboard({ jurisdiction }: { jurisdiction: string }) {
  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Estimated YTD Liability" 
            value="€66,400" 
            trend="+12.5%" 
            isPositive={false} 
            icon={<Euro className="w-5 h-5 text-zinc-400" />} 
          />
          <StatCard 
            title="Effective Tax Rate" 
            value="19.5%" 
            trend="-2.1%" 
            isPositive={true} 
            icon={<BarChart className="w-5 h-5 text-zinc-400" />} 
            subtitle={`Optimized for ${jurisdiction}`}
          />
          <StatCard 
            title="Pending Filings" 
            value="2" 
            trend="Action Required" 
            isPositive={false} 
            icon={<AlertCircle className="w-5 h-5 text-zinc-400" />} 
            alert
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue vs Tax */}
          <div className="bg-surface border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-6 uppercase tracking-wider">Revenue vs Tax Liability</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTaxData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value/1000}k`} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="revenue" fill="#333" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tax" fill="#fff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compliance Calendar */}
          <div className="bg-surface border border-white/5 rounded-xl p-6 flex flex-col">
            <h3 className="text-sm font-medium text-zinc-400 mb-6 uppercase tracking-wider">Compliance Calendar ({jurisdiction})</h3>
            <div className="flex-1 space-y-4">
              <ComplianceItem 
                date="Oct 10" 
                title="Q3 VAT Return" 
                status="pending" 
                amount="€12,450"
              />
              <ComplianceItem 
                date="Oct 15" 
                title="Payroll Tax Submission" 
                status="upcoming" 
              />
              <ComplianceItem 
                date="Nov 01" 
                title="Corporate Advance Payment" 
                status="upcoming" 
                amount="€8,000"
              />
              <ComplianceItem 
                date="Sep 10" 
                title="Q2 VAT Return" 
                status="completed" 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, trend, isPositive, icon, subtitle, alert }: any) {
  return (
    <div className={`bg-surface border ${alert ? 'border-red-500/30' : 'border-white/5'} rounded-xl p-6 relative overflow-hidden`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-400' : alert ? 'text-red-400' : 'text-zinc-400'}`}>
          {trend !== 'Action Required' && (isPositive ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />)}
          {trend}
        </div>
      </div>
      <div>
        <div className="text-3xl font-light text-white mb-1 tracking-tight">{value}</div>
        <div className="text-sm text-zinc-500 font-medium">{title}</div>
        {subtitle && <div className="text-xs text-zinc-600 mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}

function ComplianceItem({ date, title, status, amount }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-12 text-center">
          <div className="text-xs text-zinc-500 uppercase">{date.split(' ')[0]}</div>
          <div className="text-lg font-medium text-white">{date.split(' ')[1]}</div>
        </div>
        <div className="w-px h-8 bg-white/10"></div>
        <div>
          <div className="text-sm font-medium text-white">{title}</div>
          <div className="text-xs text-zinc-500 flex items-center gap-2 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'completed' ? 'bg-emerald-500' : status === 'pending' ? 'bg-red-500' : 'bg-zinc-500'}`}></span>
            <span className="capitalize">{status}</span>
          </div>
        </div>
      </div>
      {amount && <div className="text-sm font-medium text-zinc-300">{amount}</div>}
    </div>
  );
}
