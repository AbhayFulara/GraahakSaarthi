import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CloudOff, FileSearch, Save, Upload } from 'lucide-react';
import { CaseWorkspaceLayout } from '../components/case/CaseWorkspaceLayout';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Spinner,
  Textarea,
} from '../components/common';
import { useCaseDetails } from '../hooks/useCaseDetails';
import { useDocuments } from '../hooks/useDocuments';
import { EVIDENCE_CLASSIFICATIONS, EVIDENCE_DOCUMENT_TYPES } from '../utils/constants';

export function EvidenceAnalysisPage() {
  const { id: caseId } = useParams();
  const { caseData } = useCaseDetails(caseId);
  const { documents, loading, error, refreshDocuments, updateDocument } = useDocuments(caseId);

  const [noteDrafts, setNoteDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);

  const getNoteValue = (doc) => {
    if (Object.prototype.hasOwnProperty.call(noteDrafts, doc.id)) {
      return noteDrafts[doc.id];
    }
    return doc.notes || '';
  };

  const handleSaveNote = async (doc) => {
    setSavingId(doc.id);
    try {
      await updateDocument(doc.id, { notes: getNoteValue(doc).trim() });
      toast.success(`Saved notes for "${doc.fileName}".`);
    } catch (err) {
      toast.error(err.message || 'Could not save document note.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <CaseWorkspaceLayout
      title="Evidence Analysis"
      caseData={caseData}
      actions={
        <Link to={`/case/${caseId}/evidence`}>
          <Button variant="secondary" size="sm" icon={Upload}>
            Manage Evidence
          </Button>
        </Link>
      }
    >
      <div className="gs-stack-lg">
        {/* Honest Integration Status Banner */}
        <div className="gs-banner gs-banner-warning">
          <CloudOff size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>AI Evidence Classification Unavailable:</strong> Automated classification
            (STRONG, SUPPORTING, WEAK, MISSING, CONFLICTING) will become active once the AI
            service is connected. All locally added documents remain marked{' '}
            <strong>UNVERIFIED</strong>. You can organize files and record your own notes below.
          </div>
        </div>

        {/* Prepared Classification Structure */}
        <Card
          title="Prepared Evidence Classification Structure"
          subtitle="Classification buckets ready for future AI analysis integration"
        >
          <div className="gs-grid-3">
            {Object.entries(EVIDENCE_CLASSIFICATIONS).map(([key, cfg]) => (
              <div
                key={key}
                style={{
                  padding: 12,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-muted)',
                }}
              >
                <div style={{ marginBottom: 6 }}>
                  <Badge tone={cfg.tone}>{cfg.label}</Badge>
                </div>
                <p className="gs-text-xs gs-muted">{cfg.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {loading && <Spinner centered label="Loading locally stored evidence..." />}

        {!loading && error && (
          <ErrorState
            title="Unable to load evidence"
            description={error}
            onRetry={refreshDocuments}
          />
        )}

        {!loading && !error && documents.length === 0 && (
          <EmptyState
            icon={FileSearch}
            title="No documents available to organize"
            description="Add supporting invoices, receipts, or screenshots in the Evidence Centre first."
            action={
              <Link to={`/case/${caseId}/evidence`}>
                <Button variant="primary" icon={Upload}>
                  Go to Evidence Centre
                </Button>
              </Link>
            }
          />
        )}

        {!loading && !error && documents.length > 0 && (
          <div className="gs-stack">
            {documents.map((doc) => {
              const typeLabel =
                EVIDENCE_DOCUMENT_TYPES.find((t) => t.value === doc.documentType)?.label ||
                doc.documentType;

              return (
                <Card key={doc.id}>
                  <div className="gs-row-between" style={{ marginBottom: 10 }}>
                    <div>
                      <h3 style={{ fontSize: '1rem' }}>{doc.fileName}</h3>
                      <p className="gs-text-xs gs-muted" style={{ marginTop: 2 }}>
                        Category: {typeLabel} · Verification Status: Waiting for AI Integration
                      </p>
                    </div>
                    <Badge tone="neutral">UNVERIFIED</Badge>
                  </div>

                  <div className="gs-stack">
                    <Textarea
                      label="Manual Organization Notes"
                      rows={2}
                      placeholder="Add your own note explaining what this document proves or which claim it relates to..."
                      value={getNoteValue(doc)}
                      onChange={(e) =>
                        setNoteDrafts((prev) => ({ ...prev, [doc.id]: e.target.value }))
                      }
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Save}
                        loading={savingId === doc.id}
                        onClick={() => handleSaveNote(doc)}
                      >
                        Save Note
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </CaseWorkspaceLayout>
  );
}
