import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VoiceCallSimulatorModal } from './components/VoiceCallSimulatorModal';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ContactPage } from './pages/public/ContactPage';

// Beneficiary Pages
import { BeneficiaryDashboard } from './pages/beneficiary/BeneficiaryDashboard';
import { AiVoiceAssistantPage } from './pages/beneficiary/AiVoiceAssistantPage';
import { SkillProfilePage } from './pages/beneficiary/SkillProfilePage';
import { SkillGapPage } from './pages/beneficiary/SkillGapPage';
import { LivelihoodRoadmapPage } from './pages/beneficiary/LivelihoodRoadmapPage';
import { JobRecommendationsPage } from './pages/beneficiary/JobRecommendationsPage';
import { TrainingRecommendationsPage } from './pages/beneficiary/TrainingRecommendationsPage';
import { GovernmentSchemesPage } from './pages/beneficiary/GovernmentSchemesPage';
import { SelfEmploymentPage } from './pages/beneficiary/SelfEmploymentPage';
import { ProfilePage } from './pages/beneficiary/ProfilePage';
import { ApplicationsPage } from './pages/beneficiary/ApplicationsPage';
import { NotificationsPage } from './pages/beneficiary/NotificationsPage';
import { SettingsPage } from './pages/beneficiary/SettingsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BeneficiariesAdminPage } from './pages/admin/BeneficiariesAdminPage';
import { VoiceCallsAdminPage } from './pages/admin/VoiceCallsAdminPage';
import { AssessmentsAdminPage } from './pages/admin/AssessmentsAdminPage';
import { SkillAnalyticsAdminPage } from './pages/admin/SkillAnalyticsAdminPage';

// Employer Pages
import { EmployerDashboard } from './pages/employer/EmployerDashboard';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [isCallModalOpen, setIsCallModalOpen] = useState<boolean>(false);
  const { user } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      // Public
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} onOpenCallModal={() => setIsCallModalOpen(true)} />;
      case 'about':
        return <AboutPage />;
      case 'how-it-works':
        return <HowItWorksPage onOpenCallModal={() => setIsCallModalOpen(true)} />;
      case 'contact':
        return <ContactPage />;

      // Beneficiary
      case 'dashboard':
        return <BeneficiaryDashboard onNavigate={setCurrentPage} />;
      case 'voice-assistant':
      case 'assessment':
        return <AiVoiceAssistantPage onNavigate={setCurrentPage} />;
      case 'skills':
        return <SkillProfilePage onNavigate={setCurrentPage} />;
      case 'skill-gap':
        return <SkillGapPage onNavigate={setCurrentPage} />;
      case 'roadmap':
        return <LivelihoodRoadmapPage onNavigate={setCurrentPage} />;
      case 'jobs':
        return <JobRecommendationsPage />;
      case 'training':
        return <TrainingRecommendationsPage />;
      case 'schemes':
        return <GovernmentSchemesPage />;
      case 'self-employment':
        return <SelfEmploymentPage onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePage />;
      case 'applications':
        return <ApplicationsPage onNavigate={setCurrentPage} />;
      case 'notifications':
        return <NotificationsPage />;
      case 'settings':
        return <SettingsPage />;

      // Admin
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={setCurrentPage} />;
      case 'admin-beneficiaries':
        return <BeneficiariesAdminPage />;
      case 'admin-calls':
        return <VoiceCallsAdminPage onOpenCallModal={() => setIsCallModalOpen(true)} />;
      case 'admin-assessments':
        return <AssessmentsAdminPage />;
      case 'admin-analytics':
        return <SkillAnalyticsAdminPage />;

      // Employer
      case 'employer-dashboard':
      case 'employer-jobs':
        return <EmployerDashboard />;

      default:
        return <LandingPage onNavigate={setCurrentPage} onOpenCallModal={() => setIsCallModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-dark">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenCallModal={() => setIsCallModalOpen(true)}
      />

      <main className="flex-1">
        {renderPage()}
      </main>

      <Footer onNavigate={setCurrentPage} />

      <VoiceCallSimulatorModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
