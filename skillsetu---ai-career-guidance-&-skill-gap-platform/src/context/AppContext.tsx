import React, { createContext, useContext, useEffect, useState } from 'react';
import { CAREER_ROLES } from '../data/rolesData';
import { DEMO_PERSONAS, INITIAL_NEW_STUDENT } from '../data/seedProfiles';
import { TRANSLATIONS } from '../locales/translations';
import { buildLearningPathway } from '../services/pathwayBuilder';
import { calculateRoleGaps, DEFAULT_SCORING_WEIGHTS } from '../services/recommendationEngine';
import {
  CareerRole,
  Language,
  LearningPathway,
  ScoringWeights,
  StudentProfile,
  UserRole,
  UserSkill,
} from '../types';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  targetRole: CareerRole;
  setTargetRoleId: (roleId: string) => void;
  pathway: LearningPathway;
  scoringWeights: ScoringWeights;
  setScoringWeights: React.Dispatch<React.SetStateAction<ScoringWeights>>;
  updateUserSkill: (
    skillId: string,
    level: number,
    verified: boolean,
    source: 'quiz' | 'self' | 'resume' | 'course'
  ) => void;
  markPathwayItemComplete: (itemId: string) => void;
  applyOpportunity: (oppId: string) => void;
  switchDemoPersona: (personaKey: 'riya' | 'amit' | 'sneha' | 'new') => void;
  activePersonaKey: string;
  t: (key: string) => string;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isAssessmentOpen: boolean;
  setIsAssessmentOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  login: (personaKey?: 'riya' | 'amit' | 'sneha' | 'new', targetRole?: UserRole) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>('student');
  const [language, setLanguage] = useState<Language>('hi'); // Default to Hindi as highlighted in blueprint demo
  const [activeView, setActiveView] = useState<string>('home');
  const [activePersonaKey, setActivePersonaKey] = useState<string>('riya');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState<boolean>(false);

  // Initialize profile with Riya (the prime demo persona from blueprint Section 17.1)
  const [profile, setProfile] = useState<StudentProfile>(() => {
    return DEMO_PERSONAS.riya;
  });

  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>(DEFAULT_SCORING_WEIGHTS);

  // Target role resolution
  const targetRole =
    CAREER_ROLES.find((r) => r.id === profile.targetRoleId) ||
    CAREER_ROLES.find((r) => r.id === 'maintenance_technician') ||
    CAREER_ROLES[0];

  // Learning pathway state
  const [pathway, setPathway] = useState<LearningPathway>(() => {
    return buildLearningPathway(profile.targetRoleId || 'maintenance_technician', profile.skills, profile.weeklyHours);
  });

  // Rebuild pathway when target role or weekly hours change
  const setTargetRoleId = (roleId: string) => {
    setProfile((prev) => ({
      ...prev,
      targetRoleId: roleId,
    }));
    const newPath = buildLearningPathway(roleId, profile.skills, profile.weeklyHours);
    setPathway(newPath);
  };

  const updateUserSkill = (
    skillId: string,
    level: number,
    verified: boolean,
    source: 'quiz' | 'self' | 'resume' | 'course'
  ) => {
    setProfile((prev) => {
      const existing = prev.skills[skillId];
      const updatedSkill: UserSkill = {
        skillId,
        skillName: existing ? existing.skillName : skillId,
        cluster: existing ? existing.cluster : 'core',
        level,
        source,
        verified,
        updatedAt: new Date().toISOString(),
      };

      const newSkills = {
        ...prev.skills,
        [skillId]: updatedSkill,
      };

      return {
        ...prev,
        skills: newSkills,
      };
    });
  };

  // Recalculate pathway progress and student readiness when an item is marked done
  const markPathwayItemComplete = (itemId: string) => {
    setPathway((prev) => {
      let itemSkillId = '';
      let itemTargetLevel = 0;

      const newWeeks = prev.weeks.map((week) => {
        const newItems = week.items.map((item) => {
          if (item.id === itemId) {
            itemSkillId = item.skillId;
            itemTargetLevel = item.levelTarget;
            return { ...item, status: 'done' as const };
          }
          return item;
        });
        return { ...week, items: newItems };
      });

      // Unlock next item
      let foundNext = false;
      for (const w of newWeeks) {
        for (const it of w.items) {
          if (it.status === 'locked' && !foundNext) {
            it.status = 'active';
            foundNext = true;
          }
        }
      }

      // If the item has a skill and target level, level up the student's skill!
      if (itemSkillId && itemTargetLevel > 0) {
        const curLevel = profile.skills[itemSkillId]?.level || 0;
        const newLevel = Math.max(curLevel, itemTargetLevel);
        updateUserSkill(itemSkillId, newLevel, true, 'course');
      }

      const allItems = newWeeks.flatMap((w) => w.items);
      const completed = allItems.filter((i) => i.status === 'done').length;

      // Recalculate readiness
      const gapRes = calculateRoleGaps(targetRole, profile.skills);

      return {
        ...prev,
        weeks: newWeeks,
        completedItemCount: completed,
        readinessCurrent: gapRes.readiness,
      };
    });
  };

  const applyOpportunity = (oppId: string) => {
    setProfile((prev) => {
      if (prev.appliedOpportunityIds.includes(oppId)) return prev;
      return {
        ...prev,
        appliedOpportunityIds: [...prev.appliedOpportunityIds, oppId],
      };
    });
  };

  const switchDemoPersona = (personaKey: 'riya' | 'amit' | 'sneha' | 'new') => {
    setActivePersonaKey(personaKey);
    let newProf: StudentProfile;

    if (personaKey === 'riya') {
      newProf = DEMO_PERSONAS.riya;
      setLanguage('hi');
    } else if (personaKey === 'amit') {
      newProf = DEMO_PERSONAS.amit;
      setLanguage('en');
    } else if (personaKey === 'sneha') {
      newProf = DEMO_PERSONAS.sneha;
      setLanguage('mr');
    } else {
      newProf = { ...INITIAL_NEW_STUDENT, id: `learner_${Date.now()}` };
      setLanguage('en');
      setIsOnboardingOpen(true);
    }

    setProfile(newProf);
    const target = newProf.targetRoleId || 'electrician_general';
    setPathway(buildLearningPathway(target, newProf.skills, newProf.weeklyHours));
    setActiveView('home');
  };

  const login = (personaKey?: 'riya' | 'amit' | 'sneha' | 'new', targetRole?: UserRole) => {
    if (personaKey) {
      switchDemoPersona(personaKey);
    }
    if (targetRole) {
      setRole(targetRole);
      if (targetRole === 'institution') setActiveView('institution');
      else if (targetRole === 'mentor') setActiveView('mentor');
      else if (targetRole === 'admin') setActiveView('admin');
      else setActiveView('home');
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        role,
        setRole,
        language,
        setLanguage,
        activeView,
        setActiveView,
        profile,
        setProfile,
        targetRole,
        setTargetRoleId,
        pathway,
        scoringWeights,
        setScoringWeights,
        updateUserSkill,
        markPathwayItemComplete,
        applyOpportunity,
        switchDemoPersona,
        activePersonaKey,
        t,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isAssessmentOpen,
        setIsAssessmentOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
