import { Loader2 } from 'lucide-react';

export function Spinner({ label = 'Loading...', size = 20, centered = false }) {
  if (centered) {
    return (
      <div className="gs-state-box" style={{ borderStyle: 'solid' }}>
        <div className="gs-spinner-wrap">
          <Loader2 size={size} className="gs-spinner" aria-hidden="true" />
          <span>{label}</span>
        </div>
      </div>
    );
  }

  return (
    <span className="gs-spinner-wrap">
      <Loader2 size={size} className="gs-spinner" aria-hidden="true" />
      {label && <span>{label}</span>}
    </span>
  );
}
