import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, CloudOff, MessageSquare, Scale, Send } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Badge, Button, Card, Select } from '../components/common';
import { useCases } from '../hooks/useCases';
import { MVP_ISSUE_CATEGORIES } from '../utils/constants';
import { getCategoryLabel } from '../utils/formatters';

export function ConsumerRightsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { cases } = useCases();

  const initialCaseId = searchParams.get('caseId') || '';
  const [selectedCaseId, setSelectedCaseId] = useState(initialCaseId);
  const [question, setQuestion] = useState('');
  const [submittedQuestions, setSubmittedQuestions] = useState([]);

  const selectedCase = useMemo(
    () => cases.find((c) => c.id === selectedCaseId) || null,
    [cases, selectedCaseId]
  );

  const handleCaseChange = (e) => {
    const val = e.target.value;
    setSelectedCaseId(val);
    if (val) {
      setSearchParams({ caseId: val });
    } else {
      setSearchParams({});
    }
  };

  const handleAsk = (e) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    setSubmittedQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        question: trimmed,
        caseTitle: selectedCase ? `${selectedCase.referenceNumber} — ${selectedCase.title}` : null,
      },
    ]);
    setQuestion('');
  };

  return (
    <AppLayout title="Consumer Rights Assistant">
      <div className="gs-stack-lg">
        <div>
          <h1 className="gs-page-title">Consumer Rights Assistant</h1>
          <p className="gs-page-subtitle">
            Understand consumer rights in the context of your dispute. Automated AI &amp; RAG
            answers will activate once the backend service is connected.
          </p>
        </div>

        {/* Honest Integration Notice */}
        <div className="gs-banner gs-banner-warning">
          <CloudOff size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Automated Answers Not Yet Connected:</strong> In this frontend-only MVP,
            GraahakSaarthi does not generate fake chatbot answers or fabricate Indian consumer law
            sections or citations.
          </div>
        </div>

        <div className="gs-dashboard-grid">
          {/* Conversation & Question Input Area */}
          <Card
            title="Consumer Rights Inquiry"
            subtitle="Select an optional local case context and compose your question"
            action={<Badge tone="warning">AI Service Pending</Badge>}
          >
            <div className="gs-stack">
              <Select
                label="Case Context (Optional)"
                placeholder="General consumer rights question (no case selected)"
                options={cases.map((c) => ({
                  value: c.id,
                  label: `${c.referenceNumber} — ${c.title}`,
                }))}
                value={selectedCaseId}
                onChange={handleCaseChange}
              />

              {selectedCase && (
                <div
                  className="gs-banner gs-banner-info"
                  style={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{selectedCase.title}</div>
                    <div className="gs-text-xs">
                      Category: {getCategoryLabel(selectedCase.category, MVP_ISSUE_CATEGORIES)} ·
                      Seller: {selectedCase.sellerName || '—'}
                    </div>
                  </div>
                  <Link to={`/case/${selectedCase.id}`}>
                    <Button variant="secondary" size="sm">
                      Open Case
                    </Button>
                  </Link>
                </div>
              )}

              {/* Conversation Area */}
              <div
                style={{
                  minHeight: 220,
                  padding: 16,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {submittedQuestions.length === 0 ? (
                  <div
                    style={{
                      margin: 'auto',
                      textAlign: 'center',
                      maxWidth: 420,
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <Scale
                      size={28}
                      color="var(--color-secondary-blue)"
                      style={{ marginInline: 'auto', marginBottom: 8 }}
                    />
                    <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                      Consumer Rights Answer Display Area
                    </div>
                    <p className="gs-text-xs gs-muted" style={{ marginTop: 4 }}>
                      Ask a question below to preview the conversation layout. Answers require the
                      future FastAPI / RAG backend connection.
                    </p>
                  </div>
                ) : (
                  submittedQuestions.map((item) => (
                    <div key={item.id} className="gs-stack" style={{ gap: 8 }}>
                      <div
                        style={{
                          padding: 12,
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-brand-navy)',
                          color: '#ffffff',
                          alignSelf: 'flex-end',
                          maxWidth: '88%',
                        }}
                      >
                        <div className="gs-text-xs" style={{ opacity: 0.8, marginBottom: 2 }}>
                          {item.caseTitle || 'General Consumer Inquiry'}
                        </div>
                        <div className="gs-text-sm">{item.question}</div>
                      </div>

                      <div
                        style={{
                          padding: 12,
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-warning-border)',
                          alignSelf: 'flex-start',
                          maxWidth: '92%',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            color: 'var(--color-warning)',
                            marginBottom: 4,
                          }}
                        >
                          <MessageSquare size={14} />
                          AI Integration Pending
                        </div>
                        <p className="gs-text-sm gs-muted">
                          Automated consumer-rights explanation is not connected yet. No synthetic
                          legal advice or unverified statutory citations are generated in
                          frontend-only mode.
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAsk} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="gs-input"
                  style={{ flex: 1, minWidth: 220 }}
                  placeholder="Enter a consumer rights question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  aria-label="Consumer rights question"
                />
                <Button type="submit" variant="primary" icon={Send} disabled={!question.trim()}>
                  Submit Question
                </Button>
              </form>
            </div>
          </Card>

          {/* Official Source Reference Area */}
          <Card
            title="Official Source References"
            subtitle="Verified government and statutory references"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <BookOpen size={18} color="var(--color-secondary-blue)" style={{ marginTop: 2 }} />
                <p className="gs-text-sm gs-muted">
                  Official source citations and links matching your question and complaint category
                  will appear here once the RAG knowledge pipeline is connected.
                </p>
              </div>
              <div
                style={{
                  padding: 12,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed var(--color-border-strong)',
                  backgroundColor: 'var(--color-surface-muted)',
                }}
              >
                <div className="gs-text-xs gs-muted">
                  Status: Waiting for verified legal reference integration
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
