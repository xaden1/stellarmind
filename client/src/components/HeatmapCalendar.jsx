import { useState } from 'react';
import { motion } from 'framer-motion';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['S','M','T','W','T','F','S'];

function getCellColor(count) {
  if (!count) return '#1E293B';
  if (count <= 2) return '#312e81';
  if (count <= 5) return '#4338ca';
  if (count <= 10) return '#7C5CFC';
  return '#a78bfa';
}

export default function HeatmapCalendar({ activityByDate = {} }) {
  const [tooltip, setTooltip] = useState(null);

  // Build 52 weeks of data ending today
  const today = new Date();
  const weeks = [];
  let cursor = new Date(today);
  cursor.setDate(cursor.getDate() - (cursor.getDay())); // start of this week

  for (let w = 51; w >= 0; w--) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(cursor);
      date.setDate(cursor.getDate() - (w * 7) + d - 51 + 51);
      // recalculate: go back 51 weeks from start of current week
      const target = new Date(today);
      target.setDate(today.getDate() - today.getDay() - (51 - w) * 7 + d);
      const key = target.toISOString().split('T')[0];
      week.push({ date: key, count: activityByDate[key] || 0 });
    }
    weeks.push(week);
  }

  // Month labels
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const month = new Date(week[0].date).getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ index: i, label: MONTHS[month] });
      lastMonth = month;
    }
  });

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium text-slate-400 mb-4">Transaction Activity</h3>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 700 }}>
          {/* Month labels */}
          <div className="flex mb-1 ml-5">
            {weeks.map((_, i) => {
              const label = monthLabels.find(m => m.index === i);
              return (
                <div key={i} style={{ width: 16, flexShrink: 0 }}>
                  {label && <span className="text-xs text-slate-600">{label.label}</span>}
                </div>
              );
            })}
          </div>

          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1">
              {DAYS.map((d, i) => (
                <div key={i} style={{ height: 14, fontSize: 9, color: '#475569', lineHeight: '14px' }}>{i % 2 === 1 ? d : ''}</div>
              ))}
            </div>

            {/* Grid */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((cell, di) => (
                  <div
                    key={di}
                    className="heatmap-cell relative"
                    style={{
                      width: 14, height: 14,
                      background: getCellColor(cell.count),
                      boxShadow: cell.count > 0 ? `0 0 4px ${getCellColor(cell.count)}60` : 'none'
                    }}
                    onMouseEnter={() => setTooltip(cell)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 ml-5">
            <span className="text-xs text-slate-600">Less</span>
            {[0, 2, 4, 7, 11].map((v, i) => (
              <div
                key={i}
                className="heatmap-cell"
                style={{ width: 14, height: 14, background: getCellColor(v) }}
              />
            ))}
            <span className="text-xs text-slate-600">More</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="mt-2 text-xs text-slate-300">
          {tooltip.count > 0
            ? `${tooltip.count} transaction${tooltip.count !== 1 ? 's' : ''} on ${tooltip.date}`
            : `No transactions on ${tooltip.date}`}
        </div>
      )}
    </div>
  );
}
