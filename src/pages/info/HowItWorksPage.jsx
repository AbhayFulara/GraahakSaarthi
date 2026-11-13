import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  FileText,
  Scale,
} from 'lucide-react';
import { InformationalPageLayout } from '../../components/layout/InformationalPageLayout';
import { Button, Card } from '../../components/common';

const DETAILED_STEPS = [
  {
    step: 1,
    icon: ClipboardList,
    title: 'Consumer Problem + Evidence',
    summary: 'Record what happened and keep every proof in one place.',
    details:
      'Start a case with your order details, seller or platform name, purchase date, incident date, and requested remedy. Attach supporting invoices, payment receipts, warranty cards, product defect photos, and chat screenshots so nothing gets misplaced.',
  },
  {
    step: 2,
    icon: BrainCircuit,
    title: 'Case Organization & Verification Readiness',
    summary: 'Structure facts, chronology, and evidence gaps clearly.',
    details:
      'Arrange key events such as purchase, delivery, issue discovery, and seller contact in chronological order. Add manual notes to your uploaded documents while keeping the workspace ready for future automated verification.',
  },
  {
    step: 3,
    icon: Scale,
    title: 'Consumer Rights + Action Plan',
    summary: 'Understand your options and review the escalation sequence.',
    details:
      'Review plain-language consumer guidance and explore how disputes progress from direct seller or platform support to formal consumer grievance channels. GraahakSaarthi keeps user facts separate from unverified suggestions.',
  },
  {
    step: 4,
    icon: FileText,
    title: 'Complaint Preparation',
    summary: 'Draft and verify a complete, evidence-backed complaint.',
    details:
      'Calculate your documented monetary loss in INR separately from possible remedies. Edit your structured complaint draft — covering consumer details, seller details, issue narrative, chronology, financial impact, and attached evidence — and review it before copying or printing.',
  },
  {
    step: 5,
    icon: CheckCircle2,
    title: 'Case Tracking',
    summary: 'Stay organized through follow-ups and resolution milestones.',
    details:
      'Track your case status, record ticket or docket reference numbers, log manual seller responses, and manage follow-up tasks with custom dates from initial complaint through final resolution.',
  },
];

export function HowItWorksPage() {
  return (
    <InformationalPageLayout
      eyebrow="Consumer Journey"
      title="How GraahakSaarthi Works"
      subtitle="A clear five-step path that turns scattered receipts and messages into an organized, evidence-backed consumer complaint."
    >
      <div className="gs-stack-lg">
        <div className="gs-stack">
          {DETAILED_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.step}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span className="gs-step-num" aria-hidden="true">
                    {item.step}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Icon size={18} color="var(--color-secondary-blue)" aria-hidden="true" />
                      <h2 style={{ fontSize: '1.12rem' }}>{item.title}</h2>
                    </div>
                    <p
                      className="gs-text-sm"
                      style={{ fontWeight: 600, color: 'var(--color-secondary-blue)', marginBottom: 6 }}
                    >
                      {item.summary}
                    </p>
                    <p className="gs-text-sm gs-muted" style={{ lineHeight: 1.65 }}>
                      {item.details}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card>
          <div className="gs-row-between">
            <div>
              <h2 className="gs-section-title">Ready to organize your complaint?</h2>
              <p className="gs-text-sm gs-muted" style={{ marginTop: 4 }}>
                Open your local consumer workspace or start a new complaint right away.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="/dashboard">
                <Button variant="secondary">Open Dashboard</Button>
              </Link>
              <Link to="/case/new">
                <Button variant="accent" icon={ArrowRight}>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </InformationalPageLayout>
  );
}
