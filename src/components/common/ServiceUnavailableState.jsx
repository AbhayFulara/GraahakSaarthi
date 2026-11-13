import { CloudOff } from 'lucide-react';

export function ServiceUnavailableState({
  title = 'AI or Backend Service Currently Unavailable',
  description = 'This analysis requires connection to the GraahakSaarthi backend / AI intelligence service. No synthetic or placeholder findings are shown.',
  action,
}) {
  return (
    <div className="gs-state-box">
      <div className="gs-state-icon gs-state-icon-warning">
        <CloudOff size={22} aria-hidden="true" />
      </div>
      <h3 className="gs-state-title">{title}</h3>
      <p className="gs-state-desc">{description}</p>
      {action && <div style={{ marginTop: 6 }}>{action}</div>}
    </div>
  );
}
