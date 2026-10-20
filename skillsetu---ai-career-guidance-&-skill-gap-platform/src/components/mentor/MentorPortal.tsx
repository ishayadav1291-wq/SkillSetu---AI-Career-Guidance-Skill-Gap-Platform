import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  CheckCircle2,
  PlusCircle,
  Building2,
  Mail,
  Send,
  Sparkles,
} from 'lucide-react';
import { COHORT_STUDENTS_LIST } from '../../data/seedProfiles';

export const MentorPortal: React.FC = () => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [postedSuccess, setPostedSuccess] = useState(false);
  const [invitedStudentIds, setInvitedStudentIds] = useState<string[]>([]);

  const [newPosting, setNewPosting] = useState({
    title: 'Diploma Trainee - Electrical Automation',
    company: 'Schneider Electric / Tata AutoComp',
    stream: 'Electrical',
    type: 'NAPS Apprenticeship',
    location: 'Chakan, Pune',
    stipend: '₹17,500 / month',
    requiredSkills: 'PLC Ladder Logic, Electrical Safety, Motor Testing',
  });

  const handleInvite = (studentId: string) => {
    setInvitedStudentIds((prev) => [...prev, studentId]);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    setPostedSuccess(true);
    setTimeout(() => {
      setShowPostForm(false);
      setPostedSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Mentor Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#1F4E79] text-xs font-bold mb-2">
              <Briefcase className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Industry Recruiter & Mentorship Portal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Talent Sourcing & Candidate Matching
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Connect directly with vocational candidates verified through faculty-reviewed assessments.
              Filter students strictly by their audited skill levels.
            </p>
          </div>

          <button
            onClick={() => setShowPostForm(!showPostForm)}
            className="px-4 py-2.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs flex items-center gap-2 transition-all self-start md:self-center shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-[#F28C28]" />
            <span>{showPostForm ? 'Close Form' : 'Post New Apprenticeship / Job'}</span>
          </button>
        </div>
      </div>

      {/* Post Role Form */}
      {showPostForm && (
        <form
          onSubmit={handleCreatePost}
          className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">
              Create New Verified Role Opening
            </h3>
            <span className="text-xs text-slate-400">Section 7.3 Mentor Flow</span>
          </div>

          {postedSuccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#2E8B57] mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">Opening Published Successfully!</h4>
              <p className="text-xs text-slate-500">
                Matched students with verified scores will receive instant notifications in their portal.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Job / Apprenticeship Title</label>
                <input
                  type="text"
                  required
                  value={newPosting.title}
                  onChange={(e) => setNewPosting({ ...newPosting, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hiring Organization</label>
                <input
                  type="text"
                  required
                  value={newPosting.company}
                  onChange={(e) => setNewPosting({ ...newPosting, company: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location & Plant Site</label>
                <input
                  type="text"
                  required
                  value={newPosting.location}
                  onChange={(e) => setNewPosting({ ...newPosting, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Monthly Stipend / Salary</label>
                <input
                  type="text"
                  required
                  value={newPosting.stipend}
                  onChange={(e) => setNewPosting({ ...newPosting, stipend: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">
                  Required Verified Competencies (comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={newPosting.requiredSkills}
                  onChange={(e) => setNewPosting({ ...newPosting, requiredSkills: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostForm(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs"
                >
                  Publish Role to Matching Engine
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Verified Candidates Directory */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1F4E79]" />
              <span>Candidates Ranked by Verified Skill Alignment</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Only faculty-tested, verified skill scores are presented to industry recruiters.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#2E8B57]">
            Verified Pool (DPDP 2023 Compliant)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COHORT_STUDENTS_LIST.slice(0, 6).map((student) => {
            const isInvited = invitedStudentIds.includes(student.id);

            return (
              <div
                key={student.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-slate-900">{student.name}</span>
                    <span className="text-xs font-black text-[#1F4E79] bg-blue-100 px-2 py-0.5 rounded-full">
                      {student.readiness}% Fit
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    {student.education} • {student.branch} • Target: <span className="font-semibold text-slate-800">{student.targetRole}</span>
                  </p>

                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E8B57]" />
                    <span>Verified competencies: Wiring, Safety Standards, Diagnostics</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">Govt Polytechnic Pune</span>

                  {isInvited ? (
                    <span className="font-bold text-[#2E8B57] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Interview Request Sent</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleInvite(student.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Invite to Interview</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
