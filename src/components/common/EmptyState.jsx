import { Inbox } from 'lucide-react';

export function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="gs-state-box">
      <div className="gs-state-icon">
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3 className="gs-state-title">{title}</h3>
      {description && <p className="gs-state-desc">{description}</p>}
      {action && <div style={{ marginTop: 6 }}>{action}</div>}
    </div>
  );
}
