import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function NetworkComparison({ networkComparison = {} }) {
  const metricLabel = (val) => {
    if (val === 'above average') return 85;
    if (val === 'below average') return 35;
    return 55;
  };

  const data = [
    {
      name: 'TX Frequency',
      you: metricLabel(networkComparison.transactionFrequency),
      network: 55,
      label: networkComparison.transactionFrequency || 'average'
    },
    {
      name: 'Asset Diversity',
      you: metricLabel(networkComparison.assetDiversity),
      network: 55,
      label: networkComparison.assetDiversity || 'average'
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-lg px-3 py-2 text-xs" style={{ background: '#111827', border: '1px solid #1E293B' }}>
          <p className="font-medium text-white mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.fill }}>{p.name}: {p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium text-slate-400 mb-4">Network Comparison</h3>

      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} width={80} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="you" name="You" radius={4} fill="#7C5CFC" />
          <Bar dataKey="network" name="Network Avg" radius={4} fill="#334155" />
        </BarChart>
      </ResponsiveContainer>

      {/* Labels */}
      <div className="flex items-center gap-4 mt-2 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#7C5CFC' }} />
          <span className="text-xs text-slate-400">You</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#334155' }} />
          <span className="text-xs text-slate-400">Network Avg</span>
        </div>
      </div>

      {networkComparison.summary && (
        <p className="text-xs text-slate-400 leading-relaxed p-3 rounded-lg" style={{ background: '#0D1425' }}>
          {networkComparison.summary}
        </p>
      )}
    </div>
  );
}
