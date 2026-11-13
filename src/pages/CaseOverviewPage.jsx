import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  BrainCircuit,
  Calculator,
  CheckSquare,
  Clock,
  FileEdit,
  FileSearch,
  Files,
  Route as RouteIcon,
  Scale,
  Upload,
} from 'lucide-react';
import { CaseWorkspaceLayout } from '../components/case/CaseWorkspaceLayout';
import { Badge, Button, Card, ErrorState, Spinner } from '../components/common';
import { useCaseDetails } from '../hooks/useCaseDetails';
import { useDocuments } from '../hooks/useDocuments';
import { CASE_STATUSES, MVP_ISSUE_CATEGORIES, REQUESTED_REMEDIES } from '../utils/constants';
import { formatCurrencyINR, formatDate, getCategoryLabel } from '../utils/formatters';

export function CaseOverviewPage() {
  const { id } = useParams();
  const { caseData, loading, error, refreshCase, updateCase } = useCaseDetails(id);
  const { documents } = useDocuments(id);

  const handleStatusChange = async (e) => {
    const nextStatus = e.target.value;
    try {
      await updateCase(
        { status: nextStatus, tracking: { ...(caseData?.tracking || {}), currentStatus: nextStatus } },
        `Status changed to ${nextStatus}`
      );
      toast.success(`Case status updated to ${nextStatus}.`);
    } catch (err) {
      toast.error(err.message || 'Unable to update status.');
    }
  };

  const quickModules = [
    {
      to: `/case/${id}/evidence`,
      icon: Upload,
      title: 'Evidence Centre',
      desc: 'Add, preview, and organize invoices, receipts, and screenshots.',
    },
    {
      to: `/case/${id}/evidence-analysis`,
      icon: FileSearch,
      title: 'Evidence Analysis',
      desc: 'Add manual evidence notes and view classification structure.',
    },
    {
      to: `/case/${id}/timeline`,
      icon: Clock,
      title: 'Case Timeline',
      desc: 'Add, edit, and organize chronological case events.',
    },
    {
      to: `/case/${id}/analysis`,
      icon: BrainCircuit,
      title: 'AI Case Analysis',
      desc: 'Future AI findings workspace (waiting for AI integration).',
    },
    {
      to: `/assistant?caseId=${id}`,
      icon: Scale,
      title: 'Consumer Rights Assistant',
      desc: 'Rights guidance workspace linked to this case context.',
    },
    {
      to: `/case/${id}/route`,
      icon: RouteIcon,
      title: 'Grievance Route Navigator',
      desc: 'Escalation stages from seller contact to commission prep.',
    },
    {
      to: `/case/${id}/loss`,
      icon: Calculator,
      title: 'Financial Loss Calculator',
      desc: 'Calculate documented monetary loss in INR.',
    },
    {
      to: `/case/${id}/draft`,
      icon: FileEdit,
      title: 'Complaint Draft Editor',
      desc: 'Manually edit, preview, copy, and print your complaint.',
    },
    {
      to: `/case/${id}/track`,
      icon: CheckSquare,
      title: 'Case Tracking',
      desc: 'Track milestones, reference numbers, and follow-up tasks.',
    },
  ];

  const documentedLossTotal = (caseData?.lossItems || []).reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );

  return (
    <CaseWorkspaceLayout
      title="Case Overview"
      caseData={caseData}
      actions={
        <Link to={`/case/${id}/evidence`}>
          <Button variant="accent" size="sm" icon={Upload}>
            Add Evidence ({documents.length})
          </Button>
        </Link>
      }
    >
      {loading && <Spinner centered label="Loading case workspace..." />}

      {!loading && error && (
        <ErrorState
          title="Unable to load case overview"
          description={error}
          onRetry={refreshCase}
        />
      )}

      {!loading && !error && caseData && (
        <div className="gs-stack-lg">
          {/* Core Summary Grid */}
          <div className="gs-grid-2">
            <Card
              title="Complaint Details"
              subtitle={getCategoryLabel(caseData.category, MVP_ISSUE_CATEGORIES)}
            >
              <div className="gs-stack">
                <div>
                  <span className="gs-text-xs gs-muted">Product / Service</span>
                  <div style={{ fontWeight: 600 }}>{caseData.productName || '—'}</div>
                </div>
                <div>
                  <span className="gs-text-xs gs-muted">Seller / Platform</span>
                  <div style={{ fontWeight: 600 }}>{caseData.sellerName || '—'}</div>
                </div>
                <div>
                  <span className="gs-text-xs gs-muted">Order / Reference Number</span>
                  <div style={{ fontWeight: 600 }}>{caseData.orderNumber || '—'}</div>
                </div>
                <div>
                  <span className="gs-text-xs gs-muted">Problem Description</span>
                  <p className="gs-text-sm" style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>
                    {caseData.description || 'No description provided.'}
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Status, Financial Scope &amp; Documents">
              <div className="gs-stack">
                <div className="gs-row-between">
                  <span className="gs-text-sm gs-muted">Case Reference</span>
                  <Badge tone="info">{caseData.referenceNumber}</Badge>
                </div>

                <div className="gs-row-between">
                  <label htmlFor="case-status-select" className="gs-text-sm gs-muted">
                    Current Status
                  </label>
                  <select
                    id="case-status-select"
                    className="gs-select"
                    style={{ width: 'auto', padding: '5px 10px', fontSize: '0.85rem' }}
                    value={caseData.status || 'Open'}
                    onChange={handleStatusChange}
                  >
                    {CASE_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="gs-row-between">
                  <span className="gs-text-sm gs-muted">Created On</span>
                  <span className="gs-text-sm" style={{ fontWeight: 600 }}>
                    {formatDate(caseData.createdAt)}
                  </span>
                </div>

                <div className="gs-row-between">
                  <span className="gs-text-sm gs-muted">Purchase / Incident Dates</span>
                  <span className="gs-text-sm" style={{ fontWeight: 600 }}>
                    {formatDate(caseData.purchaseDate)} / {formatDate(caseData.incidentDate)}
                  </span>
                </div>

                <div className="gs-row-between">
                  <span className="gs-text-sm gs-muted">Primary Amount Involved</span>
                  <span className="gs-text-sm" style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                    {formatCurrencyINR(caseData.amountInvolved)}
                  </span>
                </div>

                <div className="gs-row-between">
                  <span className="gs-text-sm gs-muted">Itemized Documented Loss</span>
                  <span className="gs-text-sm" style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                    {caseData.lossItems?.length
                      ? formatCurrencyINR(documentedLossTotal)
                      : 'Not itemized yet'}
                  </span>
                </div>

                <div className="gs-row-between">
                  <span className="gs-text-sm gs-muted">Requested Remedy</span>
                  <span className="gs-text-sm" style={{ fontWeight: 600 }}>
                    {REQUESTED_REMEDIES.find((r) => r.value === caseData.requestedRemedy)?.label ||
                      caseData.requestedRemedy ||
                      '—'}
                  </span>
                </div>

                <div className="gs-row-between">
                  <span className="gs-text-sm gs-muted">Supporting Documents</span>
                  <span
                    className="gs-text-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
                  >
                    <Files size={15} color="var(--color-secondary-blue)" />
                    {documents.length} file(s)
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Case Modules Navigation */}
          <div>
            <h2 className="gs-section-title" style={{ marginBottom: 14 }}>
              Case Workspace Modules
            </h2>
            <div className="gs-grid-3">
              {quickModules.map((mod) => {
                const Icon = mod.icon;
                return (
                  <Link key={mod.to} to={mod.to} style={{ textDecoration: 'none' }}>
                    <Card className="gs-hover-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div className="gs-pipeline-icon">
                          <Icon size={18} />
                        </div>
                        <h3 style={{ fontSize: '0.96rem' }}>{mod.title}</h3>
                      </div>
                      <p className="gs-text-xs gs-muted">{mod.desc}</p>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </CaseWorkspaceLayout>
  );
}
