import { Link } from 'react-router-dom';
import { BrandLogo } from '../common';

export function Footer() {
  return (
    <footer className="gs-public-footer">
      <div className="gs-container">
        <div className="gs-footer-grid">
          <div>
            <BrandLogo to="/" showIcon={false} showTagline darkSurface />
            <p className="gs-text-sm" style={{ marginTop: 12, color: '#bfd3ea', maxWidth: 380 }}>
              A consumer rights and complaint preparation platform designed to help Indian
              consumers organize supporting proof and prepare structured grievances.
            </p>
          </div>

          <div>
            <h3 className="gs-footer-heading">Platform</h3>
            <ul className="gs-footer-links">
              <li>
                <Link to="/how-it-works">How It Works</Link>
              </li>
              <li>
                <Link to="/capabilities">Capabilities</Link>
              </li>
              <li>
                <Link to="/disputes">Dispute Coverage</Link>
              </li>
              <li>
                <Link to="/trust">Trust &amp; Privacy</Link>
              </li>
              <li>
                <Link to="/dashboard">Open Dashboard</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="gs-footer-heading">Important Notice</h3>
            <p className="gs-text-xs" style={{ color: '#bfd3ea', lineHeight: 1.65 }}>
              GraahakSaarthi is an independent consumer assistance and complaint-preparation
              workspace. It is not an official government complaint portal, and automated or
              AI-assisted observations do not constitute formal legal advice.
            </p>
          </div>
        </div>

        <div className="gs-footer-bottom">
          <span>© {new Date().getFullYear()} GraahakSaarthi. All rights reserved.</span>
          <span>Shikayat Se Samadhan Tak.</span>
        </div>
      </div>
    </footer>
  );
}
