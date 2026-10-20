import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  CheckCircle2,
  Lock,
  ExternalLink,
  Clock,
  PlayCircle,
  HelpCircle,
  FolderGit2,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PathwayItem } from '../../types';

export const LearningPathwayView: React.FC = () => {
  const {
    pathway,
    markPathwayItemComplete,
    targetRole,
    profile,
    setProfile,
    language,
    t,
  } = useApp();

  const [activeMiniQuizItem, setActiveMiniQuizItem] = useState<PathwayItem | null>(null);
  const [miniQuizSelectedAnswer, setMiniQuizSelectedAnswer] = useState<number | null>(null);
  const [miniQuizSubmitted, setMiniQuizSubmitted] = useState<boolean>(false);

  const handleCompleteItem = (item: PathwayItem) => {
    // If it's a quiz, open the mini-quiz runner first
    if (item.type === 'quiz') {
      setActiveMiniQuizItem(item);
      setMiniQuizSelectedAnswer(null);
      setMiniQuizSubmitted(false);
      return;
    }

    // Fire celebration confetti!
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#1F4E79', '#F28C28', '#2E8B57'],
    });

    markPathwayItemComplete(item.id);
  };

  const handleMiniQuizSubmit = () => {
    setMiniQuizSubmitted(true);
    if (activeMiniQuizItem) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2E8B57', '#F28C28', '#1F4E79'],
      });

      markPathwayItemComplete(activeMiniQuizItem.id);
    }
  };

  const handleHoursChange = (hrs: number) => {
    setProfile((prev) => ({
      ...prev,
      weeklyHours: hrs,
    }));
  };

  const targetTitle =
    language === 'hi' ? targetRole.titleHi : language === 'mr' ? targetRole.titleMr : targetRole.title;

  const completionPercentage = Math.round(
    (pathway.completedItemCount / Math.max(1, pathway.totalItemCount)) * 100
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Clean Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              8-Week Learning Pathway for {targetTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Curriculum aligned to SWAYAM, NPTEL & Skill India courses with bi-weekly mini-quizzes.
            </p>
          </div>

          {/* Hours per week commitment selector */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-3 self-start md:self-center">
            <Clock className="w-4 h-4 text-[#F28C28]" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Study Budget</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {[4, 6, 8, 12].map((h) => (
                  <button
                    key={h}
                    onClick={() => handleHoursChange(h)}
                    className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                      profile.weeklyHours === h
                        ? 'bg-[#1F4E79] text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {h}h/wk
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pathway Overall Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#2E8B57]" />
              <span>Overall Pathway Progress: {completionPercentage}% Completed</span>
            </span>
            <span className="text-slate-500 font-semibold">
              Readiness: {pathway.readinessCurrent}% (started at {pathway.readinessBefore}%)
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#1F4E79] via-[#2E8B57] to-[#2E8B57] h-full rounded-full transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 8-Week Vertical Timeline */}
      <div className="space-y-6">
        {pathway.weeks.map((week) => {
          const isWeekDone = week.items.every((i) => i.status === 'done');
          const isWeekActive = week.items.some((i) => i.status === 'active');

          return (
            <div
              key={week.weekNumber}
              className={`rounded-2xl border p-5 transition-all ${
                isWeekActive
                  ? 'bg-white border-[#1F4E79] shadow-md ring-2 ring-blue-50'
                  : isWeekDone
                  ? 'bg-slate-50/80 border-slate-200'
                  : 'bg-white/60 border-slate-200 opacity-90'
              }`}
            >
              {/* Week Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                      isWeekDone
                        ? 'bg-emerald-100 text-[#2E8B57]'
                        : isWeekActive
                        ? 'bg-[#1F4E79] text-white shadow-xs'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    W{week.weekNumber}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                      Week {week.weekNumber}: {week.theme}
                    </h3>
                    <span className="text-xs text-slate-400">
                      Target duration: ~{profile.weeklyHours} hours practice
                    </span>
                  </div>
                </div>

                {isWeekDone ? (
                  <span className="text-xs font-bold text-[#2E8B57] bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Week Completed (+6% readiness)</span>
                  </span>
                ) : isWeekActive ? (
                  <span className="text-xs font-bold text-[#1F4E79] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    Current Focus
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked</span>
                  </span>
                )}
              </div>

              {/* Items inside this week */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {week.items.map((item) => {
                  const isDone = item.status === 'done';
                  const isActive = item.status === 'active';

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                        isDone
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : isActive
                          ? 'bg-white border-[#1F4E79] shadow-sm ring-1 ring-[#1F4E79]/20'
                          : 'bg-slate-50 border-slate-200 opacity-75'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              item.type === 'project'
                                ? 'bg-purple-100 text-purple-800'
                                : item.type === 'quiz'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-[#1F4E79]'
                            }`}
                          >
                            {item.type === 'project'
                              ? 'Hands-on Project'
                              : item.type === 'quiz'
                              ? 'Checkpoint Quiz'
                              : `${item.provider} Course`}
                          </span>

                          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{item.durationHours} hrs</span>
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 leading-snug">
                          {item.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 mt-1">
                          Improves: <strong className="text-slate-700">{item.skillName}</strong> → Target Level {item.levelTarget}
                        </p>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-[#1F4E79] hover:text-[#F28C28] flex items-center gap-1"
                          >
                            <span>Open Course Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs font-medium text-slate-400">
                            {item.type === 'project' ? 'Lab Exercise' : 'In-App Evaluation'}
                          </span>
                        )}

                        {isDone ? (
                          <span className="text-xs font-bold text-[#2E8B57] flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Done</span>
                          </span>
                        ) : isActive ? (
                          <button
                            onClick={() => handleCompleteItem(item)}
                            className="px-3 py-1.5 rounded-lg bg-[#2E8B57] hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1"
                          >
                            {item.type === 'quiz' ? (
                              <>
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>Take Quiz</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Mark Done</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Prerequisite Needed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini-Quiz Modal Runner */}
      {activeMiniQuizItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
              <Award className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Bi-Weekly Milestone Re-assessment</span>
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Checkpoint Question: {activeMiniQuizItem.skillName}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Verify your applied understanding to level up your skill and raise your target readiness!
            </p>

            <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">
                "When reviewing electrical or system drawings before commissioning, what is the first step to confirm safety?"
              </span>

              <div className="space-y-2">
                {[
                  'Check for proper earth bonding and confirm lockout-tagout (LOTO) isolation',
                  'Turn power on immediately to see if any circuit trips',
                  'Double the fuse rating to prevent premature nuisance tripping',
                  'Paint the distribution box green',
                ].map((opt, oidx) => (
                  <button
                    key={oidx}
                    onClick={() => setMiniQuizSelectedAnswer(oidx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                      miniQuizSelectedAnswer === oidx
                        ? 'border-[#1F4E79] bg-blue-50 text-[#1F4E79] font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActiveMiniQuizItem(null)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
              >
                Close
              </button>
              <button
                disabled={miniQuizSelectedAnswer === null}
                onClick={() => {
                  handleMiniQuizSubmit();
                  setActiveMiniQuizItem(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#2E8B57] hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Level Up (+6% Readiness)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
