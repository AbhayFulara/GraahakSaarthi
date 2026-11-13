import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  Edit3,
  FilePlus2,
  FolderOpen,
  Search,
  Trash2,
} from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Input,
  Modal,
  Select,
  Spinner,
  Textarea,
} from '../components/common';
import { useCases } from '../hooks/useCases';
import { CASE_STATUSES, MVP_ISSUE_CATEGORIES } from '../utils/constants';
import { formatCurrencyINR, formatDate, getCategoryLabel } from '../utils/formatters';

function getStatusTone(status) {
  const normalized = (status || '').toLowerCase();
  if (normalized.includes('resolved') || normalized.includes('closed')) return 'success';
  if (normalized.includes('pending')) return 'warning';
  if (normalized.includes('open') || normalized.includes('draft')) return 'info';
  return 'neutral';
}

export function MyCasesPage() {
  const { cases, loading, error, refreshCases, updateCase, deleteCase } = useCases();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filteredCases = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cases.filter((item) => {
      const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || (item.status || 'Open') === statusFilter;
      const matchesQuery =
        !q ||
        (item.title || '').toLowerCase().includes(q) ||
        (item.productName || '').toLowerCase().includes(q) ||
        (item.sellerName || '').toLowerCase().includes(q) ||
        (item.referenceNumber || '').toLowerCase().includes(q) ||
        (item.orderNumber || '').toLowerCase().includes(q);
      return matchesCat && matchesStatus && matchesQuery;
    });
  }, [cases, categoryFilter, statusFilter, searchQuery]);

  const openEditModal = (c) => {
    setEditTarget(c);
    setEditForm({
      title: c.title || '',
      category: c.category || '',
      productName: c.productName || '',
      sellerName: c.sellerName || '',
      orderNumber: c.orderNumber || '',
      amountInvolved: c.amountInvolved ?? '',
      status: c.status || 'Open',
      description: c.description || '',
      requiresAttention: Boolean(c.requiresAttention),
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) {
      toast.error('Case title cannot be empty.');
      return;
    }

    setSavingEdit(true);
    try {
      await updateCase(
        editTarget.id,
        {
          title: editForm.title.trim(),
          category: editForm.category,
          productName: editForm.productName.trim(),
          sellerName: editForm.sellerName.trim(),
          orderNumber: editForm.orderNumber.trim(),
          amountInvolved:
            editForm.amountInvolved !== '' ? Number(editForm.amountInvolved) : null,
          status: editForm.status,
          description: editForm.description.trim(),
          requiresAttention: Boolean(editForm.requiresAttention),
        },
        'Updated case information'
      );
      toast.success('Case updated.');
      setEditTarget(null);
    } catch (err) {
      toast.error(err.message || 'Unable to update case.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCase(deleteTarget.id);
      toast.success('Case and its local records removed.');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Unable to delete case.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppLayout title="My Cases">
      <div className="gs-stack-lg">
        <div className="gs-row-between">
          <div>
            <h1 className="gs-page-title">My Consumer Cases</h1>
            <p className="gs-page-subtitle">
              All complaints saved in your browser. Search, filter, edit details, or open any case
              workspace.
            </p>
          </div>
          <Link to="/case/new">
            <Button variant="accent" icon={FilePlus2}>
              New Complaint
            </Button>
          </Link>
        </div>

        {/* Search & Filters */}
        <Card>
          <div className="gs-grid-3">
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                type="search"
                className="gs-input"
                style={{ paddingLeft: 36 }}
                placeholder="Search title, seller, order or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search cases"
              />
            </div>

            <select
              className="gs-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {MVP_ISSUE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>

            <select
              className="gs-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              {CASE_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {loading && <Spinner centered label="Loading cases..." />}

        {!loading && error && (
          <ErrorState title="Unable to load cases" description={error} onRetry={refreshCases} />
        )}

        {!loading && !error && cases.length === 0 && (
          <EmptyState
            icon={FolderOpen}
            title="No cases created yet"
            description="Create your first consumer complaint to start organizing evidence, timeline events, and financial impact."
            action={
              <Link to="/case/new">
                <Button variant="primary" icon={FilePlus2}>
                  Create New Complaint
                </Button>
              </Link>
            }
          />
        )}

        {!loading && !error && cases.length > 0 && filteredCases.length === 0 && (
          <Card>
            <p className="gs-text-sm gs-muted">No cases match your search or selected filters.</p>
          </Card>
        )}

        {!loading && !error && filteredCases.length > 0 && (
          <div className="gs-stack">
            {filteredCases.map((item) => (
              <Card key={item.id}>
                <div className="gs-row-between" style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <Link
                      to={`/case/${item.id}`}
                      style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--color-navy)' }}
                    >
                      {item.title || item.productName}
                    </Link>
                    <Badge tone="info">{item.referenceNumber}</Badge>
                    <Badge tone={getStatusTone(item.status)}>{item.status || 'Open'}</Badge>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Edit3}
                      onClick={() => openEditModal(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => setDeleteTarget(item)}
                    >
                      Delete
                    </Button>
                    <Link to={`/case/${item.id}`}>
                      <Button variant="primary" size="sm" icon={ArrowRight}>
                        Open
                      </Button>
                    </Link>
                  </div>
                </div>

                <div
                  className="gs-text-sm gs-muted"
                  style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}
                >
                  <span>
                    <strong>Category:</strong> {getCategoryLabel(item.category, MVP_ISSUE_CATEGORIES)}
                  </span>
                  <span>
                    <strong>Seller / Platform:</strong> {item.sellerName || '—'}
                  </span>
                  <span>
                    <strong>Created:</strong> {formatDate(item.createdAt)}
                  </span>
                  {item.amountInvolved !== null && item.amountInvolved !== undefined && (
                    <span>
                      <strong>Amount:</strong> {formatCurrencyINR(item.amountInvolved)}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Case Modal */}
      <Modal
        isOpen={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        title="Edit Consumer Case"
        size="lg"
      >
        <form onSubmit={handleSaveEdit} className="gs-stack">
          <Input
            label="Case Title"
            required
            value={editForm.title || ''}
            onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
          />
          <div className="gs-grid-2">
            <Select
              label="Dispute Category"
              options={MVP_ISSUE_CATEGORIES.map((c) => ({ value: c.id, label: c.label }))}
              value={editForm.category || ''}
              onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
            />
            <Select
              label="Current Status"
              options={CASE_STATUSES.map((s) => ({ value: s, label: s }))}
              value={editForm.status || 'Open'}
              onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
            />
            <Input
              label="Product / Service"
              value={editForm.productName || ''}
              onChange={(e) => setEditForm((p) => ({ ...p, productName: e.target.value }))}
            />
            <Input
              label="Seller / Platform"
              value={editForm.sellerName || ''}
              onChange={(e) => setEditForm((p) => ({ ...p, sellerName: e.target.value }))}
            />
            <Input
              label="Order / Reference Number"
              value={editForm.orderNumber || ''}
              onChange={(e) => setEditForm((p) => ({ ...p, orderNumber: e.target.value }))}
            />
            <Input
              label="Amount Involved (INR)"
              type="number"
              min="0"
              step="0.01"
              value={editForm.amountInvolved ?? ''}
              onChange={(e) => setEditForm((p) => ({ ...p, amountInvolved: e.target.value }))}
            />
          </div>
          <Textarea
            label="Problem Description"
            rows={4}
            value={editForm.description || ''}
            onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
            <input
              type="checkbox"
              checked={Boolean(editForm.requiresAttention)}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, requiresAttention: e.target.checked }))
              }
            />
            <span>Flag this case as requiring attention on the dashboard</span>
          </label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="secondary" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={savingEdit}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Case"
        message={`Delete "${deleteTarget?.title}" (${deleteTarget?.referenceNumber}) along with its locally attached documents and tasks? This cannot be undone.`}
        confirmLabel="Delete Case"
        loading={deleting}
      />
    </AppLayout>
  );
}
