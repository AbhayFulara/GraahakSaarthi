import { NavLink, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FilePlus2,
  Files,
  Scale,
  Settings,
  Info,
  X,
  FolderOpen,
  Upload,
  FileSearch,
  Clock,
  BrainCircuit,
  Route as RouteIcon,
  Calculator,
  FileEdit,
  CheckSquare,
} from 'lucide-react';
import { BrandLogo } from '../common';

export function Sidebar({ isOpen, onClose }) {
  const { id: caseId } = useParams();

  const closeOnMobile = () => {
    if (onClose) onClose();
  };

  return (
    <>
      <div
        className={`gs-sidebar-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`gs-sidebar ${isOpen ? 'is-open' : ''}`} aria-label="Workspace navigation">
        <div className="gs-sidebar-brand">
          <BrandLogo to="/dashboard" size={38} showTagline darkSurface compact />
          <button
            type="button"
            className="gs-btn gs-btn-ghost gs-btn-sm gs-mobile-menu-btn"
            style={{ color: '#ffffff' }}
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="gs-sidebar-nav">
          <div className="gs-sidebar-section-label">Workspace</div>
          <NavLink
            to="/dashboard"
            end
            onClick={closeOnMobile}
            className={({ isActive }) => `gs-sidebar-link ${isActive ? 'is-active' : ''}`}
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/cases"
            end
            onClick={closeOnMobile}
            className={({ isActive }) => `gs-sidebar-link ${isActive ? 'is-active' : ''}`}
          >
            <Briefcase size={17} />
            <span>My Cases</span>
          </NavLink>
          <NavLink
            to="/case/new"
            onClick={closeOnMobile}
            className={({ isActive }) => `gs-sidebar-link ${isActive ? 'is-active' : ''}`}
          >
            <FilePlus2 size={17} />
            <span>New Complaint</span>
          </NavLink>
          <NavLink
            to="/documents"
            onClick={closeOnMobile}
            className={({ isActive }) => `gs-sidebar-link ${isActive ? 'is-active' : ''}`}
          >
            <Files size={17} />
            <span>Documents</span>
          </NavLink>
          <NavLink
            to="/assistant"
            onClick={closeOnMobile}
            className={({ isActive }) => `gs-sidebar-link ${isActive ? 'is-active' : ''}`}
          >
            <Scale size={17} />
            <span>Consumer Rights Assistant</span>
          </NavLink>

          {caseId && caseId !== 'new' && (
            <>
              <div className="gs-sidebar-section-label" style={{ marginTop: 12 }}>
                Case Workspace
              </div>
              <NavLink
                to={`/case/${caseId}`}
                end
                onClick={closeOnMobile}
                className={({ isActive }) => `gs-sidebar-link ${isActive ? 'is-active' : ''}`}
              >
                <FolderOpen size={17} />
                <span>Overview</span>
              </NavLink>
              <NavLink
                to={`/case/${caseId}/evidence`}
                onClick={closeOnMobile}
                className={({ isActive }) => `gs-sidebar-link ${isActive ? 'is-active' : ''}`}
              >
                <Upload size={17} />
                <span>Evidence</span>
              </NavLink>
              <NavLink
                to={`/case/${caseId}/evidence-analysis`}
                onClick={closeOnMobile}
                className={({ isActive }) => `gs-sidebar-link ${isActive ? 'is-active' : ''}`}
              >
                <FileSearch size={17} />
                <span>Evidence Analysis</span>
              </NavLink>
              <NavLink
                to={`/case/${caseId}/timeline`}
                onClick={closeOnMobile}
                className={({ isActive }) => `gs-sidebar-link ${isActive ? 'is-active' : ''}`}
              >
                <Clock size={17} />
                <span>Timeline</span>
              </NavLink>
              <NavLink
                to={`/case/${caseId}/analysis`}
                onClick={closeOnMobile}
                className={({ isActive }) => `gs-sidebar-link ${isActive ? 'is-active' : ''}`}
              >
                <BrainCircuit size={17} />
                <span>AI Analysis</span>
              </NavLink>
              <NavLink
                to={`/case/${caseId}/route`}
                onClick={closeOnMobile}
                className={({ isActive }) => `gs-sidebar-link ${isActive ? 'is-active' : ''}`}
              >
                <RouteIcon size={17} />
                <span>Grievance Route</span>
              </NavLink>
              <NavLink
                to={`/case/${caseId}/loss`}
                onClick={closeOnMobile}
                className={({ isActive }) => `gs-sidebar-link ${isActive ? 'is-active' : ''}`}
              >
                <Calculator size={17} />
                <span>Financial Impact</span>
              </NavLink>
              <NavLink
                to={`/case/${caseId}/draft`}
                onClick={closeOnMobile}
                className={({ isActive }) => `gs-sidebar-link ${isActive ? 'is-active' : ''}`}
              >
                <FileEdit size={17} />
                <span>Complaint Draft</span>
              </NavLink>
              <NavLink
                to={`/case/${caseId}/track`}
                onClick={closeOnMobile}
                className={({ isActive }) => `gs-sidebar-link ${isActive ? 'is-active' : ''}`}
              >
                <CheckSquare size={17} />
                <span>Tracking</span>
              </NavLink>
            </>
          )}

          <div className="gs-sidebar-section-label" style={{ marginTop: 12 }}>
            Preferences
          </div>
          <NavLink
            to="/settings"
            onClick={closeOnMobile}
            className={({ isActive }) => `gs-sidebar-link ${isActive ? 'is-active' : ''}`}
          >
            <Settings size={17} />
            <span>Settings</span>
          </NavLink>
          <NavLink
            to="/"
            onClick={closeOnMobile}
            className={({ isActive }) => `gs-sidebar-link ${isActive ? 'is-active' : ''}`}
          >
            <Info size={17} />
            <span>Homepage</span>
          </NavLink>
        </nav>

        <div className="gs-sidebar-footer">
          <div className="gs-text-xs" style={{ color: '#9cb4cf', padding: '4px 8px', lineHeight: 1.4 }}>
            Browser-only MVP mode · Cases saved locally on this device
          </div>
        </div>
      </aside>
    </>
  );
}
