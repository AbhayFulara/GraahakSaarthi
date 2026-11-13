import { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="gs-modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className={`gs-modal ${size === 'lg' ? 'gs-modal-lg' : ''}`}>
        <div className="gs-modal-header">
          <h3 className="gs-section-title">{title}</h3>
          <button
            type="button"
            className="gs-btn gs-btn-ghost gs-btn-sm"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="gs-modal-body">{children}</div>
        {footer && <div className="gs-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
