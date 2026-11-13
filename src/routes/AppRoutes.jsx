import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFoundPage } from '../pages/NotFoundPage';
import { HomePage } from '../pages/HomePage';
import { HowItWorksPage } from '../pages/info/HowItWorksPage';
import { CapabilitiesPage } from '../pages/info/CapabilitiesPage';
import { DisputesPage } from '../pages/info/DisputesPage';
import { TrustPage } from '../pages/info/TrustPage';
import { DashboardPage } from '../pages/DashboardPage';
import { MyCasesPage } from '../pages/MyCasesPage';
import { NewCaseWizardPage } from '../pages/NewCaseWizardPage';
import { CaseOverviewPage } from '../pages/CaseOverviewPage';
import { EvidenceUploadPage } from '../pages/EvidenceUploadPage';
import { DocumentsLibraryPage } from '../pages/DocumentsLibraryPage';
import { EvidenceAnalysisPage } from '../pages/EvidenceAnalysisPage';
import { CaseTimelinePage } from '../pages/CaseTimelinePage';
import { CaseAnalysisPage } from '../pages/CaseAnalysisPage';
import { ConsumerRightsPage } from '../pages/ConsumerRightsPage';
import { GrievanceRoutePage } from '../pages/GrievanceRoutePage';
import { FinancialLossPage } from '../pages/FinancialLossPage';
import { ComplaintEditorPage } from '../pages/ComplaintEditorPage';
import { CaseTrackingPage } from '../pages/CaseTrackingPage';
import { SettingsPage } from '../pages/SettingsPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Homepage & Public Informational Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/capabilities" element={<CapabilitiesPage />} />
      <Route path="/disputes" element={<DisputesPage />} />
      <Route path="/trust" element={<TrustPage />} />
      <Route path="/welcome" element={<Navigate to="/" replace />} />

      {/* Main Workspace */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/cases" element={<MyCasesPage />} />
      <Route path="/documents" element={<DocumentsLibraryPage />} />
      <Route path="/assistant" element={<ConsumerRightsPage />} />
      <Route path="/settings" element={<SettingsPage />} />

      {/* Case Creation & Case Workspace */}
      <Route path="/case/new" element={<NewCaseWizardPage />} />
      <Route path="/case/:id" element={<CaseOverviewPage />} />
      <Route path="/case/:id/evidence" element={<EvidenceUploadPage />} />
      <Route path="/case/:id/evidence-analysis" element={<EvidenceAnalysisPage />} />
      <Route path="/case/:id/timeline" element={<CaseTimelinePage />} />
      <Route path="/case/:id/analysis" element={<CaseAnalysisPage />} />
      <Route path="/case/:id/route" element={<GrievanceRoutePage />} />
      <Route path="/case/:id/loss" element={<FinancialLossPage />} />
      <Route path="/case/:id/draft" element={<ComplaintEditorPage />} />
      <Route path="/case/:id/track" element={<CaseTrackingPage />} />

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
