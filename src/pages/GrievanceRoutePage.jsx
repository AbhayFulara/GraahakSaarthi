import { useParams } from 'react-router-dom';
import { CloudOff, Info, Route as RouteIcon, ShieldAlert } from 'lucide-react';
import { CaseWorkspaceLayout } from '../components/case/CaseWorkspaceLayout';
import { Badge, Card, ErrorState, Spinner } from '../components/common';
import { useCaseDetails } from '../hooks/useCaseDetails';
import { MVP_ISSUE_CATEGORIES } from '../utils/constants';
import { getCategoryLabel } from '../utils/formatters';

const ROUTE_STAGE_BLUEPRINTS = [
  {
    step: 1,
    title: 'Seller / Platform Contact',
    scope: 'Direct merchant customer care or e-commerce grievance officer stage',
  },
  {
    step: 2,
    title: 'National Consumer Helpline (NCH)',
    scope: 'Pre-litigation consumer grievance registration channel',
  },
  {
    step: 3,
    title: 'Appropriate Further Grievance Escalation',
    scope: 'Sectoral ombudsman, regulator, or statutory escalation (when applicable)',
  },
  {
    step: 4,
    title: 'Consumer Commission Preparation',
    scope: 'Structured documentation and filing preparation for appropriate Consumer Commission',
  },
];

export function GrievanceRoutePage() {
  const { id: caseId } = useParams();
  const { caseData, loading, error, refreshCase } = useCaseDetails(caseId);

  return (
    <CaseWorkspaceLayout title="Grievance Route Navigator" caseData={caseData}>
      {loading && <Spinner centered label="Loading grievance route structure..." />}

      {!loading && error && (
        <ErrorState
          title="Unable to load case details"
          description={error}
          onRetry={refreshCase}
        />
      )}

      {!loading && !error && caseData && (
        <div className="gs-stack-lg">
          {/* Mandatory Non-Government Portal Disclosure */}
          <div className="gs-banner gs-banner-warning">
            <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Important Disclosure:</strong> GraahakSaarthi is an independent consumer
              assistance workspace, <strong>not</strong> an official government complaint-filing
              portal. Formal grievances must be submitted directly on authorized portals.
            </div>
          </div>

          {/* Not-Yet-Configured State Banner */}
          <div className="gs-banner gs-banner-info">
            <CloudOff size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Verified Route Rules Not Yet Configured:</strong> Case-specific grievance
              recommendations for{' '}
              <strong>{getCategoryLabel(caseData.category, MVP_ISSUE_CATEGORIES)}</strong> will be
              computed once the verified route-rules engine is connected. No unverified escalation
              advice or universal deadlines are shown below.
            </div>
          </div>

          <Card
            title="Prepared Grievance Pathway Structure"
            subtitle="Visual structure ready for verified backend route recommendations"
            action={<Badge tone="neutral">Rules Pending</Badge>}
          >
            <div className="gs-stack">
              {ROUTE_STAGE_BLUEPRINTS.map((stage) => (
                <div
                  key={stage.step}
                  style={{
                    border: '1px dashed var(--color-border-strong)',
                    borderRadius: 'var(--radius-md)',
                    padding: 16,
                    backgroundColor: 'var(--color-surface-muted)',
                    display: 'flex',
                    gap: 14,
                    alignItems: 'flex-start',
                  }}
                >
                  <span className="gs-step-num">{stage.step}</span>
                  <div style={{ flex: 1 }}>
                    <div className="gs-row-between" style={{ marginBottom: 4 }}>
                      <h3 style={{ fontSize: '1rem' }}>{stage.title}</h3>
                      <Badge tone="neutral">Awaiting Verified Rules</Badge>
                    </div>
                    <p className="gs-text-sm gs-muted">{stage.scope}</p>
                    <div
                      className="gs-text-xs gs-muted"
                      style={{
                        marginTop: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Info size={13} />
                      <span>
                        Applicable eligibility, reason, and official portal steps will populate
                        after route-engine integration.
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <RouteIcon size={18} color="var(--color-secondary-blue)" />
              <span className="gs-text-sm gs-muted">
                While waiting for route-rule integration, you can keep preparing your evidence and
                draft complaint in the <strong>Financial Impact</strong> and{' '}
                <strong>Complaint Draft</strong> tabs.
              </span>
            </div>
          </Card>
        </div>
      )}
    </CaseWorkspaceLayout>
  );
}
