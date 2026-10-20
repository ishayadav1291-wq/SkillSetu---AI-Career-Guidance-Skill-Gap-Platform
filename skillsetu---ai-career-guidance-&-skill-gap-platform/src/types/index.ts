export type Language = 'en' | 'hi' | 'mr';

export type UserRole = 'student' | 'institution' | 'mentor' | 'admin';

export type EducationLevel = 'iti' | 'polytechnic_diploma' | 'degree_engineering' | 'degree_general' | 'vocational';

export interface UserSkill {
  skillId: string;
  skillName: string;
  cluster: string;
  level: number; // 0 to 5
  source: 'quiz' | 'self' | 'resume' | 'course';
  verified: boolean;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  educationLevel: EducationLevel;
  institutionName: string;
  branch: string;
  year: string;
  interests: string[];
  preferredLanguage: Language;
  weeklyHours: number;
  targetRoleId?: string;
  skills: Record<string, UserSkill>;
  completedAssessments: string[];
  appliedOpportunityIds: string[];
}

export interface SkillDefinition {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  cluster: 'electrical' | 'it_data' | 'manufacturing' | 'foundational';
  description: string;
  nsqfLevelEquivalent: number;
}

export interface RoleRequiredSkill {
  skillId: string;
  requiredLevel: number; // 1 to 5
  importance: number;    // 0.1 to 1.0
}

export interface CareerRole {
  id: string;
  title: string;
  titleHi: string;
  titleMr: string;
  stream: 'electrical' | 'it_data' | 'manufacturing';
  description: string;
  descriptionHi: string;
  descriptionMr: string;
  nsqfLevel: number;
  ncoCode: string;
  qpCode: string;
  demandScore: number; // 0 to 1
  averageSalary: string;
  demandTrend: 'Very High' | 'High' | 'Moderate';
  locationDemand: string;
  requiredSkills: RoleRequiredSkill[];
  steppingStoneFor?: string; // target role id if this is an intermediate stepping stone
}

export interface LadderRung {
  roleId: string;
  title: string;
  titleHi: string;
  titleMr: string;
  nsqfLevel: number;
  ncoCode: string;
  order: number;
  typicalExperience: string;
  salaryBand: string;
  keySkills: string[];
  bridgeSkillsNote: string;
  bridgeSkillsNoteHi: string;
  bridgeSkillsNoteMr: string;
  estimatedWeeksAt6Hrs: number;
}

export interface CareerLadder {
  streamId: 'electrical' | 'it_data' | 'manufacturing';
  streamName: string;
  streamNameHi: string;
  streamNameMr: string;
  description: string;
  rungs: LadderRung[];
}

export interface CareerRecommendation {
  role: CareerRole;
  fitScore: number;        // 0 to 100
  skillCoverage: number;   // 0 to 100 (readiness)
  interestFit: number;     // 0 to 100
  marketDemand: number;    // 0 to 100
  reason: string;
  reasonHi: string;
  reasonMr: string;
  penaltySkills: {
    skillId: string;
    skillName: string;
    requiredLevel: number;
    currentLevel: number;
    pointsLost: number;
  }[];
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  requiredLevel: number;
  currentLevel: number;
  importance: number;
  weightedGap: number;
  status: 'have' | 'partial' | 'missing';
  hoursNeeded: number;
}

export interface PathwayItem {
  id: string;
  title: string;
  provider: 'SWAYAM' | 'NPTEL' | 'Skill India' | 'Coursera' | 'Project' | 'Mini-Quiz';
  url?: string;
  durationHours: number;
  skillId: string;
  skillName: string;
  levelTarget: number;
  status: 'locked' | 'active' | 'done';
  type: 'course' | 'project' | 'quiz';
  quizQuestionIds?: string[];
}

export interface PathwayWeek {
  weekNumber: number;
  theme: string;
  items: PathwayItem[];
}

export interface LearningPathway {
  id: string;
  roleId: string;
  roleTitle: string;
  hoursPerWeek: number;
  targetWeeks: number;
  weeks: PathwayWeek[];
  readinessBefore: number;
  readinessCurrent: number;
  completedItemCount: number;
  totalItemCount: number;
}

export interface QuizQuestion {
  id: string;
  skillId: string;
  skillName: string;
  cluster: string;
  question: string;
  questionHi?: string;
  questionMr?: string;
  options: string[];
  optionsHi?: string[];
  optionsMr?: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

export interface OpportunityListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Internship' | 'NAPS Apprenticeship' | 'Full-Time Job';
  stipendOrSalary: string;
  matchingSkills: string[];
  allRequiredSkills: string[];
  postedBy: string;
  source: 'NAPS' | 'NCS' | 'Industry Partner';
  applied?: boolean;
}

export interface ScoringWeights {
  wSkill: number;      // default 0.60
  wInterest: number;   // default 0.25
  wDemand: number;     // default 0.15
  steppingStoneThreshold: number; // default 50%
}
