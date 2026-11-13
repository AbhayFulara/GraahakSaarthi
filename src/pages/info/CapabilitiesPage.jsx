import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BrainCircuit,
  Calculator,
  CheckSquare,
  FileEdit,
  Route as RouteIcon,
  Scale,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { InformationalPageLayout } from '../../components/layout/InformationalPageLayout';
import { Badge, Button, Card } from '../../components/common';

const PLATFORM_CAPABILITIES = [
  {
    icon: Upload,
    title: 'Structured Evidence Centre',
    availability: 'Available Now (Frontend)',
    tone: 'success',
    desc: 'Attach, preview, and organize PDFs, JPG/PNG images, receipts, invoices, warranty cards, and chat screenshots directly in your browser.',
  },
  {
    icon: BrainCircuit,
    title: 'Evidence-to-Case Intelligence',
    availability: 'Future AI Integration',
    tone: 'warning',
    desc: 'Prepared workspace for automated document extraction, evidence strength classification, missing-document checks, and inconsistency detection once AI services are connected.',
  },
  {
    icon: Scale,
    title: 'Plain-Language Consumer Rights',
    availability: 'Future AI Integration',
    tone: 'warning',
    desc: 'Dedicated case-aware question and reference layout designed to explain relevant consumer rights without fabricating laws or citations.',
  },
  {
    icon: RouteIcon,
    title: 'Grievance Route Navigator',
    availability: 'Future Rules Integration',
    tone: 'warning',
    desc: 'Structured pathway view covering seller contact, National Consumer Helpline, and Consumer Commission preparation once verified route rules are connected.',
  },
  {
    icon: Calculator,
    title: 'Financial Impact Calculator',
    availability: 'Available Now (Frontend)',
    tone: 'success',
    desc: 'Add, edit, and total documented expenses in INR while clearly separating actual monetary loss from non-guaranteed potential remedies.',
  },
  {
    icon: FileEdit,
    title: 'Complaint Editor',
    availability: 'Available Now (Frontend)',
    tone: 'success',
    desc: 'Edit structured complaint sections manually, sync from your case records, preview, copy complaint text, and print cleanly.',
  },
  {
    icon: CheckSquare,
    title: 'Case Tracking',
    availability: 'Available Now (Frontend)',
    tone: 'success',
    desc: 'Manage case status, reference numbers, milestones, manual progress updates, and follow-up tasks locally.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent AI Assistance',
    availability: 'Core Design Principle',
    tone: 'info',
    desc: 'Clearly distinguishes user-entered records from future AI-assisted observations and always shows honest unavailable states rather than synthetic outputs.',
  },
];

export function CapabilitiesPage() {
  return (
    <InformationalPageLayout
      eyebrow="Platform Capabilities"
      title="Tools Built for Structured Consumer Resolution"
      subtitle="GraahakSaarthi clearly separates features that work locally today from capabilities that depend on future AI integration."
    >
      <div className="gs-stack-lg">
        <div className="gs-grid-2">
          {PLATFORM_CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <Card key={cap.title}>
                <div className="gs-row-between" style={{ marginBottom: 12 }}>
                  <div className="gs-pipeline-icon">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <Badge tone={cap.tone}>{cap.availability}</Badge>
                </div>
                <h2 style={{ fontSize: '1.08rem', marginBottom: 6 }}>{cap.title}</h2>
                <p className="gs-text-sm gs-muted" style={{ lineHeight: 1.6 }}>
                  {cap.desc}
                </p>
              </Card>
            );
          })}
        </div>

        <Card>
          <div className="gs-row-between">
            <div>
              <h2 className="gs-section-title">Explore the Workspace</h2>
              <p className="gs-text-sm gs-muted" style={{ marginTop: 4 }}>
                Start organizing your consumer complaint and supporting proof today.
              </p>
            </div>
            <Link to="/dashboard">
              <Button variant="accent" icon={ArrowRight}>
                Open Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </InformationalPageLayout>
  );
}
