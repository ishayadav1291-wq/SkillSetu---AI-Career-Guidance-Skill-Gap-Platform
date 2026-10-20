import React from 'react';
import {
  ShieldCheck,
  Award,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RadarChart, RadarPoint } from '../ui/RadarChart';
import { SKILLS_TAXONOMY } from '../../data/skillsData';

export const SkillProfileView: React.FC = () => {
  const { profile, targetRole, setIsAssessmentOpen, setActiveView } = useApp();

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

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#1F4E79] text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E8B57]" />
              <span>Skill Profile & Verification Radar</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {profile.name}'s Verified Competency Vector
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              All measured competencies are calibrated from Level 0 to 5. Badges denote faculty-reviewed
              quiz tests versus self-declared estimates.
            </p>
          </div>

          <button
            onClick={() => setIsAssessmentOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs transition-colors flex items-center gap-1.5 self-start md:self-center shadow-xs"
          >
            <Award className="w-4 h-4 text-[#F28C28]" />
            <span>Verify Skills with Quiz</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
            <span className="text-xs font-semibold text-slate-500">
              {Object.keys(profile.skills).length} Active Skills
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
                          <span>Quiz Verified</span>
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
                    <button
                      onClick={() => setIsAssessmentOpen(true)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-[#1F4E79] text-[#1F4E79] font-bold text-[11px] hover:bg-blue-50"
                    >
                      Verify
                    </button>
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
    </div>
  );
};
