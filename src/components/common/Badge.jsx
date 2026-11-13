export function Badge({ tone = 'neutral', children, icon: Icon, className = '' }) {
  return (
    <span className={`gs-badge gs-badge-${tone} ${className}`.trim()}>
      {Icon && <Icon size={12} aria-hidden="true" />}
      {children}
    </span>
  );
}
