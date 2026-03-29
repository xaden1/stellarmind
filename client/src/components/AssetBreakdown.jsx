import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatXLM } from '../utils/formatters';

const COLORS = ['#7C5CFC', '#00D4B4', '#F59E0B', '#F97316', '#3B82F6', '#EC4899'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg px-3 py-2 text-xs" style={{ background: '#111827', border: '1px solid #1E293B' }}>
        <p className="font-medium text-white">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.fill }}>{formatXLM(payload[0].value)}</p>
        <p className="text-slate-400">{payload[0].payload.percentage}%</p>
      </div>
    );
  }
  return null;
};

export default function AssetBreakdown({ assetSummary = [] }) {
  const total = assetSummary.reduce((sum, a) => sum + a.balance, 0);
  const data = assetSummary
    .filter(a => a.balance > 0)
    .map((a, i) => ({
      name: a.asset,
      value: a.balance,
      fill: COLORS[i % COLORS.length],
      percentage: total > 0 ? ((a.balance / total) * 100).toFixed(1) : 0
    }));

  if (!data.length) {
    return (
      <div className="glass-card p-5 flex items-center justify-center" style={{ minHeight: 200 }}>
        <p className="text-xs text-slate-500">No asset data available</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium text-slate-400 mb-4">Asset Breakdown</h3>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label overlay replacement */}
      <div className="space-y-2 mt-2">
        {data.map((asset, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: asset.fill }} />
              <span className="text-slate-300 font-medium">{asset.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">{formatXLM(asset.value)}</span>
              <span className="text-slate-600">{asset.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
