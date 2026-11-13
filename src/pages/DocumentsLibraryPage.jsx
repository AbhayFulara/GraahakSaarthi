import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, FileText, Files, Search, Trash2 } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Modal,
  Spinner,
} from '../components/common';
import { useCases } from '../hooks/useCases';
import { useDocuments } from '../hooks/useDocuments';
import { EVIDENCE_DOCUMENT_TYPES } from '../utils/constants';
import { formatDateTime, formatFileSize } from '../utils/formatters';

export function DocumentsLibraryPage() {
  const { cases } = useCases();
  const {
    documents,
    loading,
    error,
    refreshDocuments,
    deleteDocument,
    getPreviewUrl,
  } = useDocuments();

  const [search, setSearch] = useState('');
  const [caseFilter, setCaseFilter] = useState('all');
  const [previewState, setPreviewState] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const caseMap = useMemo(() => new Map(cases.map((c) => [c.id, c])), [cases]);

  useEffect(() => {
    return () => {
      if (previewState?.url) URL.revokeObjectURL(previewState.url);
    };
  }, [previewState]);

  const filteredDocs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return documents.filter((d) => {
      const matchesCase = caseFilter === 'all' || d.caseId === caseFilter;
      const matchesSearch =
        !q ||
        (d.fileName || '').toLowerCase().includes(q) ||
        (d.notes || '').toLowerCase().includes(q);
      return matchesCase && matchesSearch;
    });
  }, [documents, search, caseFilter]);

  const handleOpenPreview = async (doc) => {
    if (previewState?.url) URL.revokeObjectURL(previewState.url);
    const url = await getPreviewUrl(doc.id);
    setPreviewState({ doc, url });
  };

  const handleClosePreview = () => {
    if (previewState?.url) URL.revokeObjectURL(previewState.url);
    setPreviewState(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDocument(deleteTarget.id);
      toast.success('Document removed.');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Could not remove document.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppLayout title="Documents">
      <div className="gs-stack-lg">
        <div>
          <h1 className="gs-page-title">Documents Library</h1>
          <p className="gs-page-subtitle">
            View and preview all supporting documents saved locally across your consumer cases.
          </p>
        </div>

        <Card>
          <div className="gs-grid-2">
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
                placeholder="Search documents by file name or note..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search documents"
              />
            </div>

            <select
              className="gs-select"
              value={caseFilter}
              onChange={(e) => setCaseFilter(e.target.value)}
              aria-label="Filter by case"
            >
              <option value="all">All Cases</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.referenceNumber} — {c.title}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {loading && <Spinner centered label="Loading documents..." />}

        {!loading && error && (
          <ErrorState
            title="Unable to load documents"
            description={error}
            onRetry={refreshDocuments}
          />
        )}

        {!loading && !error && documents.length === 0 && (
          <EmptyState
            icon={Files}
            title="No documents stored yet"
            description="Add supporting invoices, receipts, or screenshots inside any case's Evidence Centre or during complaint creation."
            action={
              <Link to="/cases">
                <Button variant="primary">Go to My Cases</Button>
              </Link>
            }
          />
        )}

        {!loading && !error && documents.length > 0 && filteredDocs.length === 0 && (
          <Card>
            <p className="gs-text-sm gs-muted">No documents match your current search or filter.</p>
          </Card>
        )}

        {!loading && !error && filteredDocs.length > 0 && (
          <div className="gs-stack">
            {filteredDocs.map((doc) => {
              const parentCase = caseMap.get(doc.caseId);
              const typeLabel =
                EVIDENCE_DOCUMENT_TYPES.find((t) => t.value === doc.documentType)?.label ||
                doc.documentType;

              return (
                <Card key={doc.id}>
                  <div className="gs-row-between">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <FileText size={17} color="var(--color-secondary-blue)" />
                        <strong style={{ color: 'var(--color-navy)' }}>{doc.fileName}</strong>
                        <Badge tone="neutral">{typeLabel}</Badge>
                        <Badge tone="success">Saved Locally</Badge>
                      </div>
                      <div className="gs-text-xs gs-muted" style={{ marginTop: 6 }}>
                        Case:{' '}
                        {parentCase ? (
                          <Link to={`/case/${parentCase.id}/evidence`} style={{ fontWeight: 600 }}>
                            {parentCase.referenceNumber} — {parentCase.title}
                          </Link>
                        ) : (
                          doc.caseId
                        )}{' '}
                        · {formatFileSize(doc.fileSize)} · {formatDateTime(doc.createdAt)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
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
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={Boolean(previewState)}
        onClose={handleClosePreview}
        title={previewState?.doc?.fileName || 'Document Preview'}
        size="lg"
      >
        {previewState && (
          <div>
            {previewState.url ? (
              (previewState.doc.mimeType || '').startsWith('image/') ? (
                <img
                  src={previewState.url}
                  alt={previewState.doc.fileName}
                  style={{ maxHeight: '65vh', marginInline: 'auto', objectFit: 'contain' }}
                />
              ) : previewState.doc.mimeType === 'application/pdf' ? (
                <iframe
                  title={previewState.doc.fileName}
                  src={previewState.url}
                  style={{ width: '100%', height: '65vh', border: '1px solid var(--color-border)' }}
                />
              ) : (
                <p className="gs-text-sm gs-muted">Preview unavailable for this file type.</p>
              )
            ) : (
              <p className="gs-text-sm gs-muted">File binary unavailable in browser storage.</p>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Document"
        message={`Delete "${deleteTarget?.fileName}" from local storage?`}
        confirmLabel="Remove Document"
        loading={deleting}
      />
    </AppLayout>
  );
}
