import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getCellColor(count) {
  if (!count || count === 0) return 'var(--bg-surface)';
  if (count <= 2) return '#1e1b4b';
  if (count <= 4) return '#312e81';
  if (count <= 7) return '#4338ca';
  if (count <= 12) return '#6366f1';
  return '#818cf8';
}

function getCellBorder(count) {
  if (!count || count === 0) return '1px solid var(--b1)';
  return 'none';
}

export default function HeatmapCalendar({ activityByDate = {} }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const containerRef = useRef(null);

  // Generate 53 weeks of data ending today
  const { grid, monthLabels, totalActive, totalCells } = useMemo(() => {
    const gridData = Array(7).fill(null).map(() => Array(53).fill(null));
    const labels = Array(53).fill('');
    let activeDays = 0;
    
    // We want the last column to be the week containing "today"
    const today = new Date();
    // JS getDay() is 0 for Sunday. Let's make Monday=0, Sunday=6
    let todayDayIdx = today.getDay() - 1; 
    if (todayDayIdx === -1) todayDayIdx = 6;
    
    // Calculate the start date (52 weeks ago, on a Monday)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - todayDayIdx - (52 * 7));

    let currentMonth = -1;
    let cellCount = 0;
    
    for (let w = 0; w < 53; w++) {
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (w * 7) + d);
        
        // Don't draw future days in the current week
        if (w === 52 && d > todayDayIdx) {
          continue; 
        }

        cellCount++;
        const isoDate = date.toISOString().split('T')[0];
        const count = activityByDate[isoDate] || 0;
        if (count > 0) activeDays++;

        gridData[d][w] = {
          date: isoDate,
          count: count,
          rawDate: date,
          weekIdx: w,
          dayIdx: d
        };

        // If it's the first day of the week, check if month changed
        if (d === 0) {
          const month = date.getMonth();
          if (month !== currentMonth && w < 51) {
             labels[w] = MONTHS[month];
             currentMonth = month;
          }
        }
      }
    }
    
    return { grid: gridData, monthLabels: labels, totalActive: activeDays, totalCells: cellCount };
  }, [activityByDate]);

  const activityRate = totalCells ? Math.round((totalActive / totalCells) * 100) : 0;

  // Handle tooltip position internally to keep it simple but working well.
  const handleMouseEnter = (event, cell) => {
    if (!cell) return;
    const rect = event.target.getBoundingClientRect();
    const contRect = containerRef.current.getBoundingClientRect();
    setHoveredCell({
      ...cell,
      x: rect.left - contRect.left + (rect.width / 2),
      y: rect.top - contRect.top - 8 
    });
  };

  return (
    <div className="card p-6 w-full" ref={containerRef}>
      
      {/* Title Row */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display font-bold text-[16px] text-[var(--t1)] m-0">Activity Heatmap</h2>
        <span className="text-[12px] text-[var(--t3)] font-body">Past 12 months</span>
      </div>

      {/* Container */}
      <div className="w-full overflow-x-auto heatmap-scroll relative pb-4">
         <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(53, 14px)', gap: '3px', width: 'max-content' }}>
            
            {/* Month row */}
            <div /> {/* Empty top-left cell */}
            {monthLabels.map((lbl, i) => (
              <div key={`m-${i}`} className="font-mono text-[10px] text-[var(--t3)] flex items-end">
                {lbl}
              </div>
            ))}

            {/* Day rows */}
            {grid.map((row, dayIdx) => (
              <React.Fragment key={`r-${dayIdx}`}>
                 {/* Y-axis label */}
                 <div className="font-mono text-[10px] text-[var(--t3)] flex items-center h-[14px] leading-none pr-1 justify-end">
                    {[1, 3, 5].includes(dayIdx) ? DAYS[dayIdx] : ''}
                 </div>
                 
                 {/* Cells */}
                 {row.map((cell, weekIdx) => {
                   if (!cell) return <div key={`c-${weekIdx}`} className="w-[14px] h-[14px]" />;
                   const hasActivity = cell.count > 0;
                   return (
                     <div
                       key={`c-${weekIdx}`}
                       className={`hm-cell ${hasActivity ? 'populated' : ''}`}
                       style={{
                         background: getCellColor(cell.count),
                         border: getCellBorder(cell.count),
                         animationDelay: hasActivity ? `${(weekIdx * 7 + dayIdx) * 5}ms` : '0ms'
                       }}
                       onMouseEnter={(e) => handleMouseEnter(e, cell)}
                       onMouseLeave={() => setHoveredCell(null)}
                     />
                   );
                 })}
              </React.Fragment>
            ))}

         </div>

         {/* Tooltip Overlay */}
         <AnimatePresence>
           {hoveredCell && (
             <motion.div
               initial={{ opacity: 0, y: 5 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.15 }}
               className="absolute pointer-events-none z-50 flex flex-col items-center"
               style={{ left: hoveredCell.x, top: hoveredCell.y, transform: 'translate(-50%, -100%)' }}
             >
                <div className="bg-[var(--bg-elevated)] border border-[var(--b2)] rounded-[6px] px-[10px] py-[6px] whitespace-nowrap shadow-xl">
                  <div className="text-[12px] font-medium text-[var(--t1)]">
                    {hoveredCell.count} {hoveredCell.count === 1 ? 'txn' : 'txns'}
                  </div>
                  <div className="text-[10px] text-[var(--t3)] font-mono mt-0.5">
                    {hoveredCell.rawDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div className="w-[10px] h-[10px] bg-[var(--bg-elevated)] border-b border-r border-[var(--b2)] transform rotate-45 -mt-[6px]" />
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      {/* Footer / Legend / Summary */}
      <div className="flex justify-between items-center mt-4">
         
         {/* Summary text */}
         <div className="text-[13px] text-[var(--t2)] font-body">
           Active <span className="font-mono text-[var(--t1)]">{activityRate}%</span> of the year
         </div>

         {/* Legend */}
         <div className="flex items-center gap-[3px]">
           <span className="text-[10px] text-[var(--t3)] mr-1">Less</span>
           {[0, 1, 3, 6, 10, 15].map((val, i) => (
             <div 
               key={`leg-${i}`} 
               className="w-[10px] h-[10px] rounded-[2px]" 
               style={{ background: getCellColor(val), border: getCellBorder(val) }} 
             />
           ))}
           <span className="text-[10px] text-[var(--t3)] ml-1">More</span>
         </div>
      </div>
    </div>
  );
}
