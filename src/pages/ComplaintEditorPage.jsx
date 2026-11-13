import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Copy, Eye, FileEdit, Info, Printer, RefreshCw, Save } from 'lucide-react';
import { CaseWorkspaceLayout } from '../components/case/CaseWorkspaceLayout';
import {
  Badge,
  Button,
  Card,
  ErrorState,
  Input,
  Modal,
  Spinner,
  Textarea,
} from '../components/common';
import { useCaseDetails } from '../hooks/useCaseDetails';
import { useDocuments } from '../hooks/useDocuments';
import { REQUESTED_REMEDIES } from '../utils/constants';
import { formatCurrencyINR, formatDate, formatDateTime } from '../utils/formatters';

export function ComplaintEditorPage() {
  const { id: caseId } = useParams();
  const { caseData, loading, error, refreshCase, saveComplaintDraft } = useCaseDetails(caseId);
  const { documents } = useDocuments(caseId);

  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [reviewConfirmed, setReviewConfirmed] = useState(false);

  const [draft, setDraft] = useState({
    title: '',
    consumerDetails: '',
    sellerDetails: '',
    description: '',
    chronology: '',
    financialImpact: '',
    requestedRemedy: '',
    supportingEvidenceList: '',
  });

  const buildFromLocalRecords = (c, docs) => {
    const remedyLabel =
      REQUESTED_REMEDIES.find((r) => r.value === c.requestedRemedy)?.label ||
      c.requestedRemedy ||
      '';

    const chronologyLines = (c.timelineEvents || [])
      .map((evt) => `${formatDate(evt.eventDate)}: ${evt.title}${evt.description ? ` — ${evt.description}` : ''}`)
      .join('\n');

    const lossTotal = (c.lossItems || []).reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
    const financialText = (c.lossItems || []).length
      ? `${c.lossItems
          .map((i) => `- ${i.label}: ${formatCurrencyINR(i.amount)}`)
          .join('\n')}\nTotal Documented Loss: ${formatCurrencyINR(lossTotal)}`
      : c.amountInvolved !== null && c.amountInvolved !== undefined
      ? `Primary Amount Involved: ${formatCurrencyINR(c.amountInvolved)}`
      : '';

    const evidenceText = docs
      .map((d, idx) => `${idx + 1}. ${d.fileName}${d.notes ? ` (${d.notes})` : ''}`)
      .join('\n');

    return {
      title: c.title || '',
      consumerDetails: '',
      sellerDetails: [c.sellerName, c.orderNumber ? `Order / Ref: ${c.orderNumber}` : '']
        .filter(Boolean)
        .join('\n'),
      description: c.description || '',
      chronology: chronologyLines,
      financialImpact: financialText,
      requestedRemedy: remedyLabel,
      supportingEvidenceList: evidenceText,
    };
  };

  useEffect(() => {
    if (!caseData) return;
    if (caseData.complaintDraft) {
      setDraft({
        title: caseData.complaintDraft.title || '',
        consumerDetails: caseData.complaintDraft.consumerDetails || '',
        sellerDetails: caseData.complaintDraft.sellerDetails || '',
        description: caseData.complaintDraft.description || '',
        chronology: caseData.complaintDraft.chronology || '',
        financialImpact: caseData.complaintDraft.financialImpact || '',
        requestedRemedy: caseData.complaintDraft.requestedRemedy || '',
        supportingEvidenceList: caseData.complaintDraft.supportingEvidenceList || '',
      });
    } else {
      setDraft(buildFromLocalRecords(caseData, documents));
    }
  }, [caseData, documents]);

  const updateField = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setReviewConfirmed(false);
  };

  const handleLoadFromCaseRecords = () => {
    if (!caseData) return;
    setDraft((prev) => ({
      ...buildFromLocalRecords(caseData, documents),
      consumerDetails: prev.consumerDetails,
    }));
    setReviewConfirmed(false);
    toast.success('Synced editable fields with your local case records.');
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await saveComplaintDraft(draft);
      toast.success('Complaint draft saved locally.');
    } catch (err) {
      toast.error(err.message || 'Could not save complaint draft.');
    } finally {
      setSaving(false);
    }
  };

  const formatPlainTextComplaint = () => {
    return [
      `COMPLAINT TITLE: ${draft.title || '—'}`,
      `CASE REFERENCE: ${caseData?.referenceNumber || '—'}`,
      '',
      '1. CONSUMER DETAILS',
      draft.consumerDetails || '—',
      '',
      '2. SELLER / PLATFORM DETAILS',
      draft.sellerDetails || '—',
      '',
      '3. ISSUE DESCRIPTION',
      draft.description || '—',
      '',
      '4. CHRONOLOGY OF EVENTS',
      draft.chronology || '—',
      '',
      '5. DOCUMENTED FINANCIAL IMPACT',
      draft.financialImpact || '—',
      '',
      '6. REQUESTED REMEDY',
      draft.requestedRemedy || '—',
      '',
      '7. SUPPORTING EVIDENCE LIST',
      draft.supportingEvidenceList || '—',
    ].join('\n');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(formatPlainTextComplaint());
      toast.success('Complaint text copied to clipboard.');
    } catch {
      toast.error('Unable to copy automatically. Open Preview to select and copy manually.');
    }
  };

  const handlePrint = () => {
    if (!reviewConfirmed) {
      toast.error('Please check the review confirmation box before printing.');
      return;
    }
    window.print();
  };

  return (
    <CaseWorkspaceLayout
      title="Complaint Editor"
      caseData={caseData}
      actions={
        <div className="gs-no-print" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={handleLoadFromCaseRecords}>
            Sync Case Records
          </Button>
          <Button variant="secondary" size="sm" icon={Eye} onClick={() => setPreviewOpen(true)}>
            Preview
          </Button>
          <Button variant="secondary" size="sm" icon={Copy} onClick={handleCopyText}>
            Copy Text
          </Button>
          <Button variant="primary" size="sm" icon={Save} loading={saving} onClick={handleSaveDraft}>
            Save Draft
          </Button>
        </div>
      }
    >
      {loading && <Spinner centered label="Loading complaint editor..." />}

      {!loading && error && (
        <ErrorState
          title="Unable to load complaint editor"
          description={error}
          onRetry={refreshCase}
        />
      )}

      {!loading && !error && caseData && (
        <>
          <div className="gs-stack-lg gs-no-print">
            <div className="gs-banner gs-banner-info">
              <Info size={18} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Manual Structured Complaint Editor:</strong> Automated AI complaint drafting
                is not connected in this frontend-only MVP. Fields below are populated strictly from
                your locally entered case records and can be edited freely.
              </div>
            </div>

            <Card
              title="Structured Consumer Complaint Draft"
              action={
                caseData.complaintDraft?.updatedAt && (
                  <Badge tone="success">
                    Saved {formatDateTime(caseData.complaintDraft.updatedAt)}
                  </Badge>
                )
              }
            >
              <div className="gs-stack">
                <Input
                  label="Complaint Title"
                  value={draft.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Concise title describing your consumer dispute"
                />

                <div className="gs-grid-2">
                  <Textarea
                    label="Consumer Details"
                    rows={3}
                    value={draft.consumerDetails}
                    onChange={(e) => updateField('consumerDetails', e.target.value)}
                    placeholder="Your full name, contact number, email, and residential city/state"
                  />
                  <Textarea
                    label="Seller Details"
                    rows={3}
                    value={draft.sellerDetails}
                    onChange={(e) => updateField('sellerDetails', e.target.value)}
                    placeholder="Seller legal/store name, platform, order number, and support contact"
                  />
                </div>

                <Textarea
                  label="Issue Description"
                  rows={5}
                  value={draft.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Factual narrative of what went wrong"
                />

                <Textarea
                  label="Chronology"
                  rows={4}
                  value={draft.chronology}
                  onChange={(e) => updateField('chronology', e.target.value)}
                  placeholder="Date-by-date sequence of purchase, issue discovery, and seller contact"
                />

                <div className="gs-grid-2">
                  <Textarea
                    label="Financial Impact"
                    rows={4}
                    value={draft.financialImpact}
                    onChange={(e) => updateField('financialImpact', e.target.value)}
                    placeholder="Itemized documented losses in INR"
                  />
                  <Textarea
                    label="Requested Remedy"
                    rows={4}
                    value={draft.requestedRemedy}
                    onChange={(e) => updateField('requestedRemedy', e.target.value)}
                    placeholder="Refund, replacement, repair, or fee reversal requested"
                  />
                </div>

                <Textarea
                  label="Supporting Evidence List"
                  rows={4}
                  value={draft.supportingEvidenceList}
                  onChange={(e) => updateField('supportingEvidenceList', e.target.value)}
                  placeholder="List of attached invoices, receipts, warranty documents, and screenshots"
                />
              </div>
            </Card>

            <Card title="Review, Copy &amp; Print-Friendly Export">
              <div className="gs-stack">
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={reviewConfirmed}
                    onChange={(e) => setReviewConfirmed(e.target.checked)}
                    style={{ marginTop: 3 }}
                  />
                  <span>
                    I have manually reviewed all consumer details, dates, amounts, and supporting
                    evidence in this draft for factual accuracy.
                  </span>
                </label>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Button variant="primary" icon={Save} loading={saving} onClick={handleSaveDraft}>
                    Save Draft Locally
                  </Button>
                  <Button variant="secondary" icon={Eye} onClick={() => setPreviewOpen(true)}>
                    Preview
                  </Button>
                  <Button variant="secondary" icon={Copy} onClick={handleCopyText}>
                    Copy Complaint Text
                  </Button>
                  <Button
                    variant="accent"
                    icon={Printer}
                    disabled={!reviewConfirmed}
                    onClick={handlePrint}
                  >
                    Print / Save as PDF
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Dedicated Print-Only View */}
          <div className="gs-print-only" style={{ color: '#000000', fontSize: '12pt', lineHeight: 1.5 }}>
            <h1 style={{ fontSize: '16pt', marginBottom: 4 }}>{draft.title || 'Consumer Complaint'}</h1>
            <p style={{ marginBottom: 16 }}>Case Reference: {caseData.referenceNumber}</p>
            <h2 style={{ fontSize: '12pt', marginTop: 12 }}>1. Consumer Details</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{draft.consumerDetails || '—'}</p>
            <h2 style={{ fontSize: '12pt', marginTop: 12 }}>2. Seller Details</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{draft.sellerDetails || '—'}</p>
            <h2 style={{ fontSize: '12pt', marginTop: 12 }}>3. Issue Description</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{draft.description || '—'}</p>
            <h2 style={{ fontSize: '12pt', marginTop: 12 }}>4. Chronology</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{draft.chronology || '—'}</p>
            <h2 style={{ fontSize: '12pt', marginTop: 12 }}>5. Financial Impact</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{draft.financialImpact || '—'}</p>
            <h2 style={{ fontSize: '12pt', marginTop: 12 }}>6. Requested Remedy</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{draft.requestedRemedy || '—'}</p>
            <h2 style={{ fontSize: '12pt', marginTop: 12 }}>7. Supporting Evidence List</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{draft.supportingEvidenceList || '—'}</p>
          </div>
        </>
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Complaint Draft Preview"
        size="lg"
        footer={
          <>
            <Button variant="secondary" icon={Copy} onClick={handleCopyText}>
              Copy Text
            </Button>
            <Button variant="primary" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
          </>
        }
      >
        <div className="gs-stack" style={{ fontSize: '0.92rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileEdit size={18} color="var(--color-navy)" />
            <h3 style={{ fontSize: '1.12rem' }}>{draft.title || 'Untitled Complaint'}</h3>
          </div>
          <div>
            <strong>1. Consumer Details</strong>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: 3 }}>{draft.consumerDetails || '—'}</p>
          </div>
          <div>
            <strong>2. Seller Details</strong>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: 3 }}>{draft.sellerDetails || '—'}</p>
          </div>
          <div>
            <strong>3. Issue Description</strong>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: 3 }}>{draft.description || '—'}</p>
          </div>
          <div>
            <strong>4. Chronology</strong>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: 3 }}>{draft.chronology || '—'}</p>
          </div>
          <div>
            <strong>5. Financial Impact</strong>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: 3 }}>{draft.financialImpact || '—'}</p>
          </div>
          <div>
            <strong>6. Requested Remedy</strong>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: 3 }}>{draft.requestedRemedy || '—'}</p>
          </div>
          <div>
            <strong>7. Supporting Evidence List</strong>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: 3 }}>
              {draft.supportingEvidenceList || '—'}
            </p>
          </div>
        </div>
      </Modal>
    </CaseWorkspaceLayout>
  );
}
