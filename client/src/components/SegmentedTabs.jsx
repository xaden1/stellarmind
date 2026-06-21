import React from 'react';

/**
 * SegmentedTabs — glass pill segmented control.
 *
 * Props:
 *   tabs     — [{ id, label, icon? }]
 *   active   — id of the active tab
 *   onChange — (tabId) => void
 *   className — extra classes on root
 */
export default function SegmentedTabs({ tabs = [], active, onChange, className = '' }) {
  return (
    <div className={`segmented-tabs ${className}`} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange && onChange(tab.id)}
          className={`segmented-tab ${active === tab.id ? 'active' : ''}`}
        >
          {tab.icon && (
            <span className="inline-flex mr-1.5" aria-hidden="true">
              {tab.icon}
            </span>
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
