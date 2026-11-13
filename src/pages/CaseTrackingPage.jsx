import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Edit3,
  Hash,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { CaseWorkspaceLayout } from '../components/case/CaseWorkspaceLayout';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  ErrorState,
  Input,
  Modal,
  Select,
  Spinner,
  Textarea,
} from '../components/common';
import { useCaseDetails } from '../hooks/useCaseDetails';
import { useCaseTasks } from '../hooks/useCaseTasks';
import { CASE_STATUSES } from '../utils/constants';
import { formatDate } from '../utils/formatters';

export function CaseTrackingPage() {
  const { id: caseId } = useParams();
  const { caseData, loading, error, refreshCase, updateTracking } = useCaseDetails(caseId);
  const { tasks, addTask, updateTask, deleteTask } = useCaseTasks(caseId);

  const [statusForm, setStatusForm] = useState({
    currentStatus: 'Open',
    nextFollowUpDate: '',
    nextActionNote: '',
  });
  const [savingTracking, setSavingTracking] = useState(false);

  const [newRef, setNewRef] = useState({ label: '', value: '' });
  const [newUpdateText, setNewUpdateText] = useState('');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', dueDate: '', notes: '' });
  const [savingTask, setSavingTask] = useState(false);

  const [deleteTaskTarget, setDeleteTaskTarget] = useState(null);

  useEffect(() => {
    if (!caseData) return;
    setStatusForm({
      currentStatus: caseData.tracking?.currentStatus || caseData.status || 'Open',
      nextFollowUpDate: caseData.tracking?.nextFollowUpDate || '',
      nextActionNote: caseData.tracking?.nextActionNote || caseData.nextRecommendedAction || '',
    });
  }, [caseData]);

  const handleSaveTrackingHeader = async (e) => {
    e.preventDefault();
    setSavingTracking(true);
    try {
      await updateTracking({
        currentStatus: statusForm.currentStatus,
        nextFollowUpDate: statusForm.nextFollowUpDate,
        nextActionNote: statusForm.nextActionNote.trim(),
      });
      toast.success('Tracking status and next action saved.');
    } catch (err) {
      toast.error(err.message || 'Could not save tracking updates.');
    } finally {
      setSavingTracking(false);
    }
  };

  const handleAddReference = async (e) => {
    e.preventDefault();
    if (!newRef.label.trim() || !newRef.value.trim()) {
      toast.error('Enter both reference source and reference number.');
      return;
    }
    const existingRefs = caseData?.tracking?.referenceNumbers || [];
    try {
      await updateTracking({
        referenceNumbers: [
          ...existingRefs,
          { id: `ref_${Date.now()}`, label: newRef.label.trim(), value: newRef.value.trim() },
        ],
      });
      setNewRef({ label: '', value: '' });
      toast.success('Reference number added.');
    } catch (err) {
      toast.error(err.message || 'Could not add reference number.');
    }
  };

  const handleRemoveReference = async (refId) => {
    const existingRefs = caseData?.tracking?.referenceNumbers || [];
    try {
      await updateTracking({
        referenceNumbers: existingRefs.filter((r) => r.id !== refId),
      });
      toast.success('Reference number removed.');
    } catch (err) {
      toast.error(err.message || 'Could not remove reference number.');
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    const existing = caseData?.tracking?.milestones || [];
    try {
      await updateTracking({
        milestones: [
          ...existing,
          {
            id: `ms_${Date.now()}`,
            title: newMilestoneTitle.trim(),
            date: new Date().toISOString().slice(0, 10),
            completed: false,
          },
        ],
      });
      setNewMilestoneTitle('');
      toast.success('Milestone added.');
    } catch (err) {
      toast.error(err.message || 'Could not add milestone.');
    }
  };

  const handleToggleMilestone = async (msId) => {
    const existing = caseData?.tracking?.milestones || [];
    try {
      await updateTracking({
        milestones: existing.map((m) => (m.id === msId ? { ...m, completed: !m.completed } : m)),
      });
    } catch (err) {
      toast.error(err.message || 'Could not update milestone.');
    }
  };

  const handleAddManualUpdate = async (e) => {
    e.preventDefault();
    if (!newUpdateText.trim()) return;
    const existing = caseData?.tracking?.updates || [];
    try {
      await updateTracking({
        updates: [
          {
            id: `upd_${Date.now()}`,
            summary: newUpdateText.trim(),
            date: new Date().toISOString().slice(0, 10),
          },
          ...existing,
        ],
      });
      setNewUpdateText('');
      toast.success('Manual update recorded.');
    } catch (err) {
      toast.error(err.message || 'Could not save update.');
    }
  };

  const openAddTaskModal = () => {
    setEditingTask(null);
    setTaskForm({ title: '', dueDate: '', notes: '' });
    setTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title || '',
      dueDate: task.dueDate || '',
      notes: task.notes || '',
    });
    setTaskModalOpen(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      toast.error('Please enter a task title.');
      return;
    }

    setSavingTask(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          title: taskForm.title.trim(),
          dueDate: taskForm.dueDate,
          notes: taskForm.notes.trim(),
        });
        toast.success('Follow-up task updated.');
      } else {
        await addTask(caseId, {
          title: taskForm.title.trim(),
          dueDate: taskForm.dueDate,
          notes: taskForm.notes.trim(),
        });
        toast.success('Follow-up task added.');
      }
      setTaskModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Could not save task.');
    } finally {
      setSavingTask(false);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
    } catch (err) {
      toast.error(err.message || 'Could not update task.');
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTaskTarget) return;
    try {
      await deleteTask(deleteTaskTarget.id);
      toast.success('Task deleted.');
      setDeleteTaskTarget(null);
    } catch (err) {
      toast.error(err.message || 'Could not delete task.');
    }
  };

  const references = caseData?.tracking?.referenceNumbers || [];
  const milestones = caseData?.tracking?.milestones || [];
  const updates = caseData?.tracking?.updates || [];

  return (
    <CaseWorkspaceLayout
      title="Case Tracking"
      caseData={caseData}
      actions={
        <Button variant="primary" size="sm" icon={Plus} onClick={openAddTaskModal}>
          Add Follow-up Task
        </Button>
      }
    >
      {loading && <Spinner centered label="Loading tracking workspace..." />}

      {!loading && error && (
        <ErrorState title="Unable to load tracking" description={error} onRetry={refreshCase} />
      )}

      {!loading && !error && caseData && (
        <div className="gs-stack-lg">
          {/* Status & Next Action Notes */}
          <Card
            title="Case Status &amp; Next Action Notes"
            subtitle="Track your manual status and custom follow-up date (no invented deadlines)."
          >
            <form onSubmit={handleSaveTrackingHeader} className="gs-stack">
              <div className="gs-grid-2">
                <Select
                  label="Current Case Status"
                  options={CASE_STATUSES.map((s) => ({ value: s, label: s }))}
                  value={statusForm.currentStatus}
                  onChange={(e) => setStatusForm((p) => ({ ...p, currentStatus: e.target.value }))}
                />
                <Input
                  label="Manual Follow-up Date (Optional)"
                  type="date"
                  value={statusForm.nextFollowUpDate}
                  onChange={(e) =>
                    setStatusForm((p) => ({ ...p, nextFollowUpDate: e.target.value }))
                  }
                />
              </div>

              <Input
                label="Next Action Note"
                placeholder="e.g. Call seller grievance desk with docket number"
                value={statusForm.nextActionNote}
                onChange={(e) => setStatusForm((p) => ({ ...p, nextActionNote: e.target.value }))}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="primary" icon={Save} loading={savingTracking}>
                  Save Tracking Status
                </Button>
              </div>
            </form>
          </Card>

          {/* Reference Numbers */}
          <Card title="Reference Numbers" subtitle="Record seller ticket IDs, courier tracking, or portal docket numbers.">
            <div className="gs-stack">
              <form onSubmit={handleAddReference} className="gs-grid-3" style={{ alignItems: 'end' }}>
                <Input
                  label="Source / Portal"
                  placeholder="e.g. Seller Ticket / NCH Docket"
                  value={newRef.label}
                  onChange={(e) => setNewRef((p) => ({ ...p, label: e.target.value }))}
                />
                <Input
                  label="Reference Number"
                  placeholder="e.g. TKT-984120"
                  value={newRef.value}
                  onChange={(e) => setNewRef((p) => ({ ...p, value: e.target.value }))}
                />
                <Button type="submit" variant="secondary" icon={Plus}>
                  Add Reference
                </Button>
              </form>

              {references.length === 0 ? (
                <p className="gs-text-sm gs-muted">No reference numbers recorded yet.</p>
              ) : (
                <div className="gs-grid-3">
                  {references.map((ref) => (
                    <div
                      key={ref.id}
                      className="gs-row-between"
                      style={{
                        padding: 12,
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface-muted)',
                      }}
                    >
                      <div>
                        <div className="gs-text-xs gs-muted">{ref.label}</div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: 'var(--color-navy)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            marginTop: 2,
                          }}
                        >
                          <Hash size={14} />
                          {ref.value}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleRemoveReference(ref.id)}
                        aria-label={`Remove ${ref.value}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <div className="gs-grid-2">
            {/* Follow-up Tasks */}
            <Card
              title={`Follow-up Tasks (${tasks.length})`}
              action={
                <Button variant="secondary" size="sm" icon={Plus} onClick={openAddTaskModal}>
                  Add Task
                </Button>
              }
            >
              {tasks.length === 0 ? (
                <p className="gs-text-sm gs-muted">No follow-up tasks created yet.</p>
              ) : (
                <div className="gs-stack">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        padding: 12,
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface-muted)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 10,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: 0,
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          cursor: 'pointer',
                          flex: 1,
                        }}
                      >
                        {task.completed ? (
                          <CheckCircle2
                            size={18}
                            color="var(--color-accent-green)"
                            style={{ marginTop: 2, flexShrink: 0 }}
                          />
                        ) : (
                          <Circle
                            size={18}
                            color="var(--color-secondary-blue)"
                            style={{ marginTop: 2, flexShrink: 0 }}
                          />
                        )}
                        <div>
                          <div
                            className="gs-text-sm"
                            style={{
                              fontWeight: 600,
                              textDecoration: task.completed ? 'line-through' : 'none',
                              color: task.completed
                                ? 'var(--color-text-muted)'
                                : 'var(--color-navy)',
                            }}
                          >
                            {task.title}
                          </div>
                          {task.dueDate && (
                            <div
                              className="gs-text-xs gs-muted"
                              style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}
                            >
                              <Calendar size={12} />
                              Due: {formatDate(task.dueDate)}
                            </div>
                          )}
                          {task.notes && <div className="gs-text-xs gs-muted">{task.notes}</div>}
                        </div>
                      </button>

                      <div style={{ display: 'flex', gap: 4 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit3}
                          onClick={() => openEditTaskModal(task)}
                          aria-label={`Edit ${task.title}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => setDeleteTaskTarget(task)}
                          aria-label={`Delete ${task.title}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Milestones & Manually Entered Updates */}
            <Card title="Milestones &amp; Manual Updates">
              <div className="gs-stack">
                <form onSubmit={handleAddMilestone} style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    className="gs-input"
                    placeholder="Add milestone (e.g. Sent formal email notice)..."
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  />
                  <Button type="submit" variant="secondary" size="sm" icon={Plus}>
                    Add
                  </Button>
                </form>

                {milestones.length > 0 && (
                  <div className="gs-stack" style={{ gap: 8 }}>
                    {milestones.map((ms) => (
                      <button
                        key={ms.id}
                        type="button"
                        onClick={() => handleToggleMilestone(ms.id)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          backgroundColor: 'var(--color-surface)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <span className="gs-text-sm" style={{ fontWeight: 600 }}>
                          {ms.title}
                        </span>
                        <Badge tone={ms.completed ? 'success' : 'neutral'}>
                          {ms.completed ? 'Completed' : 'Pending'}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}

                <form
                  onSubmit={handleAddManualUpdate}
                  style={{ display: 'flex', gap: 8, paddingTop: 8, borderTop: '1px solid var(--color-border)' }}
                >
                  <input
                    type="text"
                    className="gs-input"
                    placeholder="Log manual update (e.g. Received support reply)..."
                    value={newUpdateText}
                    onChange={(e) => setNewUpdateText(e.target.value)}
                  />
                  <Button type="submit" variant="secondary" size="sm" icon={Plus}>
                    Log
                  </Button>
                </form>

                {updates.length === 0 && milestones.length === 0 ? (
                  <p className="gs-text-sm gs-muted">No milestones or manual updates logged yet.</p>
                ) : (
                  <div className="gs-stack" style={{ gap: 8 }}>
                    {updates.map((u) => (
                      <div key={u.id} className="gs-text-sm">
                        <strong>{u.summary}</strong>{' '}
                        <span className="gs-text-xs gs-muted">· {formatDate(u.date)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Task Add/Edit Modal */}
      <Modal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title={editingTask ? 'Edit Follow-up Task' : 'Add Follow-up Task'}
      >
        <form onSubmit={handleSaveTask} className="gs-stack">
          <Input
            label="Task Title"
            required
            placeholder="e.g. Check refund status with payment provider"
            value={taskForm.title}
            onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))}
          />
          <Input
            label="Due Date (Optional)"
            type="date"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm((p) => ({ ...p, dueDate: e.target.value }))}
          />
          <Textarea
            label="Notes (Optional)"
            rows={3}
            value={taskForm.notes}
            onChange={(e) => setTaskForm((p) => ({ ...p, notes: e.target.value }))}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="secondary" onClick={() => setTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={savingTask}>
              {editingTask ? 'Save Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTaskTarget)}
        onClose={() => setDeleteTaskTarget(null)}
        onConfirm={handleDeleteTask}
        title="Delete Follow-up Task"
        message={`Delete task "${deleteTaskTarget?.title}"?`}
        confirmLabel="Delete Task"
      />
    </CaseWorkspaceLayout>
  );
}
