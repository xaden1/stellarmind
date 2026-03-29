export default function SkeletonCard({ height = 200, lines = 3 }) {
  return (
    <div className="card p-5" style={{ height }}>
      <div className="skeleton mb-4" style={{ height: 16, width: '60%' }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton mb-2"
          style={{ height: 12, width: i % 2 === 0 ? '100%' : '80%' }}
        />
      ))}
    </div>
  );
}
