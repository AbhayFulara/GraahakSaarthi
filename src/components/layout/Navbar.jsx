import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { BrandLogo, Button, ThemeToggle } from '../common';

const NAV_ITEMS = [
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/capabilities', label: 'Capabilities' },
  { to: '/disputes', label: 'Dispute Coverage' },
  { to: '/trust', label: 'Trust & Privacy' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="gs-public-header">
      <div className="gs-container gs-public-header-inner">
        <BrandLogo to="/" size={44} showTagline />

        <nav className="gs-public-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `gs-public-nav-link ${isActive ? 'is-active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="gs-public-actions">
          <ThemeToggle />
          <Link to="/dashboard">
            <Button variant="secondary" size="sm">
              Open Dashboard
            </Button>
          </Link>
          <Link to="/case/new">
            <Button variant="accent" size="sm">
              New Complaint
            </Button>
          </Link>
        </div>

        <div className="gs-mobile-menu-btn" style={{ alignItems: 'center', gap: 8 }}>
          <ThemeToggle />
          <button
            type="button"
            className="gs-btn gs-btn-ghost gs-btn-sm"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className={`gs-public-mobile-menu ${mobileMenuOpen ? 'is-open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `gs-public-nav-link ${isActive ? 'is-active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}

        <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
          <Link to="/dashboard" style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)}>
            <Button variant="secondary" block>
              Open Dashboard
            </Button>
          </Link>
          <Link to="/case/new" style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)}>
            <Button variant="accent" block>
              New Complaint
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
