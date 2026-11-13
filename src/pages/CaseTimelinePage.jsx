import { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Calendar, Clock, Edit3, FileText, Plus, Trash2 } from 'lucide-react';
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
  Textarea,
} from '../components/common';
import { useCaseDetails } from '../hooks/useCaseDetails';
import { useDocuments } from '../hooks/useDocuments';
import { formatDate } from '../utils/formatters';

const TIMELINE_EVENT_TYPES = [
  { value: 'purchase', label: 'Purchase' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'defect_discovered', label: 'Defect Discovered' },
  { value: 'seller_contacted', label: 'Seller Contacted' },
  { value: 'refund_requested', label: 'Refund Requested' },
  { value: 'seller_response', label: 'Seller Response' },
  { value: 'complaint_created', label: 'Complaint Created' },
  { value: 'other', label: 'Other Milestone' },
];

const EMPTY_FORM = {
  eventType: 'purchase',
  eventDate: '',
  title: '',
  description: '',
  documentId: '',
};

export function CaseTimelinePage() {
  const { id: caseId } = useParams();
  const {
    caseData,
    loading,
    error,
    refreshCase,
    addTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
  } = useCaseDetails(caseId);
  const { documents } = useDocuments(caseId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const events = caseData?.timelineEvents || [];

  const openAddModal = () => {
    setEditingEventId(null);
    setEventForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (evt) => {
    setEditingEventId(evt.id);
    setEventForm({
      eventType: evt.eventType || 'other',
      eventDate: evt.eventDate || '',
      title: evt.title || '',
      description: evt.description || '',
      documentId: evt.documentId || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventForm.eventDate || !eventForm.title.trim()) {
      toast.error('Please enter both an event date and title.');
      return;
    }

    const linkedDoc = documents.find((d) => d.id === eventForm.documentId);
    const payload = {
      eventType: eventForm.eventType,
      eventDate: eventForm.eventDate,
      title: eventForm.title.trim(),
      description: eventForm.description.trim(),
      documentId: eventForm.documentId || '',
      documentName: linkedDoc ? linkedDoc.fileName : '',
    };

    setSaving(true);
    try {
      if (editingEventId) {
        await updateTimelineEvent(editingEventId, payload);
        toast.success('Timeline event updated.');
      } else {
        await addTimelineEvent(payload);
        toast.success('Timeline event added.');
      }
      setModalOpen(false);
      setEventForm(EMPTY_FORM);
      setEditingEventId(null);
    } catch (err) {
      toast.error(err.message || 'Could not save timeline event.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTimelineEvent(deleteTarget.id);
      toast.success('Timeline event removed.');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Could not delete timeline event.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <CaseWorkspaceLayout
      title="Case Timeline"
      caseData={caseData}
      actions={
        <Button variant="primary" size="sm" icon={Plus} onClick={openAddModal}>
          Add Timeline Event
        </Button>
      }
    >
      <div className="gs-stack-lg">
        {loading && <Spinner centered label="Loading timeline..." />}

        {!loading && error && (
          <ErrorState title="Unable to load timeline" description={error} onRetry={refreshCase} />
        )}

        {!loading && !error && events.length === 0 && (
          <EmptyState
            icon={Clock}
            title="No timeline events added yet"
            description="Record verified dates such as purchase, delivery, defect discovery, and seller contact manually, and link each event to a locally stored document."
            action={
              <Button variant="primary" icon={Plus} onClick={openAddModal}>
                Add First Event
              </Button>
            }
          />
        )}

        {!loading && !error && events.length > 0 && (
          <Card
            title={`Chronological Events (${events.length})`}
            subtitle="Sorted automatically by event date. Only user-entered events appear here."
          >
            <div className="gs-timeline">
              {events.map((evt) => {
                const typeLabel =
                  TIMELINE_EVENT_TYPES.find((t) => t.value === evt.eventType)?.label ||
                  evt.eventType ||
                  'Event';

                return (
                  <div key={evt.id} className="gs-timeline-item">
                    <span className="gs-timeline-dot" aria-hidden="true" />
                    <div
                      style={{
                        padding: 14,
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface-muted)',
                      }}
                    >
                      <div className="gs-row-between" style={{ marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <Badge tone="info">{typeLabel}</Badge>
                          <strong style={{ color: 'var(--color-navy)' }}>{evt.title}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            className="gs-text-xs gs-muted"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                          >
                            <Calendar size={13} />
                            {formatDate(evt.eventDate)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Edit3}
                            onClick={() => openEditModal(evt)}
                            aria-label={`Edit ${evt.title}`}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={() => setDeleteTarget(evt)}
                            aria-label={`Delete ${evt.title}`}
                          />
                        </div>
                      </div>

                      {evt.description && (
                        <p className="gs-text-sm" style={{ marginBottom: 8 }}>
                          {evt.description}
                        </p>
                      )}

                      {evt.documentName && (
                        <div
                          className="gs-text-xs"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-pill)',
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-secondary-blue)',
                            fontWeight: 600,
                          }}
                        >
                          <FileText size={13} />
                          Related Document: {evt.documentName}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEventId ? 'Edit Timeline Event' : 'Add Timeline Event'}
      >
        <form onSubmit={handleSubmit} className="gs-stack">
          <Select
            label="Event Category"
            options={TIMELINE_EVENT_TYPES}
            value={eventForm.eventType}
            onChange={(e) => setEventForm((p) => ({ ...p, eventType: e.target.value }))}
          />
          <Input
            label="Event Date"
            type="date"
            required
            value={eventForm.eventDate}
            onChange={(e) => setEventForm((p) => ({ ...p, eventDate: e.target.value }))}
          />
          <Input
            label="Event Title"
            required
            placeholder="e.g. Defective item reported to seller support"
            value={eventForm.title}
            onChange={(e) => setEventForm((p) => ({ ...p, title: e.target.value }))}
          />
          <Textarea
            label="Description (Optional)"
            rows={3}
            placeholder="Add factual notes about what occurred on this date..."
            value={eventForm.description}
            onChange={(e) => setEventForm((p) => ({ ...p, description: e.target.value }))}
          />
          <Select
            label="Related Document (Optional)"
            placeholder="No linked document"
            options={documents.map((d) => ({
              value: d.id,
              label: d.fileName,
            }))}
            value={eventForm.documentId}
            onChange={(e) => setEventForm((p) => ({ ...p, documentId: e.target.value }))}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {editingEventId ? 'Save Changes' : 'Add Event'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Timeline Event"
        message={`Remove "${deleteTarget?.title}" from this case's timeline?`}
        confirmLabel="Delete Event"
        loading={deleting}
      />
    </CaseWorkspaceLayout>
  );
}
