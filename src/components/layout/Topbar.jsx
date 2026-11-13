import { Link } from 'react-router-dom';
import { HardDrive, Menu, Plus, Settings } from 'lucide-react';
import { Button, ThemeToggle } from '../common';

export function Topbar({ title = 'Consumer Workspace', onOpenSidebar }) {
  return (
    <header className="gs-topbar">
      <div className="gs-topbar-left">
        <button
          type="button"
          className="gs-btn gs-btn-ghost gs-btn-sm gs-mobile-menu-btn"
          onClick={onOpenSidebar}
          aria-label="Open navigation sidebar"
        >
          <Menu size={20} />
        </button>
        <span className="gs-topbar-title">{title}</span>
      </div>

      <div className="gs-topbar-right">
        <span
          className="gs-user-chip gs-desktop-only"
          title="Cases and documents are persisted locally in your browser"
        >
          <HardDrive size={14} color="var(--color-accent-green)" />
          <span>Local Workspace</span>
        </span>

        <ThemeToggle />

        <Link to="/case/new" className="gs-desktop-only">
          <Button variant="accent" size="sm" icon={Plus}>
            New Complaint
          </Button>
        </Link>

        <Link
          to="/settings"
          className="gs-btn gs-btn-ghost gs-btn-sm"
          aria-label="Preferences and local storage settings"
          title="Settings"
        >
          <Settings size={18} />
        </Link>
      </div>
    </header>
  );
}
