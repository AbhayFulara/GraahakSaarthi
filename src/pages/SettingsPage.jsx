import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HardDrive, Save, ShieldCheck, Trash2 } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button, Card, ConfirmDialog, Select, Spinner } from '../components/common';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../hooks/useSettings';
import { INDIAN_STATES } from '../utils/constants';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { settings, storageSummary, loading, updateSettings, clearAllData } = useSettings();

  const [form, setForm] = useState({
    defaultState: '',
    confirmBeforeDelete: true,
  });
  const [saving, setSaving] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (!loading) {
      setForm({
        defaultState: settings.defaultState || '',
        confirmBeforeDelete: settings.confirmBeforeDelete ?? true,
      });
    }
  }, [loading, settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        defaultState: form.defaultState,
        confirmBeforeDelete: form.confirmBeforeDelete,
      });
      toast.success('Preferences saved locally in your browser.');
    } catch (err) {
      toast.error(err.message || 'Could not save preferences.');
    } finally {
      setSaving(false);
    }
  };

  const handleClearLocalData = async () => {
    setClearing(true);
    try {
      await clearAllData();
      toast.success('All locally stored cases, documents, tasks, and preferences cleared.');
      setClearConfirmOpen(false);
    } catch (err) {
      toast.error(err.message || 'Could not clear local data.');
    } finally {
      setClearing(false);
    }
  };

  return (
    <AppLayout title="Settings">
      <div className="gs-stack-lg">
        <div>
          <h1 className="gs-page-title">Preferences &amp; Local Data Settings</h1>
          <p className="gs-page-subtitle">
            Customize appearance and manage data stored locally in this browser.
          </p>
        </div>

        <div className="gs-banner gs-banner-info">
          <HardDrive size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Browser-Only Persistence:</strong> This MVP operates without user accounts or
            remote servers. All cases, timelines, loss calculations, drafts, tasks, and attached
            documents are stored directly in your browser&apos;s <code>localStorage</code> and{' '}
            <code>IndexedDB</code>.
          </div>
        </div>

        {loading ? (
          <Spinner centered label="Loading preferences..." />
        ) : (
          <form onSubmit={handleSave} className="gs-stack-lg">
            <Card title="Interface Preferences">
              <div className="gs-stack">
                <div className="gs-grid-2">
                  <Select
                    label="Appearance Theme"
                    options={[
                      { value: 'light', label: 'Light Mode' },
                      { value: 'dark', label: 'Dark Mode' },
                    ]}
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                  />
                  <Select
                    label="Default State / Union Territory (Optional)"
                    placeholder="Select state or UT"
                    options={INDIAN_STATES.map((st) => ({ value: st, label: st }))}
                    value={form.defaultState}
                    onChange={(e) => setForm((p) => ({ ...p, defaultState: e.target.value }))}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={form.confirmBeforeDelete}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, confirmBeforeDelete: e.target.checked }))
                    }
                  />
                  <span>Always ask for confirmation before deleting cases or documents</span>
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="primary" icon={Save} loading={saving}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </Card>
          </form>
        )}

        <Card
          title="Local Application Data Management"
          subtitle="Summary of records currently saved in this browser"
        >
          <div className="gs-stack">
            <div className="gs-grid-3">
              <div
                style={{
                  padding: 14,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-muted)',
                }}
              >
                <div className="gs-text-xs gs-muted">Saved Cases</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                  {storageSummary.caseCount}
                </div>
              </div>
              <div
                style={{
                  padding: 14,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-muted)',
                }}
              >
                <div className="gs-text-xs gs-muted">Saved Documents</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                  {storageSummary.documentCount}
                </div>
              </div>
              <div
                style={{
                  padding: 14,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-muted)',
                }}
              >
                <div className="gs-text-xs gs-muted">Saved Tasks</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                  {storageSummary.taskCount}
                </div>
              </div>
            </div>

            <div className="gs-row-between" style={{ paddingTop: 6 }}>
              <div className="gs-text-xs gs-muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={15} color="var(--color-accent-green)" />
                <span>Clearing data removes all browser-stored cases, drafts, and files.</span>
              </div>
              <Button
                variant="danger"
                icon={Trash2}
                onClick={() => setClearConfirmOpen(true)}
              >
                Clear Local Application Data
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        onConfirm={handleClearLocalData}
        title="Clear All Local Application Data"
        message="This will permanently erase all locally stored consumer cases, documents, timeline events, financial calculations, complaint drafts, and tasks from this browser. This action cannot be undone."
        confirmLabel="Clear Everything"
        loading={clearing}
      />
    </AppLayout>
  );
}
