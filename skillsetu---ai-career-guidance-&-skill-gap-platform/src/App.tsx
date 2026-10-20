import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { TopNavbar } from './components/layout/TopNavbar';
import { BottomNav } from './components/layout/BottomNav';
import { VoiceAssistantModal } from './components/layout/VoiceAssistantModal';
import { StudentHome } from './components/student/StudentHome';
import { CareerLadderView } from './components/student/CareerLadderView';
import { CareerMatchesView } from './components/student/CareerMatchesView';
import { SkillGapReportView } from './components/student/SkillGapReportView';
import { LearningPathwayView } from './components/student/LearningPathwayView';
import { SkillProfileView } from './components/student/SkillProfileView';
import { OpportunitiesView } from './components/student/OpportunitiesView';
import { AIMentorChatView } from './components/student/AIMentorChatView';
import { SkillAssessmentModal } from './components/student/SkillAssessmentModal';
import { OnboardingWizard } from './components/student/OnboardingWizard';
import { InstitutionDashboard } from './components/institution/InstitutionDashboard';
import { MentorPortal } from './components/mentor/MentorPortal';
import { AdminCalibrationView } from './components/admin/AdminCalibrationView';

const MainContent: React.FC = () => {
  const { isAuthenticated, role, activeView } = useApp();

  // If user is not logged in, start on Login Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Render role-specific or student view
  const renderView = () => {
    if (role === 'institution') return <InstitutionDashboard />;
    if (role === 'mentor') return <MentorPortal />;
    if (role === 'admin') return <AdminCalibrationView />;

    // Student Views
    switch (activeView) {
      case 'ladder':
        return <CareerLadderView />;
      case 'matches':
        return <CareerMatchesView />;
      case 'gaps':
        return <SkillGapReportView />;
      case 'pathway':
        return <LearningPathwayView />;
      case 'profile':
        return <SkillProfileView />;
      case 'opportunities':
        return <OpportunitiesView />;
      case 'chat':
        return <AIMentorChatView />;
      case 'home':
      default:
        return <StudentHome />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
      <TopNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-20 md:pb-12">
        {renderView()}
      </main>

      <BottomNav />

      {/* Global Modals */}
      <VoiceAssistantModal />
      <SkillAssessmentModal />
      <OnboardingWizard />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
