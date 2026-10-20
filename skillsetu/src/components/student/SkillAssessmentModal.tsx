import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  FileText,
  Sliders,
  HelpCircle,
  Award,
  ArrowRight,
  Upload,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QUESTION_BANK } from '../../data/questionBankData';
import { SKILLS_TAXONOMY } from '../../data/skillsData';
import { QuizQuestion } from '../../types';

export const SkillAssessmentModal: React.FC = () => {
  const { isAssessmentOpen, setIsAssessmentOpen, profile, updateUserSkill, addAssessmentRecord, language } = useApp();

  const [activeTab, setActiveTab] = useState<'quiz' | 'self' | 'resume'>('quiz');

  // Quiz State
  const [selectedCluster, setSelectedCluster] = useState<'electrical' | 'it_data' | 'manufacturing'>('electrical');
  const questionsForCluster = QUESTION_BANK.filter((q) => q.cluster === selectedCluster);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Self-rating state
  const [selfRatings, setSelfRatings] = useState<Record<string, number>>({});

  // Resume upload state
  const [resumeText, setResumeText] = useState('');
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  if (!isAssessmentOpen) return null;

  const currentQ: QuizQuestion | undefined = questionsForCluster[currentQuestionIndex];

  const handleAnswerSubmit = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowExplanation(true);

    if (currentQ && optionIndex === currentQ.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQ) {
      const isCorrect = selectedOption === currentQ.correctIndex;
      const prevLvl = profile.skills[currentQ.skillId]?.level || 0;
      const targetLvl = isCorrect ? Math.max(prevLvl, 4) : Math.max(prevLvl, 2);

      updateUserSkill(currentQ.skillId, targetLvl, true, 'quiz');

      addAssessmentRecord({
        skillId: currentQ.skillId,
        skillName: currentQ.skillName,
        cluster: currentQ.cluster,
        score: isCorrect ? 1 : 0,
        totalQuestions: 1,
        passed: isCorrect,
        previousLevel: prevLvl,
        newLevel: targetLvl,
        verified: true,
        source: 'quiz',
      });
    }

    if (currentQuestionIndex + 1 < questionsForCluster.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsQuizComplete(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1F4E79', '#F28C28', '#2E8B57'],
      });
    }
  };

  const handleSaveSelfRatings = () => {
    for (const [skillId, lvl] of Object.entries(selfRatings)) {
      // Per Section 6.1: self-rated skill is capped at level 3 and marked unverified
      const capped = Math.min(3, lvl);
      updateUserSkill(skillId, capped, false, 'self');
    }
    setIsAssessmentOpen(false);
  };

  const handleExtractResume = () => {
    if (!resumeText.trim()) return;
    setIsExtracting(true);

    setTimeout(() => {
      const lower = resumeText.toLowerCase();
      const detected: string[] = [];

      SKILLS_TAXONOMY.forEach((s) => {
        const nameMatch = lower.includes(s.name.toLowerCase().split(' ')[0]);
        if (nameMatch) {
          detected.push(s.name);
          updateUserSkill(s.id, 3, false, 'resume');
        }
      });

      setExtractedSkills(detected);
      setIsExtracting(false);
      confetti({ particleCount: 50, spread: 50 });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setIsAssessmentOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#1F4E79] text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-[#F28C28]" />
            <span>NSQF Diagnostic Assessment Suite</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            Calibrate Your Skills Profile
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Choose a quick diagnostic quiz, rate your proficiency, or upload a resume to ground your recommendations.
          </p>
        </div>

        {/* Assessment Mode Tabs */}
        <div className="flex border-b border-slate-200 mb-5">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'quiz'
                ? 'border-[#1F4E79] text-[#1F4E79]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Interactive Quiz (Verified)</span>
          </button>
          <button
            onClick={() => setActiveTab('self')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'self'
                ? 'border-[#1F4E79] text-[#1F4E79]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Self-Rating Sliders</span>
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'resume'
                ? 'border-[#1F4E79] text-[#1F4E79]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Resume Upload</span>
          </button>
        </div>

        {/* TAB 1: QUIZ RUNNER */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            {/* Cluster Selector */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-slate-500">Cluster:</span>
              <div className="flex gap-2">
                {[
                  { id: 'electrical', label: 'Electrical & Power' },
                  { id: 'it_data', label: 'IT & Data Systems' },
                  { id: 'manufacturing', label: 'Precision Tooling' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCluster(c.id as any);
                      setCurrentQuestionIndex(0);
                      setSelectedOption(null);
                      setShowExplanation(false);
                      setIsQuizComplete(false);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedCluster === c.id
                        ? 'bg-[#1F4E79] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {isQuizComplete ? (
              <div className="text-center py-8 space-y-3 bg-emerald-50/50 rounded-2xl border border-emerald-200 p-6">
                <CheckCircle2 className="w-12 h-12 text-[#2E8B57] mx-auto" />
                <h4 className="font-extrabold text-lg text-slate-900">
                  Diagnostic Assessment Complete!
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  You scored <strong>{quizScore} / {questionsForCluster.length}</strong> on the verified benchmark.
                  Your skill profile and career fit scores have been automatically updated.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsAssessmentOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#1F4E79] text-white font-bold text-xs hover:bg-[#143552]"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            ) : currentQ ? (
              <div className="space-y-4">
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Question {currentQuestionIndex + 1} of {questionsForCluster.length}
                  </span>
                  <span className="font-semibold text-[#1F4E79]">
                    Testing: {currentQ.skillName}
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1F4E79] h-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / questionsForCluster.length) * 100}%`,
                    }}
                  />
                </div>

                {/* Question Text */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {language === 'hi' && currentQ.questionHi ? currentQ.questionHi : currentQ.question}
                  </h4>
                </div>

                {/* Options List */}
                <div className="space-y-2">
                  {(language === 'hi' && currentQ.optionsHi ? currentQ.optionsHi : currentQ.options).map(
                    (opt, optIdx) => {
                      const isSelected = selectedOption === optIdx;
                      const isCorrect = optIdx === currentQ.correctIndex;

                      let optClass = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
                      if (showExplanation) {
                        if (isCorrect) {
                          optClass = 'border-[#2E8B57] bg-emerald-50 text-emerald-900 font-bold';
                        } else if (isSelected) {
                          optClass = 'border-rose-400 bg-rose-50 text-rose-900 font-semibold';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={showExplanation}
                          onClick={() => handleAnswerSubmit(optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 cursor-pointer ${optClass}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Explanation Box */}
                {showExplanation && (
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-[#1F4E79] block">
                      {selectedOption === currentQ.correctIndex ? '✓ Correct Answer!' : '✗ Diagnostic Review:'}
                    </span>
                    <p>{currentQ.explanation}</p>
                  </div>
                )}

                {/* Next Button */}
                {showExplanation && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextQuestion}
                      className="px-4 py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* TAB 2: SELF-RATING SLIDERS */}
        {activeTab === 'self' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Rate your confidence across key vocational competencies (0 to 5). Note: Self-rated skills are capped at
              Level 3 until verified via a quiz.
            </p>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {SKILLS_TAXONOMY.slice(0, 8).map((skill) => {
                const currentRating = selfRatings[skill.id] ?? (profile.skills[skill.id]?.level || 0);

                return (
                  <div key={skill.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">{skill.name}</span>
                      <span className="font-black text-[#1F4E79]">Level {currentRating} / 5</span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={currentRating}
                      onChange={(e) =>
                        setSelfRatings((prev) => ({
                          ...prev,
                          [skill.id]: parseInt(e.target.value, 10),
                        }))
                      }
                      className="w-full accent-[#1F4E79] cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>None (0)</span>
                      <span>Basic (1)</span>
                      <span>Working (2-3)</span>
                      <span>Strong (4)</span>
                      <span>Expert (5)</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={handleSaveSelfRatings}
                className="px-4 py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs shadow-xs"
              >
                Save & Update Profile
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: RESUME UPLOAD SIMULATOR */}
        {activeTab === 'resume' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Paste your resume or project text below. SkillSetu's parser matches keywords against our NSQF taxonomy
              and maps them to your skill vector.
            </p>

            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <label className="text-xs font-bold text-[#1F4E79] cursor-pointer hover:underline block">
                Click to load sample vocational resume
                <input
                  type="button"
                  className="hidden"
                  onClick={() =>
                    setResumeText(
                      'Diploma in Electrical Engineering. Experience with industrial wiring, single phase and 3-phase transformers, earthing testing with Megger, basic PLC ladder logic troubleshooting, and electrical safety standards compliance.'
                    )
                  }
                />
              </label>
              <span className="text-[10px] text-slate-400">or paste your bio / project summary below</span>
            </div>

            <textarea
              rows={4}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste resume content here..."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-[#1F4E79] focus:outline-hidden"
            />

            <div className="flex items-center justify-between">
              <button
                disabled={!resumeText.trim() || isExtracting}
                onClick={handleExtractResume}
                className="px-4 py-2 rounded-xl bg-[#1F4E79] text-white font-bold text-xs hover:bg-[#143552] disabled:opacity-50 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>{isExtracting ? 'Analyzing Taxonomy...' : 'Extract & Match Skills'}</span>
              </button>
            </div>

            {extractedSkills.length > 0 && (
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                <span className="text-xs font-bold text-[#2E8B57] block">
                  Matched Skills Added to Profile:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {extractedSkills.map((sk, sidx) => (
                    <span
                      key={sidx}
                      className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-xs font-semibold text-slate-800"
                    >
                      ✓ {sk} (Level 3 - Resume)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
