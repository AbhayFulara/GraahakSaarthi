import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'Unable to load information',
  description = 'Something went wrong while communicating with the server.',
  onRetry,
  retryLabel = 'Try Again',
}) {
  return (
    <div className="gs-state-box" role="alert">
      <div className="gs-state-icon gs-state-icon-danger">
        <AlertCircle size={22} aria-hidden="true" />
      </div>
      <h3 className="gs-state-title">{title}</h3>
      <p className="gs-state-desc">{description}</p>
      {onRetry && (
        <div style={{ marginTop: 6 }}>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
