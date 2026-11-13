import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileUp,
  Trash2,
} from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button, Card, Input, Select, Textarea } from '../components/common';
import { useCases } from '../hooks/useCases';
import { useDocuments } from '../hooks/useDocuments';
import {
  EVIDENCE_DOCUMENT_TYPES,
  MVP_ISSUE_CATEGORIES,
  REQUESTED_REMEDIES,
} from '../utils/constants';
import { formatCurrencyINR, formatFileSize, getCategoryLabel } from '../utils/formatters';
import { validateUploadFile } from '../utils/validators';

const STEPS = [
  { id: 1, label: 'Dispute Category' },
  { id: 2, label: 'Problem Description' },
  { id: 3, label: 'Order & Financial Info' },
  { id: 4, label: 'Supporting Documents' },
  { id: 5, label: 'Review & Create' },
];

export function NewCaseWizardPage() {
  const navigate = useNavigate();
  const { createCase } = useCases();
  const { addDocument } = useDocuments();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [stepError, setStepError] = useState(null);

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    productName: '',
    sellerName: '',
    orderNumber: '',
    purchaseDate: '',
    incidentDate: '',
    amountInvolved: '',
    requestedRemedy: 'full_refund',
  });

  const [queuedDocs, setQueuedDocs] = useState([]);
  const [defaultDocType, setDefaultDocType] = useState('invoice');

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setStepError(null);
  };

  const validateCurrentStep = (targetStep = step) => {
    if (targetStep === 1 && !formData.category) {
      return 'Please select a dispute category before continuing.';
    }
    if (targetStep === 2) {
      if (!formData.title.trim()) return 'Please provide a short title for your complaint.';
      if (formData.description.trim().length < 20) {
        return 'Please describe the consumer problem in at least 20 characters.';
      }
    }
    if (targetStep === 3) {
      if (!formData.productName.trim()) return 'Please enter the product or service name.';
      if (!formData.sellerName.trim()) return 'Please enter the seller or platform name.';
      if (formData.amountInvolved === '' || Number(formData.amountInvolved) < 0) {
        return 'Please enter a valid amount involved (INR).';
      }
    }
    return null;
  };

  const handleNext = () => {
    const err = validateCurrentStep(step);
    if (err) {
      setStepError(err);
      return;
    }
    setStepError(null);
    setStep((prev) => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setStepError(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleStepJump = (target) => {
    if (target < step) {
      setStepError(null);
      setStep(target);
      return;
    }
    for (let s = 1; s < target; s += 1) {
      const err = validateCurrentStep(s);
      if (err) {
        setStep(s);
        setStepError(err);
        return;
      }
    }
    setStepError(null);
    setStep(target);
  };

  const handleFilePick = (event) => {
    const files = Array.from(event.target.files || []);
    const valid = [];
    for (const file of files) {
      const err = validateUploadFile(file);
      if (err) {
        toast.error(`${file.name}: ${err}`);
      } else {
        valid.push({ file, documentType: defaultDocType });
      }
    }
    if (valid.length > 0) {
      setQueuedDocs((prev) => [...prev, ...valid]);
    }
    event.target.value = '';
  };

  const removeQueuedDoc = (index) => {
    setQueuedDocs((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCreateCase = async () => {
    for (let s = 1; s <= 3; s += 1) {
      const err = validateCurrentStep(s);
      if (err) {
        setStep(s);
        setStepError(err);
        return;
      }
    }

    setSubmitting(true);
    try {
      const createdCase = await createCase({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        productName: formData.productName.trim(),
        sellerName: formData.sellerName.trim(),
        orderNumber: formData.orderNumber.trim(),
        amountInvolved: Number(formData.amountInvolved),
      });

      if (queuedDocs.length > 0) {
        let savedCount = 0;
        for (const item of queuedDocs) {
          try {
            await addDocument(createdCase.id, item.file, {
              documentType: item.documentType,
            });
            savedCount += 1;
          } catch {
            toast.error(`Case saved, but failed to store "${item.file.name}" locally.`);
          }
        }
        toast.success(
          `Case ${createdCase.referenceNumber} created with ${savedCount} local document(s).`
        );
      } else {
        toast.success(`Case ${createdCase.referenceNumber} created locally.`);
      }

      navigate(`/case/${createdCase.id}`);
    } catch (error) {
      toast.error(error.message || 'Could not save complaint locally.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout title="New Complaint Wizard">
      <div className="gs-stack-lg">
        <div>
          <h1 className="gs-page-title">Create a New Consumer Case</h1>
          <p className="gs-page-subtitle">
            Complete each step below. Your entered details are preserved when navigating between
            steps and saved locally in your browser upon creation.
          </p>
        </div>

        {/* Step Progress Indicator */}
        <div className="gs-wizard-steps" role="tablist" aria-label="Complaint creation steps">
          {STEPS.map((s) => {
            const isActive = s.id === step;
            const isDone = s.id < step;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleStepJump(s.id)}
                className={`gs-wizard-step ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: isActive
                      ? 'var(--color-brand-navy)'
                      : isDone
                      ? 'var(--color-accent-green)'
                      : 'var(--color-border)',
                    color: isActive || isDone ? '#ffffff' : 'var(--color-text-secondary)',
                    flexShrink: 0,
                  }}
                >
                  {isDone ? <Check size={13} /> : s.id}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {stepError && (
          <div className="gs-banner gs-banner-warning" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{stepError}</span>
          </div>
        )}

        <Card>
          {/* Step 1: Select Dispute Category */}
          {step === 1 && (
            <div className="gs-stack">
              <div>
                <h2 className="gs-section-title">Step 1: Select Dispute Category</h2>
                <p className="gs-text-sm gs-muted" style={{ marginTop: 4 }}>
                  Choose the consumer dispute category that matches your situation.
                </p>
              </div>

              <div className="gs-grid-2">
                {MVP_ISSUE_CATEGORIES.map((cat) => {
                  const selected = formData.category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => updateField('category', cat.id)}
                      style={{
                        textAlign: 'left',
                        padding: 16,
                        borderRadius: 'var(--radius-md)',
                        border: selected
                          ? '2px solid var(--color-navy)'
                          : '1px solid var(--color-border-strong)',
                        backgroundColor: selected ? 'var(--color-navy-soft)' : 'var(--color-surface)',
                        cursor: 'pointer',
                      }}
                    >
                      <div className="gs-row-between" style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                          {cat.label}
                        </span>
                        {selected && <CheckCircle2 size={18} color="var(--color-accent-green)" />}
                      </div>
                      <p className="gs-text-xs gs-muted">{cat.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Describe the Consumer Problem */}
          {step === 2 && (
            <div className="gs-stack">
              <div>
                <h2 className="gs-section-title">Step 2: Describe the Consumer Problem</h2>
                <p className="gs-text-sm gs-muted" style={{ marginTop: 4 }}>
                  Explain clearly what happened, what defect or dispute occurred, and any seller
                  responses received.
                </p>
              </div>

              <Input
                label="Complaint Title"
                required
                placeholder="e.g. Defective laptop charger delivered & refund denied"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
              />

              <Textarea
                label="Problem Description"
                required
                rows={6}
                placeholder="State factual details: what was ordered, what went wrong, dates of contacting customer care, and what the seller replied..."
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                hint="Minimum 20 characters. Stick strictly to verified facts."
              />
            </div>
          )}

          {/* Step 3: Relevant Information */}
          {step === 3 && (
            <div className="gs-stack">
              <div>
                <h2 className="gs-section-title">Step 3: Purchase, Seller &amp; Financial Details</h2>
                <p className="gs-text-sm gs-muted" style={{ marginTop: 4 }}>
                  Provide order details accurately to anchor your case timeline and financial impact.
                </p>
              </div>

              <div className="gs-grid-2">
                <Input
                  label="Product or Service Name"
                  required
                  placeholder="e.g. Acme 65W USB-C Adapter"
                  value={formData.productName}
                  onChange={(e) => updateField('productName', e.target.value)}
                />

                <Input
                  label="Seller or Platform"
                  required
                  placeholder="e.g. Amazon India / Seller Name"
                  value={formData.sellerName}
                  onChange={(e) => updateField('sellerName', e.target.value)}
                />

                <Input
                  label="Order / Reference Number"
                  placeholder="e.g. OD402-1948572-1122"
                  value={formData.orderNumber}
                  onChange={(e) => updateField('orderNumber', e.target.value)}
                />

                <Input
                  label="Amount Involved (INR)"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="e.g. 2499"
                  value={formData.amountInvolved}
                  onChange={(e) => updateField('amountInvolved', e.target.value)}
                />

                <Input
                  label="Purchase Date"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => updateField('purchaseDate', e.target.value)}
                />

                <Input
                  label="Incident Date"
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => updateField('incidentDate', e.target.value)}
                />
              </div>

              <div style={{ maxWidth: 420 }}>
                <Select
                  label="Requested Remedy"
                  required
                  options={REQUESTED_REMEDIES}
                  value={formData.requestedRemedy}
                  onChange={(e) => updateField('requestedRemedy', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 4: Add Supporting Documents */}
          {step === 4 && (
            <div className="gs-stack">
              <div>
                <h2 className="gs-section-title">Step 4: Add Supporting Documents (Optional)</h2>
                <p className="gs-text-sm gs-muted" style={{ marginTop: 4 }}>
                  Select invoices, receipts, warranty cards, or screenshots to store locally with
                  this case. You can also manage documents later in the Evidence Centre.
                </p>
              </div>

              <div style={{ maxWidth: 380 }}>
                <Select
                  label="Default Document Type"
                  options={EVIDENCE_DOCUMENT_TYPES}
                  value={defaultDocType}
                  onChange={(e) => setDefaultDocType(e.target.value)}
                />
              </div>

              <label className="gs-dropzone">
                <input
                  type="file"
                  multiple
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  onChange={handleFilePick}
                  style={{ display: 'none' }}
                />
                <FileUp
                  size={28}
                  color="var(--color-secondary-blue)"
                  style={{ marginInline: 'auto', marginBottom: 8 }}
                />
                <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                  Click to attach supporting documents
                </div>
                <p className="gs-text-xs gs-muted" style={{ marginTop: 4 }}>
                  PDF, JPG, PNG, WEBP up to 10 MB per file (stored locally in browser IndexedDB)
                </p>
              </label>

              {queuedDocs.length > 0 && (
                <div className="gs-stack">
                  {queuedDocs.map((item, idx) => (
                    <div
                      key={`${item.file.name}-${idx}`}
                      className="gs-row-between"
                      style={{
                        padding: '10px 14px',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-surface-muted)',
                      }}
                    >
                      <div>
                        <div className="gs-text-sm" style={{ fontWeight: 600 }}>
                          {item.file.name}
                        </div>
                        <div className="gs-text-xs gs-muted">
                          {formatFileSize(item.file.size)} ·{' '}
                          {EVIDENCE_DOCUMENT_TYPES.find((t) => t.value === item.documentType)?.label}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => removeQueuedDoc(idx)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review & Create */}
          {step === 5 && (
            <div className="gs-stack">
              <div>
                <h2 className="gs-section-title">Step 5: Review &amp; Create Case</h2>
                <p className="gs-text-sm gs-muted" style={{ marginTop: 4 }}>
                  Review your entered details carefully. Creating the case saves it locally without
                  generating synthetic AI analysis.
                </p>
              </div>

              <div className="gs-grid-2">
                <div>
                  <span className="gs-text-xs gs-muted">Dispute Category</span>
                  <div style={{ fontWeight: 600 }}>
                    {getCategoryLabel(formData.category, MVP_ISSUE_CATEGORIES)}
                  </div>
                </div>
                <div>
                  <span className="gs-text-xs gs-muted">Complaint Title</span>
                  <div style={{ fontWeight: 600 }}>{formData.title}</div>
                </div>
                <div>
                  <span className="gs-text-xs gs-muted">Product / Service</span>
                  <div style={{ fontWeight: 600 }}>{formData.productName}</div>
                </div>
                <div>
                  <span className="gs-text-xs gs-muted">Seller / Platform</span>
                  <div style={{ fontWeight: 600 }}>{formData.sellerName}</div>
                </div>
                <div>
                  <span className="gs-text-xs gs-muted">Order / Reference Number</span>
                  <div style={{ fontWeight: 600 }}>{formData.orderNumber || '—'}</div>
                </div>
                <div>
                  <span className="gs-text-xs gs-muted">Amount &amp; Remedy</span>
                  <div style={{ fontWeight: 600 }}>
                    {formatCurrencyINR(formData.amountInvolved)} ·{' '}
                    {REQUESTED_REMEDIES.find((r) => r.value === formData.requestedRemedy)?.label}
                  </div>
                </div>
                <div>
                  <span className="gs-text-xs gs-muted">Purchase / Incident Dates</span>
                  <div style={{ fontWeight: 600 }}>
                    {formData.purchaseDate || '—'} / {formData.incidentDate || '—'}
                  </div>
                </div>
                <div>
                  <span className="gs-text-xs gs-muted">Supporting Documents</span>
                  <div style={{ fontWeight: 600 }}>
                    {queuedDocs.length > 0
                      ? `${queuedDocs.length} document(s) ready to save locally`
                      : 'None attached yet'}
                  </div>
                </div>
              </div>

              <div>
                <span className="gs-text-xs gs-muted">Problem Description</span>
                <p
                  className="gs-text-sm"
                  style={{
                    marginTop: 4,
                    padding: 12,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-surface-muted)',
                    border: '1px solid var(--color-border)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {formData.description}
                </p>
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div
            className="gs-row-between"
            style={{
              marginTop: 24,
              paddingTop: 18,
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <Button
              variant="secondary"
              icon={ArrowLeft}
              onClick={handleBack}
              disabled={step === 1 || submitting}
            >
              Previous
            </Button>

            {step < 5 ? (
              <Button variant="primary" icon={ArrowRight} onClick={handleNext}>
                Next Step
              </Button>
            ) : (
              <Button
                variant="accent"
                icon={CheckCircle2}
                loading={submitting}
                onClick={handleCreateCase}
              >
                Create Case Locally
              </Button>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
