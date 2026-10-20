import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Columns2,
  Sparkles,
  Info,
  X,
  Award,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCareerRecommendations } from '../../services/recommendationEngine';
import { CAREER_ROLES } from '../../data/rolesData';
import { CareerRecommendation, CareerRole } from '../../types';

export const CareerMatchesView: React.FC = () => {
  const {
    profile,
    targetRole,
    setTargetRoleId,
    setActiveView,
    scoringWeights,
    language,
    t,
  } = useApp();

  const recommendations = getCareerRecommendations(profile, scoringWeights, 10);

  // Compare mode state: two role IDs
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareRoleAId, setCompareRoleAId] = useState<string>(targetRole.id);
  const [compareRoleBId, setCompareRoleBId] = useState<string>(
    recommendations[1]?.role.id || recommendations[0]?.role.id
  );

  // "Why Not" inspection modal state
  const [inspectedRec, setInspectedRec] = useState<CareerRecommendation | null>(null);

  const roleA = CAREER_ROLES.find((r) => r.id === compareRoleAId) || CAREER_ROLES[0];
  const roleB = CAREER_ROLES.find((r) => r.id === compareRoleBId) || CAREER_ROLES[1] || CAREER_ROLES[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Clean Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Career Recommendations for {profile.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Calculated using transparent scoring: 60% Skill Coverage + 25% Stated Interest + 15% Market Demand.
            </p>
          </div>

          <button
            onClick={() => setIsCompareOpen(!isCompareOpen)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-[#1F4E79] hover:bg-blue-50 text-slate-800 font-bold text-xs flex items-center gap-2 transition-colors self-start md:self-center"
          >
            <Columns2 className="w-4 h-4 text-[#F28C28]" />
            <span>{isCompareOpen ? 'Hide Comparison' : 'Compare 2 Roles'}</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Drawer/Box if active */}
      {isCompareOpen && (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl p-6 border border-blue-200 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-200/60">
            <h3 className="font-extrabold text-base text-[#1F4E79] flex items-center gap-2">
              <Columns2 className="w-4 h-4" />
              <span>Side-by-Side Role Comparison</span>
            </h3>
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column A */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400">
                  Select Role A:
                </label>
                <select
                  value={compareRoleAId}
                  onChange={(e) => setCompareRoleAId(e.target.value)}
                  className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg bg-slate-50"
                >
                  {CAREER_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} (NSQF {r.nsqfLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">NSQF Level:</span>
                  <span className="font-bold text-slate-800">Level {roleA.nsqfLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NCO Code:</span>
                  <span className="font-semibold text-slate-700">{roleA.ncoCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Salary Band:</span>
                  <span className="font-bold text-slate-800">{roleA.averageSalary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Market Demand:</span>
                  <span className="font-bold text-[#2E8B57]">{roleA.demandTrend} ({Math.round(roleA.demandScore * 100)}%)</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setTargetRoleId(roleA.id);
                      setIsCompareOpen(false);
                      setActiveView('gaps');
                    }}
                    className="w-full py-2 rounded-lg bg-[#1F4E79] text-white font-bold text-xs hover:bg-[#143552]"
                  >
                    Select Role A as My Target
                  </button>
                </div>
              </div>
            </div>

            {/* Column B */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400">
                  Select Role B:
                </label>
                <select
                  value={compareRoleBId}
                  onChange={(e) => setCompareRoleBId(e.target.value)}
                  className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg bg-slate-50"
                >
                  {CAREER_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} (NSQF {r.nsqfLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">NSQF Level:</span>
                  <span className="font-bold text-slate-800">Level {roleB.nsqfLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NCO Code:</span>
                  <span className="font-semibold text-slate-700">{roleB.ncoCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Salary Band:</span>
                  <span className="font-bold text-slate-800">{roleB.averageSalary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Market Demand:</span>
                  <span className="font-bold text-[#2E8B57]">{roleB.demandTrend} ({Math.round(roleB.demandScore * 100)}%)</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setTargetRoleId(roleB.id);
                      setIsCompareOpen(false);
                      setActiveView('gaps');
                    }}
                    className="w-full py-2 rounded-lg bg-[#1F4E79] text-white font-bold text-xs hover:bg-[#143552]"
                  >
                    Select Role B as My Target
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recommendations.map((rec, index) => {
          const isTarget = rec.role.id === targetRole.id;
          const title =
            language === 'hi' ? rec.role.titleHi : language === 'mr' ? rec.role.titleMr : rec.role.title;
          const reason =
            language === 'hi' ? rec.reasonHi : language === 'mr' ? rec.reasonMr : rec.reason;

          return (
            <div
              key={rec.role.id}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isTarget
                  ? 'border-[#1F4E79] bg-gradient-to-br from-blue-50/40 to-white shadow-md ring-2 ring-[#1F4E79]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Card Top: Rank & Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-100 text-[#1F4E79]">
                      NSQF {rec.role.nsqfLevel}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
                      NCO: {rec.role.ncoCode}
                    </span>
                  </div>

                  {/* Fit Score Pill */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm sm:text-base font-black text-[#1F4E79] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      {rec.fitScore}% Fit
                    </span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {rec.role.description}
                </p>

                {/* Plain-Language Reason (Section 1.2 Explainability requirement) */}
                <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Why this recommendation:
                  </span>
                  <p className="text-xs font-medium text-slate-700">
                    {reason}
                  </p>
                </div>

                {/* Score Breakdown Pills */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Skill Readiness</span>
                    <span className="font-bold text-slate-800">{rec.skillCoverage}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Interest Fit</span>
                    <span className="font-bold text-slate-800">{rec.interestFit}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Market Demand</span>
                    <span className="font-bold text-[#2E8B57]">{rec.marketDemand}%</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-700">
                  {rec.role.averageSalary}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInspectedRec(rec)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-[#1F4E79] text-slate-600 hover:text-[#1F4E79] font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#F28C28]" />
                    <span>Why not higher?</span>
                  </button>

                  {isTarget ? (
                    <button
                      onClick={() => setActiveView('gaps')}
                      className="px-3 py-1.5 rounded-lg bg-[#2E8B57] text-white font-bold text-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Current Target</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setTargetRoleId(rec.role.id);
                        setActiveView('gaps');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs flex items-center gap-1 transition-all"
                    >
                      <span>Set as Target</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* "Why Not" Modal (Section 2.2 of blueprint) */}
      {inspectedRec && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setInspectedRec(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#F28C28] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Signature Feature 2: Explain-and-Challenge</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Why isn't {inspectedRec.role.title} higher?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Your overall fit score is <strong>{inspectedRec.fitScore}%</strong>. Here is the mathematical breakdown
              of points and the top skills that lowered your score.
            </p>

            <div className="my-4 space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-extrabold text-slate-700 block uppercase text-[10px]">
                  Points Formula Contribution:
                </span>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Skill Readiness ({inspectedRec.skillCoverage}% × 0.60):</span>
                    <span className="font-bold text-slate-800">
                      +{Math.round(inspectedRec.skillCoverage * 0.6)} pts
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Interest Alignment ({inspectedRec.interestFit}% × 0.25):</span>
                    <span className="font-bold text-slate-800">
                      +{Math.round(inspectedRec.interestFit * 0.25)} pts
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Market Demand ({inspectedRec.marketDemand}% × 0.15):</span>
                    <span className="font-bold text-slate-800">
                      +{Math.round(inspectedRec.marketDemand * 0.15)} pts
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  Top Skills Lowering Your Score:
                </span>
                {inspectedRec.penaltySkills.map((p) => (
                  <div
                    key={p.skillId}
                    className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block">{p.skillName}</span>
                      <span className="text-slate-500 text-[11px]">
                        Currently at Level {p.currentLevel} (Requires Level {p.requiredLevel})
                      </span>
                    </div>
                    <span className="font-extrabold text-rose-600 bg-white px-2 py-1 rounded border border-rose-200">
                      -{p.pointsLost} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setInspectedRec(null)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setTargetRoleId(inspectedRec.role.id);
                  setInspectedRec(null);
                  setActiveView('gaps');
                }}
                className="px-4 py-2 rounded-xl bg-[#1F4E79] text-white text-xs font-bold hover:bg-[#143552] flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>Simulate Skill Improvement in What-If</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
