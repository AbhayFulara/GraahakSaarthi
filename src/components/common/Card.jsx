export function Card({ title, subtitle, action, footer, children, className = '', noPadding = false }) {
  return (
    <section className={`gs-card ${className}`.trim()}>
      {(title || action) && (
        <header className="gs-card-header">
          <div>
            {title && <h2 className="gs-section-title">{title}</h2>}
            {subtitle && <p className="gs-text-sm gs-muted" style={{ marginTop: 2 }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </header>
      )}
      <div className={noPadding ? '' : 'gs-card-body'}>{children}</div>
      {footer && <footer className="gs-card-footer">{footer}</footer>}
    </section>
  );
}
