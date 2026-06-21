export default function SkeletonCard({ height = 200, lines = 3 }) {
  return (
    <div
      className="glass-panel p-5"
      style={{ height, overflow: 'hidden' }}
    >
      {/* Header shimmer */}
      <div className="skeleton mb-5 rounded-xl" style={{ height: 16, width: '55%' }} />
      {/* Line shimmers */}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton mb-3 rounded-xl"
          style={{
            height: 12,
            width: i % 2 === 0 ? '100%' : '75%',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
      {/* Bottom icon placeholder */}
      <div className="skeleton rounded-full mt-4" style={{ height: 32, width: 32 }} />
    </div>
  );
}
