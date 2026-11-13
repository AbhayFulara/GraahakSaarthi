import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Info,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { InformationalPageLayout } from '../../components/layout/InformationalPageLayout';
import { Button, Card } from '../../components/common';

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: 'User Control Over Complaint Information',
    desc: 'You decide what details, dates, amounts, and documents to include in your case. You can edit or delete any case, document, timeline entry, or draft at any time.',
  },
  {
    icon: FileCheck2,
    title: 'Clear Distinction Between Facts and AI Observations',
    desc: 'Information you enter and files you attach are always kept separate from automated or AI-assisted observations. Unverified outputs are never presented as established facts.',
  },
  {
    icon: Info,
    title: 'Transparent AI Limitations',
    desc: 'In this frontend-only stage, automated document extraction, evidence classification, rights answers, and route recommendations display honest unavailable states until connected services are enabled.',
  },
  {
    icon: CheckCircle2,
    title: 'Evidence Organization & Local Storage Clarity',
    desc: 'Currently, cases and documents are stored locally inside your browser (localStorage and IndexedDB) so you can work without creating an account. No unverified claims about remote encryption or cloud storage are made.',
  },
  {
    icon: Scale,
    title: 'Mandatory User Review Before Complaint Export',
    desc: 'Before printing or finalizing any structured complaint draft, GraahakSaarthi requires you to review all facts, dates, amounts, and supporting documents for accuracy.',
  },
];

export function TrustPage() {
  return (
    <InformationalPageLayout
      eyebrow="Trust, Privacy & Transparency"
      title="Built for Honest Guidance and Consumer Clarity"
      subtitle="Understand how GraahakSaarthi handles your case information, separates facts from future AI assistance, and defines its role clearly."
    >
      <div className="gs-stack-lg">
        {/* Mandatory Disclosures */}
        <div className="gs-grid-2">
          <div className="gs-banner gs-banner-warning">
            <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Not an Official Government Portal:</strong> GraahakSaarthi is an independent
              consumer assistance and complaint-preparation platform. Official filings must be
              submitted directly through authorized portals such as the National Consumer Helpline
              or Consumer Commission channels.
            </div>
          </div>

          <div className="gs-banner gs-banner-info">
            <Info size={20} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Not Formal Legal Advice:</strong> Guidance, workflow steps, and future AI
              observations are intended solely to help organize information and do not constitute
              formal legal advice or guaranteed dispute outcomes.
            </div>
          </div>
        </div>

        {/* Core Transparency Principles */}
        <div className="gs-grid-2">
          {PRINCIPLES.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div className="gs-pipeline-icon">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.05rem', marginBottom: 6 }}>{item.title}</h2>
                    <p className="gs-text-sm gs-muted" style={{ lineHeight: 1.6 }}>
                      {item.desc}
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
              <h2 className="gs-section-title">Manage Your Local Data Anytime</h2>
              <p className="gs-text-sm gs-muted" style={{ marginTop: 4 }}>
                View stored item counts or clear all browser-stored application data in Settings.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="/settings">
                <Button variant="secondary">Open Settings</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="accent" icon={ArrowRight}>
                  Open Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </InformationalPageLayout>
  );
}
