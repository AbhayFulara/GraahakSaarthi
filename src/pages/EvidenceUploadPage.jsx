import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AlertCircle,
  Eye,
  FileText,
  Info,
  Trash2,
  UploadCloud,
} from 'lucide-react';
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
import { EVIDENCE_DOCUMENT_TYPES } from '../utils/constants';
import { formatDateTime, formatFileSize } from '../utils/formatters';
import { validateUploadFile } from '../utils/validators';

export function EvidenceUploadPage() {
  const { id: caseId } = useParams();
  const { caseData } = useCaseDetails(caseId);
  const {
    documents,
    loading,
    error,
    refreshDocuments,
    addDocument,
    deleteDocument,
    getPreviewUrl,
  } = useDocuments(caseId);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedType, setSelectedType] = useState('invoice');
  const [docNotes, setDocNotes] = useState('');
  const [savingFile, setSavingFile] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [previewState, setPreviewState] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewState?.url) {
        URL.revokeObjectURL(previewState.url);
      }
    };
  }, [previewState]);

  const handleSaveFile = async (file) => {
    const validationErr = validateUploadFile(file);
    if (validationErr) {
      setSaveError(`${file.name}: ${validationErr}`);
      return;
    }

    setSaveError(null);
    setSavingFile(true);
    try {
      await addDocument(caseId, file, {
        documentType: selectedType,
        notes: docNotes.trim(),
      });
      toast.success(`Saved "${file.name}" locally in browser storage.`);
      setDocNotes('');
    } catch (err) {
      setSaveError(err.message || `Could not save "${file.name}".`);
    } finally {
      setSavingFile(false);
    }
  };

  const handleFileInput = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      await handleSaveFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    for (const file of files) {
      await handleSaveFile(file);
    }
  };

  const handleOpenPreview = async (doc) => {
    if (previewState?.url) {
      URL.revokeObjectURL(previewState.url);
    }
    const url = await getPreviewUrl(doc.id);
    setPreviewState({ doc, url });
  };

  const handleClosePreview = () => {
    if (previewState?.url) {
      URL.revokeObjectURL(previewState.url);
    }
    setPreviewState(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDocument(deleteTarget.id);
      toast.success('Document removed from local case storage.');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Could not remove document.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <CaseWorkspaceLayout
      title="Evidence Centre"
      caseData={caseData}
      actions={
        <Link to={`/case/${caseId}/evidence-analysis`}>
          <Button variant="secondary" size="sm">
            Evidence Analysis
          </Button>
        </Link>
      }
    >
      <div className="gs-stack-lg">
        <div className="gs-banner gs-banner-info">
          <Info size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Local Browser Storage:</strong> Documents added here are stored locally in your
            browser so you can organize and preview them immediately. Automated OCR / AI document
            extraction is not connected in this frontend-only MVP.
          </div>
        </div>

        {/* Add Document Card */}
        <Card
          title="Add Supporting Documents"
          subtitle="Select PDFs, JPG/JPEG/PNG images, receipts, invoices, warranty cards, or chat screenshots."
        >
          <div className="gs-stack">
            <div className="gs-grid-2">
              <Select
                label="Document Category"
                options={EVIDENCE_DOCUMENT_TYPES}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              />
              <Input
                label="User Note (Optional)"
                placeholder="e.g. Order tax invoice showing GST & amount"
                value={docNotes}
                onChange={(e) => setDocNotes(e.target.value)}
              />
            </div>

            {saveError && (
              <div className="gs-banner gs-banner-danger" role="alert">
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{saveError}</span>
              </div>
            )}

            <label
              className={`gs-dropzone ${isDragging ? 'is-dragging' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept=".pdf,image/jpeg,image/png,image/webp"
                onChange={handleFileInput}
                disabled={savingFile}
                style={{ display: 'none' }}
              />
              <UploadCloud
                size={32}
                color="var(--color-secondary-blue)"
                style={{ marginInline: 'auto', marginBottom: 10 }}
              />
              <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                {savingFile
                  ? 'Saving file locally...'
                  : 'Drag & drop supporting files here, or click to select'}
              </div>
              <p className="gs-text-xs gs-muted" style={{ marginTop: 4 }}>
                Accepted formats: PDF, JPG, JPEG, PNG, WEBP · Max 10 MB per file
              </p>
            </label>
          </div>
        </Card>

        {/* Stored Documents List */}
        <Card
          title={`Locally Stored Documents (${documents.length})`}
          subtitle="Clearly distinguishes locally added documents from future AI-analyzed documents."
        >
          {loading && <Spinner centered label="Loading locally saved documents..." />}

          {!loading && error && (
            <ErrorState
              title="Unable to load documents"
              description={error}
              onRetry={refreshDocuments}
            />
          )}

          {!loading && !error && documents.length === 0 && (
            <EmptyState
              icon={FileText}
              title="No supporting documents added yet"
              description="Attach your invoice, payment receipt, defect photos, or seller chats above."
            />
          )}

          {!loading && !error && documents.length > 0 && (
            <div className="gs-stack">
              {documents.map((doc) => {
                const docTypeLabel =
                  EVIDENCE_DOCUMENT_TYPES.find((t) => t.value === doc.documentType)?.label ||
                  doc.documentType ||
                  'Supporting Document';

                return (
                  <div
                    key={doc.id}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: 16,
                      backgroundColor: 'var(--color-surface-muted)',
                    }}
                  >
                    <div className="gs-row-between" style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <FileText size={18} color="var(--color-secondary-blue)" />
                        <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                          {doc.fileName}
                        </span>
                        <Badge tone="neutral">{docTypeLabel}</Badge>
                        <Badge tone="success">Saved Locally</Badge>
                        <Badge tone="warning">AI Extraction Unavailable</Badge>
                      </div>

                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Eye}
                          onClick={() => handleOpenPreview(doc)}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => setDeleteTarget(doc)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div
                      className="gs-text-xs gs-muted"
                      style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
                    >
                      <span>Type: {doc.mimeType}</span>
                      <span>Size: {formatFileSize(doc.fileSize)}</span>
                      <span>Added: {formatDateTime(doc.createdAt)}</span>
                    </div>

                    {doc.notes && (
                      <p className="gs-text-sm" style={{ marginTop: 8 }}>
                        <strong>Note:</strong> {doc.notes}
                      </p>
                    )}

                    <div
                      style={{
                        marginTop: 10,
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <span className="gs-text-xs gs-muted">
                        Document extraction unavailable — awaiting future OCR/AI service
                        integration.
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={Boolean(previewState)}
        onClose={handleClosePreview}
        title={previewState?.doc?.fileName || 'Document Preview'}
        size="lg"
      >
        {previewState && (
          <div className="gs-stack">
            {previewState.url ? (
              (previewState.doc.mimeType || '').startsWith('image/') ? (
                <img
                  src={previewState.url}
                  alt={previewState.doc.fileName}
                  style={{
                    maxHeight: '65vh',
                    marginInline: 'auto',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'contain',
                  }}
                />
              ) : previewState.doc.mimeType === 'application/pdf' ? (
                <iframe
                  title={previewState.doc.fileName}
                  src={previewState.url}
                  style={{ width: '100%', height: '65vh', border: '1px solid var(--color-border)' }}
                />
              ) : (
                <p className="gs-text-sm gs-muted">
                  Inline preview is not supported for {previewState.doc.mimeType}.
                </p>
              )
            ) : (
              <p className="gs-text-sm gs-muted">
                Binary preview data is unavailable in browser storage for this file.
              </p>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Document"
        message={`Remove "${deleteTarget?.fileName}" from local storage?`}
        confirmLabel="Remove Document"
        loading={deleting}
      />
    </CaseWorkspaceLayout>
  );
}
