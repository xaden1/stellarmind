import React from 'react';

/**
 * GlassToggle — accessible glass-style toggle switch.
 *
 * Props:
 *   checked   — boolean, controlled value
 *   onChange  — (newBool) => void
 *   label     — text label shown to the right
 *   id        — unique id for accessibility
 *   disabled  — boolean
 */
export default function GlassToggle({
  checked = false,
  onChange,
  label,
  id,
  disabled = false,
}) {
  const handleClick = () => {
    if (!disabled && onChange) onChange(!checked);
  };

  return (
    <label
      htmlFor={id}
      className="glass-toggle flex items-center gap-3"
      style={{ opacity: disabled ? 0.45 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleClick}
        disabled={disabled}
        aria-checked={checked}
      />
      <span className="glass-toggle-track" style={{ pointerEvents: 'none' }}>
        <span className="glass-toggle-thumb" />
      </span>
      {label && (
        <span
          className="font-body text-[14px] select-none"
          style={{ color: checked ? 'var(--t1)' : 'var(--t2)', transition: 'color 0.2s' }}
        >
          {label}
        </span>
      )}
    </label>
  );
}
