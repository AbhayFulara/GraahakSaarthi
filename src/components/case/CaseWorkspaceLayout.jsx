import { Link, NavLink, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  FolderOpen,
  Upload,
  FileSearch,
  Clock,
  BrainCircuit,
  Scale,
  Route as RouteIcon,
  Calculator,
  FileEdit,
  CheckSquare,
} from 'lucide-react';
import { AppLayout } from '../layout/AppLayout';
import { Badge } from '../common';

export function CaseWorkspaceLayout({
  title = 'Case Workspace',
  caseData,
  actions,
  children,
}) {
  const { id } = useParams();

  const tabs = [
    { to: `/case/${id}`, label: 'Overview', icon: FolderOpen, end: true },
    { to: `/case/${id}/evidence`, label: 'Evidence', icon: Upload },
    { to: `/case/${id}/evidence-analysis`, label: 'Evidence Analysis', icon: FileSearch },
    { to: `/case/${id}/timeline`, label: 'Timeline', icon: Clock },
    { to: `/case/${id}/analysis`, label: 'AI Analysis', icon: BrainCircuit },
    { to: `/assistant?caseId=${id}`, label: 'Consumer Rights', icon: Scale },
    { to: `/case/${id}/route`, label: 'Grievance Route', icon: RouteIcon },
    { to: `/case/${id}/loss`, label: 'Financial Impact', icon: Calculator },
    { to: `/case/${id}/draft`, label: 'Complaint Draft', icon: FileEdit },
    { to: `/case/${id}/track`, label: 'Tracking', icon: CheckSquare },
  ];

  const caseTitle = caseData?.title || caseData?.productName || `Case #${id}`;
  const reference = caseData?.referenceNumber || `GS-${id}`;

  return (
    <AppLayout title={title}>
      <div style={{ marginBottom: 16 }}>
        <Link
          to="/cases"
          className="gs-text-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
        >
          <ArrowLeft size={15} />
          Back to My Cases
        </Link>
      </div>

      <div className="gs-row-between" style={{ marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 className="gs-page-title">{caseTitle}</h1>
            <Badge tone="info">{reference}</Badge>
            {caseData?.status && <Badge tone="neutral">{caseData.status}</Badge>}
          </div>
          {caseData?.sellerName && (
            <p className="gs-page-subtitle">Seller / Platform: {caseData.sellerName}</p>
          )}
        </div>
        {actions && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{actions}</div>}
      </div>

      <nav className="gs-case-subnav" aria-label="Case sections">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => `gs-case-tab ${isActive ? 'is-active' : ''}`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {children}
    </AppLayout>
  );
}
