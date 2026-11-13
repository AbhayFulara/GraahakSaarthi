import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../common';
import { AnimatedTarazu } from './AnimatedTarazu';
import { WorkflowCard } from './WorkflowCard';

export function HeroSection() {
  return (
    <section className="gs-hero">
      <div className="gs-container gs-hero-three-col">
        {/* Left: Main Introduction */}
        <div className="gs-hero-intro">
          <span className="gs-hero-eyebrow">
            <ShieldCheck size={15} color="var(--color-accent-green)" aria-hidden="true" />
            AI-Powered Consumer Assistance
          </span>

          <h1 className="gs-hero-title">
            Your Consumer Rights. Your Voice. Your Way Forward.
          </h1>

          <p className="gs-hero-supporting">
            Turn consumer problems into clear, informed action with GraahakSaarthi.
          </p>

          <p className="gs-hero-subtitle">
            Organize your evidence, understand your consumer rights, get AI-powered guidance, and
            prepare structured complaints — all in one place.
          </p>

          <p className="gs-hero-tagline">Shikayat Se Samadhan Tak.</p>

          <div className="gs-hero-ctas gs-hero-ctas-desktop">
            <Link to="/dashboard">
              <Button variant="accent" size="lg" icon={ArrowRight}>
                Get Started
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="secondary" size="lg">
                Explore How It Works
              </Button>
            </Link>
          </div>
        </div>

        {/* Centre: Animated Indian Weighing Scale (Tarazu) */}
        <div className="gs-hero-center">
          <AnimatedTarazu />
        </div>

        {/* Right: 5-Stage Workflow Card */}
        <div className="gs-hero-workflow">
          <WorkflowCard />
        </div>

        {/* Mobile-Only Bottom CTAs (matches mobile flow: Intro -> Tarazu -> Workflow -> CTAs) */}
        <div className="gs-hero-ctas gs-hero-ctas-mobile">
          <Link to="/dashboard" style={{ flex: 1 }}>
            <Button variant="accent" size="lg" block icon={ArrowRight}>
              Get Started
            </Button>
          </Link>
          <Link to="/how-it-works" style={{ flex: 1 }}>
            <Button variant="secondary" size="lg" block>
              Explore How It Works
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
