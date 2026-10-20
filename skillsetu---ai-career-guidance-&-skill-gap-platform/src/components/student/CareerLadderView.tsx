import React, { useState } from 'react';
import {
  GitFork,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  Sliders,
  ChevronRight,
  TrendingUp,
  Layers,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CAREER_LADDERS } from '../../data/careerLaddersData';
import { CAREER_ROLES } from '../../data/rolesData';
import { calculateRoleGaps, simulateWhatIf } from '../../services/recommendationEngine';
import { CareerRole, LadderRung } from '../../types';

export const CareerLadderView: React.FC = () => {
  const {
    profile,
    targetRole,
    setTargetRoleId,
    setActiveView,
    language,
    t,
    scoringWeights,
  } = useApp();

  // Find active stream or default to current target role stream
  const [selectedStreamId, setSelectedStreamId] = useState<'electrical' | 'it_data' | 'manufacturing'>(
    targetRole.stream || 'electrical'
  );

  const activeLadder =
    CAREER_LADDERS.find((l) => l.streamId === selectedStreamId) || CAREER_LADDERS[0];

  // Selected rung for inspection modal/drawer
  const [selectedRung, setSelectedRung] = useState<LadderRung | null>(null);

  // Why-not inspection modal state
  const [whyNotRungRole, setWhyNotRungRole] = useState<CareerRole | null>(null);

  // What-if simulated slider for Why-Not modal
  const [sliderVal, setSliderVal] = useState<number>(3);

  const ladderTitle =
    language === 'hi'
      ? activeLadder.streamNameHi
      : language === 'mr'
      ? activeLadder.streamNameMr
      : activeLadder.streamName;

  const handleOpenWhyNot = (roleId: string) => {
    const role = CAREER_ROLES.find((r) => r.id === roleId);
    if (role) {
      setWhyNotRungRole(role);
      // set slider default to 3
      setSliderVal(3);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Clean Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('careerLadderTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              {t('careerLadderSub')}
            </p>
          </div>

          {/* Stream Switcher Tabs */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            {CAREER_LADDERS.map((lad) => (
              <button
                key={lad.streamId}
                onClick={() => setSelectedStreamId(lad.streamId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedStreamId === lad.streamId
                    ? 'bg-[#1F4E79] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lad.streamId === 'electrical'
                  ? 'Electrical'
                  : lad.streamId === 'it_data'
                  ? 'IT & Data'
                  : 'Manufacturing'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Ladder Layout (Replicating Blueprint Figure 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Vertical Ladder of Rungs */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{ladderTitle}</h3>
                <span className="text-xs text-slate-500">
                  Calculated at {profile.weeklyHours} study hours / week
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#2E8B57] border border-emerald-200">
                NSQF Levels 4 → 7
              </span>
            </div>

            {/* Vertical Ladder Rungs (Reversed so highest rung is at top) */}
            <div className="space-y-6 relative">
              {/* Connecting vertical line */}
              <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-[#1F4E79] via-blue-200 to-slate-200 -z-0" />

              {[...activeLadder.rungs].reverse().map((rung, index) => {
                const isTarget = rung.roleId === targetRole.id;
                const rungRole = CAREER_ROLES.find((r) => r.id === rung.roleId);
                const { readiness, gaps } = rungRole
                  ? calculateRoleGaps(rungRole, profile.skills)
                  : { readiness: 0, gaps: [] };

                const isCurrentPosition = rung.order === 1; // Lowest/baseline position
                const isNextRung = rung.order === 2;

                const rungTitle =
                  language === 'hi' ? rung.titleHi : language === 'mr' ? rung.titleMr : rung.title;
                const bridgeNote =
                  language === 'hi'
                    ? rung.bridgeSkillsNoteHi
                    : language === 'mr'
                    ? rung.bridgeSkillsNoteMr
                    : rung.bridgeSkillsNote;

                return (
                  <div
                    key={rung.roleId}
                    className={`relative z-10 pl-14 sm:pl-16 transition-all ${
                      isTarget ? 'scale-[1.01]' : ''
                    }`}
                  >
                    {/* Circle Node on Vertical Line */}
                    <div
                      className={`absolute left-3.5 top-5 w-6 h-6 rounded-full border-4 flex items-center justify-center transition-all ${
                        isTarget
                          ? 'bg-[#F28C28] border-white ring-4 ring-orange-200 shadow-md'
                          : readiness >= 70
                          ? 'bg-[#2E8B57] border-white ring-2 ring-emerald-200'
                          : 'bg-white border-[#1F4E79] ring-2 ring-blue-100'
                      }`}
                    >
                      {readiness >= 70 && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>

                    {/* Rung Box Card */}
                    <div
                      className={`rounded-2xl p-5 border transition-all ${
                        isTarget
                          ? 'border-[#1F4E79] bg-gradient-to-r from-blue-50/50 to-white shadow-md ring-2 ring-[#1F4E79]/15'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#1F4E79] text-white">
                            NSQF Level {rung.nsqfLevel}
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            NCO: {rung.ncoCode}
                          </span>
                          {isCurrentPosition && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#2E8B57]">
                              {t('youAreHere')}
                            </span>
                          )}
                          {isNextRung && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-[#F28C28]">
                              {t('nextRung')}
                            </span>
                          )}
                        </div>

                        {/* Readiness & Fit score */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700">
                            Readiness: <strong className="text-[#1F4E79]">{readiness}%</strong>
                          </span>
                        </div>
                      </div>

                      <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                        {rungTitle}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        {bridgeNote}
                      </p>

                      {/* Bridge Skills Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        <span className="text-[11px] font-bold text-slate-400 mr-1">
                          Key Skills:
                        </span>
                        {rung.keySkills.map((sk, sidx) => (
                          <span
                            key={sidx}
                            className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>

                      {/* Time to reach & Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 text-slate-500">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-[#F28C28]" />
                            <span>~{rung.estimatedWeeksAt6Hrs} Weeks at {profile.weeklyHours}h/wk</span>
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline font-medium text-slate-600">
                            {rung.salaryBand}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenWhyNot(rung.roleId)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-[#1F4E79] hover:bg-blue-50 text-slate-700 hover:text-[#1F4E79] font-bold text-xs transition-colors flex items-center gap-1"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-[#F28C28]" />
                            <span>Why / What-If?</span>
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
                                setTargetRoleId(rung.roleId);
                                setActiveView('gaps');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs flex items-center gap-1 transition-all"
                            >
                              <span>Set as Target</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Why-Not & What-If Panel (Replicating Blueprint Figure 1) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 sticky top-[150px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#F28C28]" />
                <h3 className="font-bold text-sm text-slate-900">
                  {whyNotRungRole ? `Inspecting: ${whyNotRungRole.title}` : 'Explain-and-Challenge'}
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-[#F28C28] px-2 py-0.5 rounded-full">
                Live Formula
              </span>
            </div>

            {whyNotRungRole ? (
              (() => {
                const { readiness, gaps } = calculateRoleGaps(whyNotRungRole, profile.skills);
                // Top lowering skill
                const topPenalty = gaps.find((g) => g.status !== 'have') || gaps[0];
                const simulatedLevels = topPenalty ? { [topPenalty.skillId]: sliderVal } : {};
                const simulation = simulateWhatIf(
                  whyNotRungRole,
                  profile.skills,
                  simulatedLevels,
                  profile.interests,
                  scoringWeights
                );

                return (
                  <div className="space-y-4 text-xs">
                    {/* Why not breakdown */}
                    <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100 space-y-2">
                      <span className="font-extrabold text-slate-800 text-xs block">
                        Why not {whyNotRungRole.title}?
                      </span>
                      <p className="text-slate-600 text-[11px]">
                        Current Fit is <strong>{simulation.originalFit}%</strong> (Readiness: {readiness}%, Interest: 75%, Market: {Math.round(whyNotRungRole.demandScore * 100)}%).
                      </p>

                      <div className="pt-1 space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          What lowers your score:
                        </span>
                        {gaps.filter((g) => g.status !== 'have').slice(0, 3).map((g) => (
                          <div
                            key={g.skillId}
                            className="flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-200 text-[11px]"
                          >
                            <span className="font-semibold text-slate-700">{g.skillName}</span>
                            <span className="text-rose-600 font-bold">
                              L{g.currentLevel} of {g.requiredLevel} (-{Math.round(g.weightedGap * 8)} pts)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interactive What-If Slider (Signature Feature 2 demo moment) */}
                    {topPenalty && (
                      <div className="bg-orange-50/60 rounded-xl p-3.5 border border-orange-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#F28C28]" />
                            <span>What if I learn {topPenalty.skillName}?</span>
                          </span>
                          <span className="font-extrabold text-[#F28C28]">
                            Level {sliderVal} / 5
                          </span>
                        </div>

                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={sliderVal}
                          onChange={(e) => setSliderVal(parseInt(e.target.value, 10))}
                          className="w-full accent-[#F28C28] cursor-pointer"
                        />

                        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                          <span>L1 Basic</span>
                          <span>L3 Working</span>
                          <span>L5 Expert</span>
                        </div>

                        {/* Live Recalculated Numbers */}
                        <div className="bg-white rounded-lg p-2.5 border border-orange-200 flex items-center justify-between text-[11px]">
                          <div>
                            <span className="text-slate-500 block">Readiness:</span>
                            <span className="font-bold text-slate-800">
                              {simulation.originalReadiness}% →{' '}
                              <strong className="text-[#2E8B57]">{simulation.newReadiness}%</strong>
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Overall Fit:</span>
                            <span className="font-bold text-slate-800">
                              {simulation.originalFit}% →{' '}
                              <strong className="text-[#1F4E79]">{simulation.newFit}%</strong>
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-[#2E8B57] bg-emerald-50 px-2 py-1 rounded">
                            +{simulation.fitDelta}% Gain
                          </span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setTargetRoleId(whyNotRungRole.id);
                        setActiveView('pathway');
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Build Pathway for {whyNotRungRole.title}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p>
                  Click <strong>"Why / What-If?"</strong> on any rung in the ladder to see its formula fit breakdown and test interactive skill sliders!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
