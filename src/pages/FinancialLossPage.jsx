import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Calculator, Edit3, Info, Plus, Trash2 } from 'lucide-react';
import { CaseWorkspaceLayout } from '../components/case/CaseWorkspaceLayout';
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
} from '../components/common';
import { useCaseDetails } from '../hooks/useCaseDetails';
import { useDocuments } from '../hooks/useDocuments';
import { REQUESTED_REMEDIES } from '../utils/constants';
import { formatCurrencyINR } from '../utils/formatters';

const LOSS_CATEGORIES = [
  { value: 'product_service', label: 'Product / Service Amount' },
  { value: 'delivery', label: 'Delivery Charges' },
  { value: 'repair', label: 'Repair Expenses' },
  { value: 'additional', label: 'Additional Expenses' },
  { value: 'other', label: 'Other Documented Losses' },
];

export function FinancialLossPage() {
  const { id: caseId } = useParams();
  const {
    caseData,
    loading,
    error,
    refreshCase,
    addLossItem,
    updateLossItem,
    deleteLossItem,
  } = useCaseDetails(caseId);
  const { documents } = useDocuments(caseId);

  const [form, setForm] = useState({
    category: 'product_service',
    label: '',
    amount: '',
    documentId: '',
  });
  const [saving, setSaving] = useState(false);

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const items = caseData?.lossItems || [];

  const totalDocumentedLoss = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [items]
  );

  const handleAddItem = async (e) => {
    e.preventDefault();
    const numericAmount = Number(form.amount);
    if (!form.label.trim() || Number.isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Please enter an expense description and a positive INR amount.');
      return;
    }

    const linkedDoc = documents.find((d) => d.id === form.documentId);
    setSaving(true);
    try {
      await addLossItem({
        category: form.category,
        label: form.label.trim(),
        amount: numericAmount,
        documentId: form.documentId || '',
        documentName: linkedDoc ? linkedDoc.fileName : '',
      });
      toast.success('Expense item saved locally.');
      setForm({ category: 'product_service', label: '', amount: '', documentId: '' });
    } catch (err) {
      toast.error(err.message || 'Could not save expense item.');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (item) => {
    setEditTarget(item);
    setEditForm({
      category: item.category || 'product_service',
      label: item.label || '',
      amount: String(item.amount ?? ''),
      documentId: item.documentId || '',
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const numericAmount = Number(editForm.amount);
    if (!editForm.label.trim() || Number.isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Enter a valid expense label and positive INR amount.');
      return;
    }

    const linkedDoc = documents.find((d) => d.id === editForm.documentId);
    setSavingEdit(true);
    try {
      await updateLossItem(editTarget.id, {
        category: editForm.category,
        label: editForm.label.trim(),
        amount: numericAmount,
        documentId: editForm.documentId || '',
        documentName: linkedDoc ? linkedDoc.fileName : '',
      });
      toast.success('Expense item updated.');
      setEditTarget(null);
    } catch (err) {
      toast.error(err.message || 'Could not update expense item.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteLossItem(deleteTarget.id);
      toast.success('Expense item deleted.');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Could not delete expense item.');
    } finally {
      setDeleting(false);
    }
  };

  const remedyLabel =
    REQUESTED_REMEDIES.find((r) => r.value === caseData?.requestedRemedy)?.label ||
    caseData?.requestedRemedy ||
    'Not specified';

  return (
    <CaseWorkspaceLayout title="Financial Loss Calculator" caseData={caseData}>
      {loading && <Spinner centered label="Loading financial calculator..." />}

      {!loading && error && (
        <ErrorState
          title="Unable to load financial loss data"
          description={error}
          onRetry={refreshCase}
        />
      )}

      {!loading && !error && caseData && (
        <div className="gs-stack-lg">
          {/* Documented Loss vs Potential Remedies */}
          <div className="gs-grid-2">
            <Card title="1. Documented Financial Loss">
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                {formatCurrencyINR(totalDocumentedLoss)}
              </div>
              <p className="gs-text-xs gs-muted" style={{ marginTop: 6 }}>
                Calculated dynamically from {items.length} documented expense item(s) saved in this
                case.
              </p>
            </Card>

            <Card title="2. Possible Remedies (Not Guaranteed)">
              <div style={{ fontWeight: 700, color: 'var(--color-secondary-blue)', fontSize: '1.05rem' }}>
                Requested Remedy: {remedyLabel}
              </div>
              <p className="gs-text-xs gs-muted" style={{ marginTop: 6 }}>
                Possible legal remedies (such as refund, replacement, repair, or fee reversal) depend
                on verified facts and authority review. GraahakSaarthi never estimates or promises
                guaranteed compensation.
              </p>
            </Card>
          </div>

          {/* Add Expense Form */}
          <Card
            title="Add Documented Expense"
            subtitle="Record only expenses backed by invoices, receipts, or payment statements."
          >
            <form onSubmit={handleAddItem} className="gs-stack">
              <div className="gs-grid-2">
                <Select
                  label="Expense Category"
                  options={LOSS_CATEGORIES}
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                />
                <Input
                  label="Expense Description"
                  required
                  placeholder="e.g. Paid order invoice amount"
                  value={form.label}
                  onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                />
                <Input
                  label="Amount (INR)"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="e.g. 2499"
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                />
                <Select
                  label="Related Document (Optional)"
                  placeholder="Select local document"
                  options={documents.map((d) => ({ value: d.id, label: d.fileName }))}
                  value={form.documentId}
                  onChange={(e) => setForm((p) => ({ ...p, documentId: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="primary" icon={Plus} loading={saving}>
                  Add Expense
                </Button>
              </div>
            </form>
          </Card>

          {/* Expense Breakdown List */}
          <Card title={`Documented Expense Breakdown (${items.length})`}>
            {items.length === 0 ? (
              <EmptyState
                icon={Calculator}
                title="No documented expenses added yet"
                description="Add product price, delivery fees, repair bills, or unfair charges above to compute your total documented financial loss."
              />
            ) : (
              <div className="gs-stack">
                {items.map((item) => {
                  const catLabel =
                    LOSS_CATEGORIES.find((c) => c.value === item.category)?.label ||
                    item.category;

                  return (
                    <div
                      key={item.id}
                      className="gs-row-between"
                      style={{
                        padding: 14,
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface-muted)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <strong style={{ color: 'var(--color-navy)' }}>{item.label}</strong>
                          <Badge tone="neutral">{catLabel}</Badge>
                        </div>
                        {item.documentName && (
                          <div className="gs-text-xs gs-muted" style={{ marginTop: 4 }}>
                            Linked proof: {item.documentName}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong style={{ color: 'var(--color-navy)', fontSize: '1.05rem', marginRight: 6 }}>
                          {formatCurrencyINR(item.amount)}
                        </strong>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit3}
                          onClick={() => openEditModal(item)}
                          aria-label={`Edit ${item.label}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => setDeleteTarget(item)}
                          aria-label={`Delete ${item.label}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <div className="gs-banner gs-banner-info">
            <Info size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <span className="gs-text-xs">
              Keep original bills and payment confirmations ready for every item recorded in your
              documented financial loss summary.
            </span>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      <Modal
        isOpen={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        title="Edit Documented Expense"
      >
        <form onSubmit={handleSaveEdit} className="gs-stack">
          <Select
            label="Expense Category"
            options={LOSS_CATEGORIES}
            value={editForm.category || 'product_service'}
            onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
          />
          <Input
            label="Expense Description"
            required
            value={editForm.label || ''}
            onChange={(e) => setEditForm((p) => ({ ...p, label: e.target.value }))}
          />
          <Input
            label="Amount (INR)"
            type="number"
            min="0.01"
            step="0.01"
            required
            value={editForm.amount || ''}
            onChange={(e) => setEditForm((p) => ({ ...p, amount: e.target.value }))}
          />
          <Select
            label="Related Document (Optional)"
            placeholder="No linked document"
            options={documents.map((d) => ({ value: d.id, label: d.fileName }))}
            value={editForm.documentId || ''}
            onChange={(e) => setEditForm((p) => ({ ...p, documentId: e.target.value }))}
          />
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
        title="Remove Expense Item"
        message={`Delete "${deleteTarget?.label}" (${formatCurrencyINR(deleteTarget?.amount)})?`}
        confirmLabel="Remove Expense"
        loading={deleting}
      />
    </CaseWorkspaceLayout>
  );
}
