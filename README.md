# GraahakSaarthi — Frontend

**Tagline:** *Shikayat Se Samadhan Tak.*

GraahakSaarthi is a consumer rights and complaint assistance platform for Indian consumers, built with **React + Vite (JavaScript)**.

## Running Locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Production build**
   ```bash
   npm run build
   ```

## Frontend Folder Structure

```text
public/
  graahaksaarthi-logo.png      # Favicon / public logo asset
  media/
    brand-bg.mp4               # Shared looping background video (Customer Journey + Footer)
    customer-journey.jpg       # 5-stage customer journey visual overview
    story-video.mp4            # 30-second narrated Rahul story video
src/
  assets/logo/                 # Official GraahakSaarthi logo imported by Navbar & Tarazu
  components/
    case/                      # Case workspace layout wrapper
    common/                    # Reusable UI primitives (Button, Card, Input, Modal, ThemeToggle, etc.)
    home/                      # Homepage sections (HeroSection, AnimatedTarazu, WorkflowCard, CustomerJourneySection)
    layout/                    # Navbar, Footer, Sidebar, Topbar, AppLayout, InformationalPageLayout
  context/                     # ThemeContext (defaults to dark mode, persists gs_theme in localStorage)
  data/repositories/           # Data abstraction layer (future backend API integration point)
  hooks/                       # Domain hooks wrapping repositories (useCases, useDocuments, etc.)
  pages/                       # Public informational pages & case workspace pages
  routes/                      # AppRoutes.jsx
  styles/                      # Design tokens (variables.css), global, layout, pages, responsive CSS
  utils/                       # Constants, formatters, validators
```

## Future Backend API Integration

- **`src/data/repositories/`** (`caseRepository.js`, `documentRepository.js`, `taskRepository.js`, `settingsRepository.js`) isolates persistence from UI components.
- **`src/hooks/`** (`useCases`, `useCaseDetails`, `useDocuments`, `useCaseTasks`, `useSettings`) consumes those repositories, allowing future REST/API calls to replace `localStorage`/`IndexedDB` without redesigning UI screens.

## Routes

- `/` — Homepage (Hero with Animated Tarazu & 5-Stage Workflow Card, Customer Journey Experience, Footer)
- `/how-it-works` — Detailed 5-Step Consumer Journey
- `/capabilities` — Platform Capabilities Overview
- `/disputes` — MVP Consumer Dispute Coverage
- `/trust` — Trust, Privacy & Transparency Disclosures
- `/dashboard` — Main Consumer Dashboard
- `/cases` — My Cases (Search, Filter, Edit, Delete)
- `/case/new` — 5-Step New Complaint Wizard
- `/documents` — Cross-Case Documents Library
- `/assistant` — Consumer Rights Assistant
- `/case/:id` — Case Overview
- `/case/:id/evidence` — Evidence Centre (Drag-and-Drop & File Previews)
- `/case/:id/evidence-analysis` — Evidence Analysis Structure & Manual Notes
- `/case/:id/timeline` — Case Timeline (Manual Add/Edit/Delete)
- `/case/:id/analysis` — AI Case Analysis Structure
- `/case/:id/route` — Grievance Route Navigator
- `/case/:id/loss` — Financial Loss Calculator (INR)
- `/case/:id/draft` — Structured Complaint Editor (Copy & Print-Friendly)
- `/case/:id/track` — Case Tracking & Follow-up Tasks
- `/settings` — Preferences & Browser Storage Management
