import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  TrendingUp,
  GitFork,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Sliders,
  ShieldCheck,
  Award,
  Sparkles,
  Zap,
  Star,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../ui/CircularProgress';
import { calculateRoleGaps, getCareerRecommendations, getSteppingStoneAdvice } from '../../services/recommendationEngine';

export const StudentHome: React.FC = () => {
  const {
    profile,
    targetRole,
    setTargetRoleId,
    pathway,
    setActiveView,
    setIsAssessmentOpen,
    updateUserSkill,
    scoringWeights,
    t,
    language,
  } = useApp();

  const { readiness, haveCount, partialCount, missingCount } = calculateRoleGaps(
    targetRole,
    profile.skills
  );

  const topRecommendations = getCareerRecommendations(profile, scoringWeights, 3);
  const steppingStone = getSteppingStoneAdvice(targetRole, readiness, scoringWeights);

  const activeWeek = pathway.weeks.find((w) => w.items.some((i) => i.status === 'active')) || pathway.weeks[0];
  const activeItem = activeWeek?.items.find((i) => i.status === 'active') || activeWeek?.items[0];

  const targetTitle =
    language === 'hi' ? targetRole.titleHi : language === 'mr' ? targetRole.titleMr : targetRole.title;

  // Determine starting level based on profile education
  const initialLevel = profile.educationLevel === 'iti' ? 4 : profile.educationLevel === 'polytechnic_diploma' ? 5 : 6;
  const [currentLevel, setCurrentLevel] = useState<number>(initialLevel);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [selectedRungInfo, setSelectedRungInfo] = useState<number | null>(null);

  // 4 clear, plain-language vocational ladder steps
  const ladderSteps = [
    {
      level: 4,
      title: 'Level 4',
      name: 'Starter',
      role: 'Junior Technician',
      qual: 'ITI / Apprentice',
      salary: '₹15,000 - ₹20,000/mo',
      summary: 'Hands-on practical skills & workshop safety fundamentals.',
    },
    {
      level: 5,
      title: 'Level 5',
      name: 'Technician',
      role: 'Maintenance Technician',
      qual: 'Diploma / Advanced ITI',
      salary: '₹20,000 - ₹28,000/mo',
      summary: 'Equipment maintenance, schematics, and field troubleshooting.',
    },
    {
      level: 6,
      title: 'Level 6',
      name: 'Supervisor',
      role: 'Plant / Line Supervisor',
      qual: 'B.Tech / Advanced Diploma',
      salary: '₹28,000 - ₹42,000/mo',
      summary: 'Team coordination, quality inspection, and automation control.',
    },
    {
      level: 7,
      title: 'Level 7',
      name: 'Specialist',
      role: 'Lead Project Engineer',
      qual: 'Senior Engineer',
      salary: '₹45,000 - ₹70,000/mo',
      summary: 'System architecture, commissioning, and high-level optimization.',
    },
  ];

  // Visual ladder percent (from Level 4 to Level 7)
  const currentLevelIndex = Math.max(0, currentLevel - 4);
  const nextLevelProgress = currentLevel < 7 ? Math.min(100, readiness) : 100;
  // Progress along the 3 intervals (4->5, 5->6, 6->7)
  const totalPercent = Math.min(
    100,
    Math.round(((currentLevelIndex + (currentLevel < 7 ? nextLevelProgress / 100 : 1)) / 3) * 100)
  );

  // Gentle web audio chime for rewarding gamified sound
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 triumph
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
      });
    } catch {
      // AudioContext unavailable or restricted by browser policy
    }
  };

  const handleLevelUp = () => {
    if (isLevelingUp) return;
    setIsLevelingUp(true);

    // Audio chime
    playChime();

    // Vibrant confetti burst
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#F28C28', '#1F4E79', '#2E8B57', '#FFA64D'],
    });

    // Advance to next level or loop back to 4 if at top
    const nextLvl = currentLevel < 7 ? currentLevel + 1 : 4;

    setTimeout(() => {
      setCurrentLevel(nextLvl);
      setIsLevelingUp(false);
      setShowCelebrationModal(true);

      // Upgrade a key skill in user profile to simulate real advancement
      const gapSkills = targetRole.requiredSkills.map((r) => r.skillId);
      if (gapSkills.length > 0) {
        updateUserSkill(gapSkills[0], Math.min(5, nextLvl), true, 'quiz');
      }
    }, 500);
  };

  const currentStepData = ladderSteps.find((s) => s.level === currentLevel) || ladderSteps[1];
  const nextStepData = ladderSteps.find((s) => s.level === currentLevel + 1);

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-6">
      {/* 1. Clean Top Overview Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 flex-1">
            <div className="text-xs font-semibold text-slate-400">
              {profile.institutionName} • {profile.branch}
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('greetingNamaste')}, {profile.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              {language === 'hi'
                ? `प्रति सप्ताह ${profile.weeklyHours} घंटे के अभ्यास से अपने कौशल को आगे बढ़ाएं।`
                : language === 'mr'
                ? `दर आठवड्याला ${profile.weeklyHours} तास अभ्यास करून करिअरमध्ये पुढे जा.`
                : `Build hands-on skills with ${profile.weeklyHours} hrs/week to advance your career.`}
            </p>

            {/* Target Role & Change Button */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target:</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">{targetTitle}</span>
                <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium">
                  Level {targetRole.nsqfLevel}
                </span>
              </div>

              <button
                onClick={() => setActiveView('ladder')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#1F4E79] bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <GitFork className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>Change Target</span>
              </button>
            </div>
          </div>

          {/* Clean Readiness Gauge */}
          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/70 rounded-2xl border border-slate-100 self-center md:self-auto min-w-[160px]">
            <CircularProgress
              value={readiness}
              size={100}
              strokeWidth={9}
              label={language === 'hi' ? 'तैयारी' : language === 'mr' ? 'तयारी' : 'Readiness'}
            />
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-600">
              <span className="text-[#2E8B57] font-bold">{haveCount} Mastered</span>
              <span>•</span>
              <span className="text-[#F28C28] font-bold">{partialCount} Learning</span>
              <span>•</span>
              <span className="text-rose-500 font-bold">{missingCount} Needed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NSQF Vocational Ladder Progress Bar & Level-Up Animation */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Header with clear title and Level Up Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#F28C28]" />
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900">
                Your Career Ladder
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1F4E79]">
                Level {currentLevel} of 7
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentLevel < 7 ? (
                <span>
                  Currently at <strong>{currentStepData.name}</strong> • Reach <strong>{nextStepData?.name}</strong> at 100% readiness
                </span>
              ) : (
                <span className="text-[#2E8B57] font-semibold">
                  Highest vocational rung achieved! Outstanding dedication.
                </span>
              )}
            </p>
          </div>

          {/* Interactive Level-Up Button */}
          <button
            onClick={handleLevelUp}
            disabled={isLevelingUp}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
              isLevelingUp
                ? 'bg-[#2E8B57] text-white scale-105'
                : 'bg-gradient-to-r from-[#F28C28] to-amber-500 hover:from-[#e07b1a] hover:to-amber-600 text-slate-950 hover:shadow-md active:scale-95'
            }`}
          >
            <Zap className={`w-4 h-4 ${isLevelingUp ? 'animate-bounce text-white' : 'text-slate-950 fill-slate-950'}`} />
            <span>{isLevelingUp ? 'Upgrading...' : 'Level Up ⚡'}</span>
          </button>
        </div>

        {/* Stepped Progress Bar Visual */}
        <div className="pt-3 pb-1">
          <div className="relative">
            {/* Background Track */}
            <div className="absolute top-4 left-6 right-6 h-2 bg-slate-100 rounded-full z-0" />

            {/* Animated Fill Bar */}
            <div
              className="absolute top-4 left-6 h-2 bg-gradient-to-r from-[#1F4E79] via-[#2E8B57] to-[#F28C28] rounded-full transition-all duration-700 ease-out z-0 shadow-xs"
              style={{
                width: `calc(${totalPercent}% - 3rem)`,
              }}
            />

            {/* Stepped Nodes */}
            <div className="relative z-10 flex items-start justify-between">
              {ladderSteps.map((step) => {
                const isCompleted = step.level < currentLevel;
                const isCurrent = step.level === currentLevel;
                const isUpcoming = step.level > currentLevel;

                return (
                  <button
                    key={step.level}
                    type="button"
                    onClick={() => setSelectedRungInfo(step.level === selectedRungInfo ? null : step.level)}
                    className="flex flex-col items-center group cursor-pointer focus:outline-hidden"
                  >
                    {/* Circle Node */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                        isCompleted
                          ? 'bg-[#2E8B57] text-white shadow-xs group-hover:scale-105'
                          : isCurrent
                          ? 'bg-[#1F4E79] text-white ring-4 ring-blue-100 shadow-md scale-110'
                          : 'bg-white border-2 border-slate-200 text-slate-400 group-hover:border-slate-300'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : isCurrent ? (
                        <Star className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
                      ) : (
                        `L${step.level}`
                      )}
                    </div>

                    {/* Step Name */}
                    <span
                      className={`text-[11px] mt-2 font-bold transition-colors ${
                        isCurrent
                          ? 'text-[#1F4E79]'
                          : isCompleted
                          ? 'text-[#2E8B57]'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.name}
                    </span>

                    {/* Level Tag */}
                    <span className="text-[10px] text-slate-400">
                      Level {step.level}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Step Info Sheet (Clicking any level shows details in simple words) */}
        {selectedRungInfo && (
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-xs text-slate-700 animate-in fade-in duration-200">
            {(() => {
              const info = ladderSteps.find((s) => s.level === selectedRungInfo)!;
              return (
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-extrabold text-sm">
                        Level {info.level}: {info.name} ({info.role})
                      </strong>
                      <span className="text-[10px] font-semibold text-[#2E8B57] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {info.salary}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs">{info.summary}</p>
                    <p className="text-[11px] text-slate-500">
                      Typical qualification: <strong className="text-slate-700">{info.qual}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRungInfo(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        {/* Minimal Footer Strip */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Current Status: <strong className="text-slate-900 font-bold">{currentStepData.name} (Level {currentLevel})</strong>
            {currentLevel < 7 && (
              <span className="text-slate-400 ml-1.5 hidden sm:inline">
                • {readiness}% ready for next level
              </span>
            )}
          </span>

          <button
            onClick={() => setActiveView('ladder')}
            className="text-xs font-bold text-[#1F4E79] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Full Ladder View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stepping-Stone Notice (if readiness < 50%) */}
      {steppingStone.isNeeded && steppingStone.steppingStoneRole && (
        <div className="bg-amber-50 border border-amber-200/80 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#F28C28] shrink-0" />
            <p className="text-slate-700">
              <strong className="text-slate-900 font-bold">Quick Tip:</strong> Start with{' '}
              <strong>{steppingStone.steppingStoneRole.title}</strong> for faster placement.
            </p>
          </div>
          <button
            onClick={() => setTargetRoleId(steppingStone.steppingStoneRole!.id)}
            className="px-3 py-1 bg-[#F28C28] hover:bg-[#e07b1a] text-slate-950 font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer"
          >
            Switch Role
          </button>
        </div>
      )}

      {/* 3. 2-Column Uncluttered Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Up Next & Quick Test */}
        <div className="lg:col-span-7 space-y-4">
          {/* Next Learning Step */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#1F4E79]" />
                  <span>Up Next</span>
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#1F4E79]">
                  Week {activeWeek?.weekNumber || 1}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">
                {activeItem?.title || 'Safety Standards & Electrical Practice'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {activeItem?.provider || 'SWAYAM'} • {activeItem?.durationHours || 4} hrs • Boosts{' '}
                <strong className="text-slate-700">{activeItem?.skillName}</strong>
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-[#2E8B57] font-bold">
                +6% readiness upon completion
              </span>
              <button
                onClick={() => setActiveView('pathway')}
                className="px-3.5 py-1.5 bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Actions: Quiz & Simulator */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <ShieldCheck className="w-4 h-4 text-[#2E8B57]" />
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">Skill Test & Simulator</h4>
              </div>
              <p className="text-xs text-slate-500">
                Quick 5-question test to earn verified skill badges.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsAssessmentOpen(true)}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-[#1F4E79] font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Take Quiz
              </button>
              <button
                onClick={() => setActiveView('gaps')}
                className="px-3 py-1.5 bg-[#F28C28] hover:bg-[#e07b1a] text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>What-If</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Top Careers */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#F28C28]" />
              <span>Recommended Careers</span>
            </h3>
            <button
              onClick={() => setActiveView('matches')}
              className="text-xs font-semibold text-[#1F4E79] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {topRecommendations.map((rec) => {
              const isTarget = rec.role.id === targetRole.id;
              const title =
                language === 'hi' ? rec.role.titleHi : language === 'mr' ? rec.role.titleMr : rec.role.title;

              return (
                <div
                  key={rec.role.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isTarget
                      ? 'border-[#1F4E79] bg-blue-50/20'
                      : 'border-slate-200/70 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 truncate max-w-[190px]">
                      {title}
                    </span>
                    <span className="text-[11px] font-black text-[#1F4E79] bg-blue-50 px-2 py-0.5 rounded-full">
                      {rec.fitScore}% Match
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100 mt-1.5">
                    <span>Level {rec.role.nsqfLevel}</span>
                    {isTarget ? (
                      <span className="font-bold text-[#2E8B57] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active Target</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setTargetRoleId(rec.role.id)}
                        className="font-bold text-[#1F4E79] hover:underline cursor-pointer"
                      >
                        Set as Target →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Level-Up Celebration Modal */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 text-center relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowCelebrationModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 ring-8 ring-amber-50">
              <Zap className="w-8 h-8 fill-amber-500 text-amber-500 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F28C28] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                Level Reached! 🎉
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Level {currentLevel}: {currentStepData.name}
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Congratulations! You’ve unlocked <strong>{currentStepData.role}</strong> credentials.
                Your verified skill points increased.
              </p>
            </div>

            {/* Quick Unlocks Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-left text-xs space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>What’s New at Level {currentLevel}:</span>
              </div>
              <ul className="text-slate-600 space-y-1 text-[11px] list-disc list-inside">
                <li>Salary band: <strong className="text-slate-800">{currentStepData.salary}</strong></li>
                <li>{currentStepData.summary}</li>
                {currentLevel < 7 ? (
                  <li>Next goal: <strong className="text-[#1F4E79]">Level {currentLevel + 1} ({nextStepData?.name})</strong></li>
                ) : (
                  <li>Master of vocational career ladder</li>
                )}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => setShowCelebrationModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Awesome!
              </button>
              <button
                onClick={() => {
                  setShowCelebrationModal(false);
                  setActiveView('ladder');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                View Ladder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
