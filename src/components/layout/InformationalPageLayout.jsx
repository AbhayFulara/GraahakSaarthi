import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Button } from '../common';

export function InformationalPageLayout({
  eyebrow,
  title,
  subtitle,
  children,
}) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <section className="gs-info-page-header">
          <div className="gs-container">
            <div style={{ marginBottom: 18 }}>
              <Link to="/">
                <Button variant="secondary" size="sm" icon={ArrowLeft}>
                  Back to Home
                </Button>
              </Link>
            </div>

            {eyebrow && <div className="gs-info-eyebrow">{eyebrow}</div>}
            <h1 className="gs-info-title">{title}</h1>
            {subtitle && <p className="gs-info-subtitle">{subtitle}</p>}
          </div>
        </section>

        <section className="gs-info-page-body">
          <div className="gs-container">{children}</div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
