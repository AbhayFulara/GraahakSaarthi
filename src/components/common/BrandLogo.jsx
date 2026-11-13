import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo/graahaksaarthi-logo.png';
import { BRAND } from '../../utils/constants';

/**
 * Official GraahakSaarthi Brand Logo.
 * Preserves exact original proportions, colours, and identity without stretching or cropping.
 */
export function BrandLogo({
  to = '/',
  size = 44,
  showIcon = true,
  showText = true,
  showTagline = false,
  darkSurface = false,
}) {
  const content = (
    <>
      {showIcon && (
        <span
          className="gs-brand-logo-wrap"
          style={{ width: size, height: size }}
        >
          <img
            src={logoImg}
            alt="GraahakSaarthi Official Logo"
            className="gs-brand-logo-img"
          />
        </span>
      )}
      {showText && (
        <span className="gs-brand-text">
          <span className="gs-brand-name-row">
            <span
              className="gs-brand-name"
              style={darkSurface ? { color: '#FFFFFF' } : undefined}
            >
              {BRAND.name}
            </span>
          </span>
          {showTagline && (
            <span
              className="gs-brand-tagline"
              style={darkSurface ? { color: '#6EE7B7' } : undefined}
            >
              {BRAND.tagline}
            </span>
          )}
        </span>
      )}
    </>
  );

  if (!to) {
    return <div className="gs-brand">{content}</div>;
  }

  return (
    <Link to={to} className="gs-brand" aria-label={`${BRAND.name} — ${BRAND.tagline}`}>
      {content}
    </Link>
  );
}
