import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Lock,
  FileCheck,
  History,
  MessageSquare,
  QrCode,
  RotateCcw,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RadarChart, RadarPoint } from '../ui/RadarChart';
import { SKILLS_TAXONOMY } from '../../data/skillsData';

export const SkillProfileView: React.FC = () => {
  const {
    profile,
    targetRole,
    setIsAssessmentOpen,
    setIsDigiLockerModalOpen,
    setActiveView,
    assessmentHistory,
    digilockerCertificates,
    mentorFeedbacks,
    resetAppState,
    lastStorageSync,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'digilocker' | 'history' | 'mentor'>('inventory');

  // Prepare radar points for the top skills in student's profile & target role
  const targetReqMap = new Map<string, number>();
  targetRole.requiredSkills.forEach((r) => {
    targetReqMap.set(r.skillId, r.requiredLevel);
  });

  // Pick up to 6-8 relevant skills
  const radarData: RadarPoint[] = targetRole.requiredSkills.slice(0, 6).map((req) => {
    const userSkill = profile.skills[req.skillId];
    const skillDef = SKILLS_TAXONOMY.find((s) => s.id === req.skillId);

    return {
      axis: skillDef ? skillDef.name.split('&')[0].trim() : req.skillId,
      value: userSkill ? userSkill.level : 0,
      target: req.requiredLevel,
      verified: userSkill ? userSkill.verified : false,
    };
  });

  const verifiedSkillsCount = Object.values(profile.skills).filter((s) => s.verified).length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#1F4E79] text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E8B57]" />
                <span>Skill Profile & Verification Radar</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#2E8B57] text-[11px] font-bold">
                <Clock className="w-3 h-3" />
                <span>Synced: {new Date(lastStorageSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {profile.name}'s Verified Competency Vector
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Calibrated from Level 0 to 5. Badges denote DigiLocker trade certificates, faculty-reviewed quiz
              tests, and industry mentor endorsements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            {/* DigiLocker Button */}
            <button
              onClick={() => setIsDigiLockerModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-[#1F4E79] hover:from-blue-800 hover:to-[#143552] text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>DigiLocker / SID Import</span>
            </button>

            {/* Quiz Button */}
            <button
              onClick={() => setIsAssessmentOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Award className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Verify Skills with Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Profile Deep-Dive */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-[#1F4E79] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Competency Vector ({Object.keys(profile.skills).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('digilocker')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'digilocker'
              ? 'bg-[#1F4E79] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>DigiLocker Credentials ({digilockerCertificates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-[#1F4E79] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Assessment History ({assessmentHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mentor')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'mentor'
              ? 'bg-[#1F4E79] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Mentor Endorsements ({mentorFeedbacks.length})</span>
        </button>
      </div>

      {/* Tab 1: Competency Vector & Radar */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          {/* Left Column: Accessible Radar Chart */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-sm text-slate-900">
                Competency Radar vs {targetRole.title}
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Scale 0 - 5 Levels
              </span>
            </div>

            <div className="py-4 w-full flex justify-center">
              <RadarChart data={radarData} size={310} />
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-slate-600 mt-2 text-center w-full">
              Dashed orange border shows the target requirement for <strong>{targetRole.title}</strong>.
              Blue polygon shows your current skill coverage.
            </div>
          </div>

          {/* Right Column: Detailed Skill Badges List */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">
                Measured Skill Inventory
              </h3>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {verifiedSkillsCount} of {Object.keys(profile.skills).length} Verified
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {Object.values(profile.skills).map((skill) => {
                const req = targetRole.requiredSkills.find((r) => r.skillId === skill.skillId);

                return (
                  <div
                    key={skill.skillId}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">{skill.skillName}</h4>
                        {skill.verified ? (
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-[#2E8B57] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-200 text-slate-600">
                            {skill.source === 'resume' ? 'Resume Extracted' : 'Self-Declared'}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Current: <strong>Level {skill.level} / 5</strong>
                        {req && (
                          <span> • Target for {targetRole.title}: Level {req.requiredLevel}</span>
                        )}
                      </div>
                    </div>

                    {!skill.verified && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setIsAssessmentOpen(true)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-[#1F4E79] text-[#1F4E79] font-bold text-[11px] hover:bg-blue-50"
                        >
                          Quiz
                        </button>
                        <button
                          onClick={() => setIsDigiLockerModalOpen(true)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1F4E79] font-bold text-[11px]"
                        >
                          Doc
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setActiveView('gaps')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Full Skill-Gap Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: DigiLocker & Skill India Credentials */}
      {activeTab === 'digilocker' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Government Verified DigiLocker & Skill India Credentials
              </h3>
              <p className="text-xs text-slate-500">
                Official certificates cryptographic records directly synchronized into your persistent profile.
              </p>
            </div>
            <button
              onClick={() => setIsDigiLockerModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Import New Certificate</span>
            </button>
          </div>

          {digilockerCertificates.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
              <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">No DigiLocker Documents Imported Yet</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Connect your ITI NCVT Trade Certificate, Polytechnic Marksheet, or PMKVY Skill India Digital badge
                to immediately verify multiple skills at once.
              </p>
              <button
                onClick={() => setIsDigiLockerModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#1F4E79] text-white font-bold text-xs inline-flex items-center gap-1.5"
              >
                <span>Browse DigiLocker Repository</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {digilockerCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-gradient-to-b from-blue-50/40 to-white space-y-3 relative overflow-hidden shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-[#2E8B57] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Credential
                      </span>
                      <h4 className="font-black text-sm text-slate-900">{cert.title}</h4>
                      <p className="text-xs text-slate-500">{cert.issuer}</p>
                    </div>
                    <QrCode className="w-8 h-8 text-slate-300 shrink-0" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] py-2 border-y border-slate-100">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Doc Number</span>
                      <span className="font-mono font-bold text-slate-700">{cert.docNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Issued</span>
                      <span className="font-semibold text-slate-700">{cert.issuanceDate}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Verified Competencies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.verifiedSkills.map((sk) => (
                        <span
                          key={sk.skillId}
                          className="px-2 py-0.5 rounded-lg bg-white border border-blue-100 text-slate-800 text-[11px] font-semibold flex items-center gap-1"
                        >
                          <span>{sk.skillName}</span>
                          <strong className="text-[#2E8B57]">Lvl {sk.verifiedLevel}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Assessment History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Assessment & Verification Audit Log
              </h3>
              <p className="text-xs text-slate-500">
                Full chronological ledger of quiz tests, DigiLocker credentials, and level advancements.
              </p>
            </div>
            <button
              onClick={() => setIsAssessmentOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1F4E79] text-white font-bold text-xs"
            >
              Take New Quiz
            </button>
          </div>

          {assessmentHistory.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No assessment logs recorded yet. Complete a quiz to log your first verified score.
            </div>
          ) : (
            <div className="space-y-2.5">
              {assessmentHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.skillName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.passed ? 'bg-emerald-100 text-[#2E8B57]' : 'bg-orange-100 text-[#F28C28]'
                        }`}
                      >
                        {item.source === 'digilocker'
                          ? 'DigiLocker Document'
                          : item.passed
                          ? 'Quiz Passed'
                          : 'Quiz Attempted'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Level: <strong>Level {item.previousLevel} → Level {item.newLevel}</strong> • Tested at:{' '}
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-slate-800">
                      Score: {item.score} / {item.totalQuestions}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Mentor Endorsements */}
      {activeTab === 'mentor' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">
              Industry Mentor Notes & Skill Endorsements
            </h3>
            <p className="text-xs text-slate-500">
              Direct recommendations and verified endorsements from plant supervisors and industry mentors.
            </p>
          </div>

          {mentorFeedbacks.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No mentor feedback logged yet.
            </div>
          ) : (
            <div className="space-y-3">
              {mentorFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 rounded-2xl border border-blue-100 bg-blue-50/30 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <strong className="text-slate-900 font-extrabold text-sm">{fb.mentorName}</strong>
                      <span className="text-slate-500 ml-2">
                        {fb.role} • {fb.company}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(fb.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-slate-700 italic bg-white p-3 rounded-xl border border-slate-200">
                    "{fb.notes}"
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Endorsed Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {fb.endorsedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded-md bg-emerald-100 text-[#2E8B57] text-[10px] font-bold"
                        >
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Persistence & Reset Utility Footer */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2E8B57]" />
          <span>
            <strong>Persistent Local Sync Active:</strong> All assessments, DigiLocker certificates, and profile changes persist across browser reloads.
          </span>
        </div>

        <button
          onClick={resetAppState}
          className="px-3 py-1.5 rounded-xl border border-slate-300 hover:border-red-400 hover:text-red-600 text-slate-600 text-[11px] font-bold transition-colors flex items-center gap-1.5"
          title="Reset to factory demo data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Demo Data</span>
        </button>
      </div>
    </div>
  );
};
