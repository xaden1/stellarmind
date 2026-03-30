import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function NetworkComparison({ networkComparison = {} }) {
  const getScore = (val) => {
    if (val === 'above average') return 80;
    if (val === 'below average') return 30;
    return 50;
  };

  const getBadgeClass = (val) => {
    if (val === 'above average') return 'badge-cyan';
    if (val === 'below average') return 'badge-amber';
    return 'badge-indigo';
  };

  const data = [
    {
      metric: 'Tx Frequency',
      you: getScore(networkComparison.transactionFrequency),
      avg: 50,
      label: networkComparison.transactionFrequency || 'average'
    },
    {
      metric: 'Asset Diversity',
      you: getScore(networkComparison.assetDiversity),
      avg: 50,
      label: networkComparison.assetDiversity || 'average'
    },
    {
      metric: 'Activity Rate',
      you: getScore(networkComparison.activityRate || 'above average'),
      avg: 50,
      label: networkComparison.activityRate || 'above average'
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--bg-elevated)] border border-[var(--b2)] rounded-[8px] p-3 shadow-xl">
          <p className="font-body text-[12px] text-[var(--t1)] font-medium mb-2">{payload[0].payload.metric}</p>
          {payload.map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] font-mono">
               <div className="w-[8px] h-[8px] rounded-full" style={{ background: p.fill !== 'transparent' ? p.fill : 'var(--bg-overlay)', border: p.stroke !== 'none' ? `1px solid ${p.stroke}` : 'none' }} />
               <span className="text-[var(--t2)]">{p.name}:</span>
               <span className="text-[var(--t1)]">{p.value === 50 && p.name === 'Avg' ? 'baseline' : p.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card p-6 flex flex-col h-full min-h-[400px]">
      
      {/* Header */}
      <div className="mb-6 shrink-0">
        <h2 className="font-display font-bold text-[16px] text-[var(--t1)] m-0">vs. Stellar Network</h2>
        <p className="font-body text-[12px] text-[var(--t3)] mt-1">How your wallet compares to average users</p>
      </div>

      {/* Chart */}
      <div className="w-full h-[200px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--indigo)" />
                <stop offset="100%" stopColor="var(--cyan)" />
              </linearGradient>
            </defs>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis 
              type="category" 
              dataKey="metric" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--t2)', fontSize: 12, fontFamily: 'DM Sans' }} 
              width={100}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-elevated)', opacity: 0.4 }} />
            
            <Bar 
              dataKey="avg" 
              name="Avg" 
              fill="var(--bg-overlay)" 
              stroke="var(--b2)" 
              barSize={12} 
              radius={4}
              animationDuration={1200}
              animationEasing="ease-out"
            />
            <Bar 
              dataKey="you" 
              name="You" 
              fill="url(#barGrad)" 
              barSize={12} 
              radius={4}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status Tags */}
      <div className="flex flex-wrap gap-2 mb-6 shrink-0 ml-[80px]">
         {data.map((d, i) => (
            <div key={i} className={`badge ${getBadgeClass(d.label)}`}>
               {d.metric.split(' ')[0]}: {d.label}
            </div>
         ))}
      </div>

      {/* Summary Sentence */}
      <div className="mt-auto pt-4 border-t border-dashed border-[var(--b2)] relative">
         <span className="absolute top-[8px] left-0 font-display text-[32px] font-bold text-[var(--indigo)] opacity-40 leading-none">"</span>
         <p className="font-body italic text-[13px] text-[var(--t2)] leading-[1.6] pl-[18px] pr-2">
            {networkComparison.summary || 'Your wallet shows typical behavior compared to the network average.'}
         </p>
      </div>

    </div>
  );
}
