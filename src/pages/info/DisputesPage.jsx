import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { InformationalPageLayout } from '../../components/layout/InformationalPageLayout';
import { Button, Card } from '../../components/common';
import { MVP_ISSUE_CATEGORIES } from '../../utils/constants';

export function DisputesPage() {
  return (
    <InformationalPageLayout
      eyebrow="Dispute Coverage"
      title="Consumer Disputes Supported in the MVP"
      subtitle="GraahakSaarthi focuses initially on common e-commerce and everyday consumer disputes faced by Indian consumers."
    >
      <div className="gs-stack-lg">
        <div className="gs-grid-2">
          {MVP_ISSUE_CATEGORIES.map((cat) => (
            <Card key={cat.id}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <CheckCircle2
                  size={20}
                  color="var(--color-accent-green)"
                  style={{ flexShrink: 0, marginTop: 2 }}
                  aria-hidden="true"
                />
                <div>
                  <h2 style={{ fontSize: '1.05rem', marginBottom: 6 }}>{cat.label}</h2>
                  <p className="gs-text-sm gs-muted" style={{ lineHeight: 1.6 }}>
                    {cat.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <div className="gs-row-between">
            <div>
              <h2 className="gs-section-title">Have a dispute in one of these categories?</h2>
              <p className="gs-text-sm gs-muted" style={{ marginTop: 4 }}>
                Use the guided 5-step complaint wizard to document your case and attach supporting
                proof.
              </p>
            </div>
            <Link to="/case/new">
              <Button variant="accent" icon={ArrowRight}>
                Start New Complaint
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </InformationalPageLayout>
  );
}
