import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { formatXLM } from '../utils/formatters';

const COLORS = ['#6366F1', '#06B6D4', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444'];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 10px ${fill}80)` }}
      />
    </g>
  );
};

export default function AssetBreakdown({ assetSummary = [] }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const total = assetSummary.reduce((sum, a) => sum + (parseFloat(a.balance) || 0), 0);
  
  const data = assetSummary
    .filter(a => parseFloat(a.balance) > 0)
    .sort((a, b) => b.balance - a.balance)
    .map((a, i) => ({
      name: a.asset,
      value: parseFloat(a.balance),
      fill: COLORS[i % COLORS.length],
      percentage: total > 0 ? ((parseFloat(a.balance) / total) * 100).toFixed(1) : 0
    }));

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const isOnlyXlm = data.length === 1 && data[0].name.toUpperCase() === 'XLM';

  return (
    <div className="card p-6 flex flex-col h-full min-h-[400px]">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display font-bold text-[16px] text-[var(--t1)] m-0">Asset Portfolio</h2>
        <p className="font-body text-[12px] text-[var(--t3)] mt-1">{formatXLM(total)} Total Balance</p>
      </div>

      {/* Warning */}
      {isOnlyXlm && (
         <div className="bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.3)] rounded-[8px] p-[12px] text-[13px] text-[var(--amber)] font-body flex gap-2 items-start mb-4 shrink-0">
            <span className="text-[16px] leading-[1]">💡</span>
            <span>Only XLM detected. Consider diversifying your portfolio.</span>
         </div>
      )}

      {/* Chart */}
      <div className="relative w-full h-[200px] flex items-center justify-center shrink-0 mb-4">
        {data.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="var(--bg-surface)" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Inner Label overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-[28px] font-semibold text-grad">{data.length}</span>
              <span className="text-[11px] text-[var(--t3)] uppercase font-semibold tracking-wider mt-1">Assets</span>
            </div>
          </>
        ) : (
          <div className="text-[13px] text-[var(--t3)] font-body">No asset data available</div>
        )}
      </div>

      {/* Custom Legend */}
      <div className="flex-1 w-full space-y-3 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[var(--indigo)] [&::-webkit-scrollbar-track]:bg-transparent">
        {data.map((asset, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className={`flex items-center justify-between p-2 rounded-[6px] transition-colors ${activeIndex === i ? 'bg-[var(--bg-elevated)]' : ''}`}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(-1)}
          >
            <div className="flex items-center gap-3">
              <div className="w-[10px] h-[10px] rounded-[2px]" style={{ background: asset.fill }} />
              <span className="font-body text-[13px] font-medium text-[var(--t1)]">{asset.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[13px] text-[var(--t2)]">{formatXLM(asset.value)}</span>
              <span className="badge w-[48px] justify-center" style={{ background: `${asset.fill}20`, color: asset.fill, border: `1px solid ${asset.fill}40` }}>
                {asset.percentage}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
