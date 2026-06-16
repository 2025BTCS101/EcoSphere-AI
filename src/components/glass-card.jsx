export default function GlassCard({ children, className = '', hoverEffect = true, onClick }) {
  return (
    <div 
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      className={`glass-card ${hoverEffect ? 'glass-card-hover' : ''} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
