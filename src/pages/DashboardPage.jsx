import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckSquare,
  Clock,
  FilePlus2,
  Files,
  FolderOpen,
} from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Spinner,
} from '../components/common';
import { useCases } from '../hooks/useCases';
import { useCaseTasks } from '../hooks/useCaseTasks';
import { useDocuments } from '../hooks/useDocuments';
import { MVP_ISSUE_CATEGORIES } from '../utils/constants';
import { formatCurrencyINR, formatDate, getCategoryLabel } from '../utils/formatters';

function getStatusTone(status) {
  const normalized = (status || '').toLowerCase();
  if (normalized.includes('resolved') || normalized.includes('closed')) return 'success';
  if (normalized.includes('attention') || normalized.includes('pending')) return 'warning';
  if (normalized.includes('draft') || normalized.includes('open')) return 'info';
  return 'neutral';
}

export function DashboardPage() {
  const { cases, loading, error, refreshCases } = useCases();
  const { tasks } = useCaseTasks();
  const { documents } = useDocuments();

  const activeCases = useMemo(
    () =>
      cases.filter((c) => {
        const s = (c.status || 'Open').toLowerCase();
        return s !== 'resolved' && s !== 'closed';
      }),
    [cases]
  );

  const pendingTasks = useMemo(() => {
    const caseMap = new Map(cases.map((c) => [c.id, c]));
    return tasks
      .filter((t) => !t.completed)
      .map((t) => {
        const parent = caseMap.get(t.caseId);
        return {
          ...t,
          caseTitle: parent?.title || parent?.productName || 'Consumer Case',
        };
      });
  }, [cases, tasks]);

  const attentionCases = useMemo(
    () =>
      cases.filter((c) => {
        const hasPendingTask = pendingTasks.some((t) => t.caseId === c.id);
        return c.requiresAttention || c.status === 'Evidence Pending' || hasPendingTask;
      }),
    [cases, pendingTasks]
  );

  const recentActivity = useMemo(() => {
    const entries = [];
    cases.forEach((c) => {
      if (Array.isArray(c.recentActivity)) {
        c.recentActivity.forEach((act) => {
          entries.push({
            ...act,
            caseId: c.id,
            caseTitle: c.title || c.productName || c.referenceNumber,
          });
        });
      }
    });
    return entries
      .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
      .slice(0, 6);
  }, [cases]);

  const nextActionCases = useMemo(
    () => cases.filter((c) => c.nextRecommendedAction && c.nextRecommendedAction.trim()),
    [cases]
  );

  return (
    <AppLayout title="Consumer Dashboard">
      <div className="gs-stack-lg">
        {/* Welcome Header */}
        <Card>
          <div className="gs-row-between">
            <div>
              <h1 className="gs-page-title">Consumer Assistance Workspace</h1>
              <p className="gs-page-subtitle">
                Organize your consumer complaints, preserve supporting evidence, and prepare
                structured grievances locally in your browser.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="/cases">
                <Button variant="secondary">My Cases</Button>
              </Link>
              <Link to="/case/new">
                <Button variant="accent" size="lg" icon={FilePlus2}>
                  New Complaint
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {loading && <Spinner centered label="Loading your local cases..." />}

        {!loading && error && (
          <ErrorState
            title="Could not load local cases"
            description={error}
            onRetry={refreshCases}
          />
        )}

        {!loading && !error && cases.length === 0 && (
          <EmptyState
            icon={FolderOpen}
            title="No complaints created yet"
            description="Start by documenting your consumer problem, adding order details, and attaching supporting receipts or screenshots. Everything is saved safely in your browser."
            action={
              <Link to="/case/new">
                <Button variant="primary" icon={FilePlus2}>
                  Create Your First Complaint
                </Button>
              </Link>
            }
          />
        )}

        {!loading && !error && cases.length > 0 && (
          <>
            {/* Real Locally-Computed Summary Strip */}
            <div className="gs-grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
              <Card>
                <div className="gs-row-between">
                  <span className="gs-text-xs gs-muted" style={{ fontWeight: 700 }}>
                    TOTAL CASES
                  </span>
                  <Briefcase size={16} color="var(--color-secondary-blue)" />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: 6 }}>
                  {cases.length}
                </div>
              </Card>

              <Card>
                <div className="gs-row-between">
                  <span className="gs-text-xs gs-muted" style={{ fontWeight: 700 }}>
                    ACTIVE CASES
                  </span>
                  <FolderOpen size={16} color="var(--color-accent-green)" />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: 6 }}>
                  {activeCases.length}
                </div>
              </Card>

              <Card>
                <div className="gs-row-between">
                  <span className="gs-text-xs gs-muted" style={{ fontWeight: 700 }}>
                    PENDING TASKS
                  </span>
                  <CheckSquare size={16} color="var(--color-warning)" />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: 6 }}>
                  {pendingTasks.length}
                </div>
              </Card>

              <Card>
                <div className="gs-row-between">
                  <span className="gs-text-xs gs-muted" style={{ fontWeight: 700 }}>
                    STORED DOCUMENTS
                  </span>
                  <Files size={16} color="var(--color-secondary-blue)" />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: 6 }}>
                  {documents.length}
                </div>
              </Card>
            </div>

            {/* Active Cases & Action Panels */}
            <div className="gs-dashboard-grid">
              <Card
                title={`Active Cases (${activeCases.length})`}
                subtitle="Open cases currently in progress"
                action={
                  <Link to="/cases" className="gs-text-sm" style={{ fontWeight: 600 }}>
                    View All ({cases.length})
                  </Link>
                }
              >
                {activeCases.length === 0 ? (
                  <p className="gs-text-sm gs-muted">
                    All your recorded cases are currently marked Resolved or Closed.
                  </p>
                ) : (
                  <div className="gs-stack">
                    {activeCases.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          padding: 16,
                          backgroundColor: 'var(--color-surface-muted)',
                        }}
                      >
                        <div className="gs-row-between" style={{ marginBottom: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <Link
                              to={`/case/${item.id}`}
                              style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-navy)' }}
                            >
                              {item.title || item.productName || item.referenceNumber}
                            </Link>
                            <Badge tone="info">{item.referenceNumber}</Badge>
                          </div>
                          <Badge tone={getStatusTone(item.status)}>
                            {item.status || 'Open'}
                          </Badge>
                        </div>

                        <div
                          className="gs-text-sm gs-muted"
                          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}
                        >
                          <span>{getCategoryLabel(item.category, MVP_ISSUE_CATEGORIES)}</span>
                          {item.sellerName && <span>Seller: {item.sellerName}</span>}
                          {item.amountInvolved !== null && item.amountInvolved !== undefined && (
                            <span>Amount: {formatCurrencyINR(item.amountInvolved)}</span>
                          )}
                        </div>

                        <div className="gs-row-between">
                          <span className="gs-text-xs gs-muted">
                            {item.nextRecommendedAction
                              ? `Next: ${item.nextRecommendedAction}`
                              : `Updated ${formatDate(item.updatedAt || item.createdAt)}`}
                          </span>
                          <Link to={`/case/${item.id}`}>
                            <Button variant="secondary" size="sm" icon={ArrowRight}>
                              Open Case
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <div className="gs-stack">
                <Card
                  title="Cases Requiring Attention"
                  subtitle="Flagged cases or evidence pending"
                >
                  {attentionCases.length === 0 ? (
                    <p className="gs-text-sm gs-muted">
                      No cases are currently flagged as requiring attention.
                    </p>
                  ) : (
                    <div className="gs-stack">
                      {attentionCases.map((c) => (
                        <Link
                          key={c.id}
                          to={`/case/${c.id}`}
                          className="gs-banner gs-banner-warning"
                          style={{ textDecoration: 'none' }}
                        >
                          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <div style={{ fontWeight: 700 }}>{c.title || c.productName}</div>
                            <div className="gs-text-xs">
                              {c.nextRecommendedAction || c.status}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </Card>

                <Card title="Pending Tasks" subtitle="Open follow-ups across cases">
                  {pendingTasks.length === 0 ? (
                    <p className="gs-text-sm gs-muted">
                      No pending tasks yet. Add follow-up tasks inside a case&apos;s Tracking tab.
                    </p>
                  ) : (
                    <div className="gs-stack">
                      {pendingTasks.slice(0, 6).map((task) => (
                        <div
                          key={task.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 10,
                            paddingBottom: 10,
                            borderBottom: '1px solid var(--color-border)',
                          }}
                        >
                          <CheckSquare
                            size={16}
                            color="var(--color-secondary-blue)"
                            style={{ marginTop: 2, flexShrink: 0 }}
                          />
                          <div>
                            <div className="gs-text-sm" style={{ fontWeight: 600 }}>
                              {task.title}
                            </div>
                            <Link to={`/case/${task.caseId}/track`} className="gs-text-xs">
                              {task.caseTitle}
                              {task.dueDate ? ` · Due ${formatDate(task.dueDate)}` : ''}
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <Card title="Next Actions">
                  {nextActionCases.length === 0 ? (
                    <p className="gs-text-sm gs-muted">
                      Set next action notes in a case&apos;s Tracking or Overview section to see them
                      highlighted here.
                    </p>
                  ) : (
                    <div className="gs-stack">
                      {nextActionCases.map((c) => (
                        <Link
                          key={c.id}
                          to={`/case/${c.id}/track`}
                          className="gs-banner gs-banner-info"
                          style={{ textDecoration: 'none' }}
                        >
                          <div>
                            <div style={{ fontWeight: 700 }}>{c.title}</div>
                            <div className="gs-text-xs">{c.nextRecommendedAction}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </Card>

                <Card title="Recent Case Activity">
                  {recentActivity.length === 0 ? (
                    <p className="gs-text-sm gs-muted">No recent activity logged.</p>
                  ) : (
                    <div className="gs-stack">
                      {recentActivity.map((act) => (
                        <div
                          key={act.id}
                          style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}
                        >
                          <Clock
                            size={15}
                            color="var(--color-text-muted)"
                            style={{ marginTop: 3, flexShrink: 0 }}
                          />
                          <div>
                            <Link
                              to={`/case/${act.caseId}`}
                              className="gs-text-sm"
                              style={{ fontWeight: 600, color: 'var(--color-navy)' }}
                            >
                              {act.caseTitle}
                            </Link>
                            <p className="gs-text-xs gs-muted">
                              {act.summary} · {formatDate(act.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
