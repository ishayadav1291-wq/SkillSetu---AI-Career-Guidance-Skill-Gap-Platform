import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Flag,
  RotateCcw,
  Clock,
  Send,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../ui/CircularProgress';
import { calculateRoleGaps, simulateWhatIf } from '../../services/recommendationEngine';
import { CAREER_ROLES } from '../../data/rolesData';

export const SkillGapReportView: React.FC = () => {
  const {
    profile,
    targetRole,
    setTargetRoleId,
    setActiveView,
    scoringWeights,
    language,
    t,
  } = useApp();

  const { readiness, gaps, haveCount, partialCount, missingCount } = calculateRoleGaps(
    targetRole,
    profile.skills
  );

  // What-If simulated levels state
  const [simulatedLevels, setSimulatedLevels] = useState<Record<string, number>>({});
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState<boolean>(false);
  const [challengeReason, setChallengeReason] = useState<string>('');
  const [challengeSubmitted, setChallengeSubmitted] = useState<boolean>(false);

  // Compute live What-If simulation
  const simulation = simulateWhatIf(
    targetRole,
    profile.skills,
    simulatedLevels,
    profile.interests,
    scoringWeights
  );

  const handleSliderChange = (skillId: string, val: number) => {
    setSimulatedLevels((prev) => ({
      ...prev,
      [skillId]: val,
    }));
  };

  const handleResetSliders = () => {
    setSimulatedLevels({});
  };

  const targetTitle =
    language === 'hi' ? targetRole.titleHi : language === 'mr' ? targetRole.titleMr : targetRole.title;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Clean Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Skill-Gap Diagnostics: {targetTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Deterministic, explainable gap engine showing exact required levels, current levels, and learning time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChallengeModalOpen(true)}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('challengeResult')}</span>
            </button>
            <button
              onClick={() => setActiveView('pathway')}
              className="px-4 py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Build My Pathway</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Skill Gap Breakdown Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Ranked Skills Required for {targetTitle}
              </h3>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1 text-[#2E8B57]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2E8B57]" /> Have ({haveCount})
                </span>
                <span className="flex items-center gap-1 text-[#F28C28]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F28C28]" /> Partial ({partialCount})
                </span>
                <span className="flex items-center gap-1 text-[#C0392B]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C0392B]" /> Missing ({missingCount})
                </span>
              </div>
            </div>

            {/* List of Ranked Gaps */}
            <div className="space-y-4">
              {gaps.map((gap, index) => {
                const current = simulatedLevels[gap.skillId] ?? gap.currentLevel;
                const isHave = current >= gap.requiredLevel;
                const isPartial = current > 0 && current < gap.requiredLevel;

                let statusBadgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
                let statusLabel = 'Missing (Priority)';
                let barColor = 'bg-[#C0392B]';

                if (isHave) {
                  statusBadgeColor = 'bg-emerald-50 text-[#2E8B57] border-emerald-200';
                  statusLabel = 'Mastered / Have';
                  barColor = 'bg-[#2E8B57]';
                } else if (isPartial) {
                  statusBadgeColor = 'bg-amber-50 text-[#F28C28] border-orange-200';
                  statusLabel = 'Partial (Upgrade)';
                  barColor = 'bg-[#F28C28]';
                }

                return (
                  <div
                    key={gap.skillId}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-black flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">
                          {gap.skillName}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadgeColor}`}>
                          {statusLabel}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          Weight: {Math.round(gap.importance * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar (Current vs Required Level) */}
                    <div className="space-y-1.5 my-3">
                      <div className="flex justify-between text-xs text-slate-600 font-medium">
                        <span>Current Level: <strong className="text-slate-800">L{current}</strong> of 5</span>
                        <span>Required Level: <strong className="text-[#1F4E79]">L{gap.requiredLevel}</strong> of 5</span>
                      </div>

                      <div className="relative h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                        {/* Target marker indicator */}
                        <div
                          className="absolute top-0 bottom-0 border-r-2 border-[#1F4E79] z-10 opacity-70"
                          style={{ left: `${(gap.requiredLevel / 5) * 100}%` }}
                        />
                        {/* Current level bar */}
                        <div
                          className={`h-full ${barColor} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(100, (current / 5) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer microcopy and action */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {isHave
                            ? 'Ready for role benchmark'
                            : `~${gap.hoursNeeded} hours focused learning needed`}
                        </span>
                      </span>

                      {!isHave && (
                        <button
                          onClick={() => {
                            handleSliderChange(gap.skillId, gap.requiredLevel);
                          }}
                          className="text-xs font-bold text-[#1F4E79] hover:underline"
                        >
                          Simulate Mastery →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live What-If Simulator Sandbox & Readiness Ring */}
        <div className="lg:col-span-5 space-y-4">
          {/* Radial Readiness & Live Impact Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 text-center">
            <h3 className="font-extrabold text-sm text-slate-900 text-left pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Overall Role Readiness</span>
              {simulation.readinessDelta > 0 && (
                <span className="text-xs font-extrabold text-[#2E8B57] bg-emerald-50 px-2 py-0.5 rounded-full">
                  +{simulation.readinessDelta}% simulated boost
                </span>
              )}
            </h3>

            <div className="py-2 flex items-center justify-center">
              <CircularProgress
                value={simulation.newReadiness}
                size={155}
                strokeWidth={13}
                label="Simulated"
                subLabel={`Base: ${readiness}%`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-left bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Current Match Fit
                </span>
                <span className="text-base font-extrabold text-slate-800">
                  {simulation.originalFit}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Simulated Match Fit
                </span>
                <span className="text-base font-extrabold text-[#1F4E79]">
                  {simulation.newFit}%
                </span>
              </div>
            </div>
          </div>

          {/* Signature Feature 2: What-If Interactive Slider Sandbox */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 sticky top-[150px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#F28C28]" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  {t('whatIfTitle')}
                </h3>
              </div>
              {Object.keys(simulatedLevels).length > 0 && (
                <button
                  onClick={handleResetSliders}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500">
              {t('whatIfSub')}
            </p>

            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {gaps.map((gap) => {
                const currentSim = simulatedLevels[gap.skillId] ?? gap.currentLevel;

                return (
                  <div key={gap.skillId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                        {gap.skillName}
                      </span>
                      <span className="font-extrabold text-[#1F4E79]">
                        Level {currentSim} / 5
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={currentSim}
                      onChange={(e) =>
                        handleSliderChange(gap.skillId, parseInt(e.target.value, 10))
                      }
                      className="w-full accent-[#F28C28] cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>L0 None</span>
                      <span>L2 Basic</span>
                      <span>L4 Strong</span>
                      <span>L5 Expert</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setActiveView('pathway')}
              className="w-full py-2.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Apply to Pathway & Start Week 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Challenge Match Modal */}
      {isChallengeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900">
              Challenge Recommendation
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Students and institutions can flag any recommendation that seems inaccurate. Your challenge
              is fed into our scoring calibration engine (Section 6.8).
            </p>

            {challengeSubmitted ? (
              <div className="my-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#2E8B57] mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">Challenge Logged Successfully</h4>
                <p className="text-xs text-slate-500">
                  Thank you! Your feedback has been recorded in the admin weight calibration queue.
                </p>
                <button
                  onClick={() => {
                    setIsChallengeModalOpen(false);
                    setChallengeSubmitted(false);
                    setChallengeReason('');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1F4E79] text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4 my-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Why do you believe this match needs adjustment?
                  </label>
                  <textarea
                    rows={4}
                    value={challengeReason}
                    onChange={(e) => setChallengeReason(e.target.value)}
                    placeholder="e.g., I already completed hands-on PLC laboratory training in my diploma 3rd semester, so my level should be higher than estimated."
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-[#1F4E79] focus:outline-hidden"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsChallengeModalOpen(false)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!challengeReason.trim()}
                    onClick={() => setChallengeSubmitted(true)}
                    className="px-4 py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit to Admin Review</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
