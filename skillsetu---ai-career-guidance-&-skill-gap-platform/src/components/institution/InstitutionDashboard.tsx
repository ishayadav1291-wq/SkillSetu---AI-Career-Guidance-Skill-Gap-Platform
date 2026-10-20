import React, { useState } from 'react';
import {
  Building2,
  Users,
  TrendingUp,
  Download,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Filter,
  BarChart2,
  Layers,
  Award,
} from 'lucide-react';
import { COHORT_STUDENTS_LIST, INSTITUTION_HEATMAP_DATA } from '../../data/seedProfiles';

export const InstitutionDashboard: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [nudgeSentCount, setNudgeSentCount] = useState<number | null>(null);

  // Filter students
  const filteredStudents = COHORT_STUDENTS_LIST.filter((s) => {
    const matchesBranch = selectedBranch === 'All' || s.branch.toLowerCase().includes(selectedBranch.toLowerCase());
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.targetRole.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Name,Branch,Education,Target Role,Readiness %,Top Skill Deficit,Status,Last Activity\n';
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.id}","${s.name}","${s.branch}","${s.education}","${s.targetRole}",${s.readiness},"${s.topGap}","${s.status}","${s.lastActivity}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SkillSetu_Cohort_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendNudge = () => {
    const unassessed = filteredStudents.filter((s) => s.status === 'Needs Assessment').length;
    setNudgeSentCount(unassessed || 3);
    setTimeout(() => setNudgeSentCount(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Institution Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#1F4E79] text-xs font-bold mb-2">
              <Building2 className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Training & Placement Officer (TPO) Portal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Government Polytechnic Pune • Cohort Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Live view of institutional student readiness, deficit skill heatmaps, curriculum alignment,
              and verifiable post-training placement outcomes (Section 12).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={handleSendNudge}
              className="px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#F28C28] font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Send Nudge to Unassessed</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Report</span>
            </button>
          </div>
        </div>

        {nudgeSentCount !== null && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#2E8B57] font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>SMS and In-App nudges dispatched to {nudgeSentCount} students pending assessment!</span>
          </div>
        )}
      </div>

      {/* 4 KPI Tiles (Blueprint Section 11.4) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Students Assessed
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">418</span>
            <span className="text-xs font-bold text-[#2E8B57]">84% enrolled</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Electrical, IT & Mech</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Cohort Avg Readiness
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-[#1F4E79]">58.4%</span>
            <span className="text-xs font-bold text-[#2E8B57]">+7.8% this month</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Towards target roles</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Top Target Career
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base sm:text-lg font-black text-slate-900 truncate">
              Industrial Automation
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">134 students targeting</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Pathway Completion
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-[#2E8B57]">44.2%</span>
            <span className="text-xs font-bold text-slate-500">185 active</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">≥ 4 weeks roadmap done</span>
        </div>
      </div>

      {/* Skill-Gap Heatmap (Section 7.2 & 11.4) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#F28C28]" />
              <span>Cohort Skill-Gap Heatmap vs Industry Demand</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifies curriculum deficits so TPOs can organize targeted guest workshops and lab upgrades.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            Ranked by Deficit %
          </span>
        </div>

        <div className="space-y-3">
          {INSTITUTION_HEATMAP_DATA.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="md:w-1/3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{item.skill}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                    {item.cluster}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">
                  Market Demand: <strong className="text-slate-700">{item.marketDemandRank}</strong>
                </span>
              </div>

              {/* Progress bar of missing cohort % */}
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Students Needing Skill:</span>
                  <span className="font-bold text-rose-600">{item.missingCohortPct}% of Cohort</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.missingCohortPct > 65
                        ? 'bg-[#C0392B]'
                        : item.missingCohortPct > 45
                        ? 'bg-[#F28C28]'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${item.missingCohortPct}%` }}
                  />
                </div>
              </div>

              <div className="md:w-36 text-right shrink-0">
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    item.priority === 'Critical Gap'
                      ? 'bg-rose-100 text-rose-800'
                      : item.priority === 'High Deficit'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-[#1F4E79]'
                  }`}
                >
                  {item.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Roster Table with Filters & Search */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1F4E79]" />
            <h3 className="font-extrabold text-base text-slate-900">
              Student Readiness Roster ({filteredStudents.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Branch Filter */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="text-xs font-bold p-2 border border-slate-200 rounded-xl bg-slate-50"
            >
              <option value="All">All Branches</option>
              <option value="Electrical">Electrical</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Computer">IT & Computer</option>
            </select>

            {/* Search Input */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student or role..."
              className="text-xs p-2 border border-slate-200 rounded-xl bg-slate-50 w-44"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Branch & Edu</th>
                <th className="py-2.5 px-3">Target Role</th>
                <th className="py-2.5 px-3">Readiness</th>
                <th className="py-2.5 px-3">Top Skill Gap</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{s.name}</td>
                  <td className="py-3 px-3 text-slate-600">
                    {s.branch} <span className="text-[10px] text-slate-400">({s.education})</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{s.targetRole}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-black px-2 py-0.5 rounded ${
                        s.readiness >= 70
                          ? 'bg-emerald-50 text-[#2E8B57]'
                          : s.readiness >= 50
                          ? 'bg-amber-50 text-[#F28C28]'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {s.readiness}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{s.topGap}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.status === 'Pathway Active'
                          ? 'bg-blue-100 text-[#1F4E79]'
                          : s.status === 'Assessed'
                          ? 'bg-purple-100 text-purple-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{s.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outcome Tracking Module (Section 12 of Blueprint) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#2E8B57] text-xs font-bold mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Section 12: Outcome Tracking & Feedback Loop</span>
          </div>
          <h3 className="font-extrabold text-base text-slate-900">
            Post-Pathway 6-Month Employment Outcomes
          </h3>
          <p className="text-xs text-slate-500">
            Self-reported outcome survey results from past cohort graduates (N = 142 responses).
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-2xl font-black text-[#2E8B57]">64.2%</span>
            <span className="text-xs font-bold text-slate-700 block mt-1">Placed in Industry</span>
            <span className="text-[10px] text-slate-400">91 students</span>
          </div>
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <span className="text-2xl font-black text-[#1F4E79]">21.8%</span>
            <span className="text-xs font-bold text-slate-700 block mt-1">NAPS Apprenticeship</span>
            <span className="text-[10px] text-slate-400">31 students</span>
          </div>
          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200">
            <span className="text-2xl font-black text-purple-700">8.5%</span>
            <span className="text-xs font-bold text-slate-700 block mt-1">Higher Studies (B.Tech)</span>
            <span className="text-[10px] text-slate-400">12 students</span>
          </div>
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
            <span className="text-2xl font-black text-amber-700">5.5%</span>
            <span className="text-xs font-bold text-slate-700 block mt-1">Self-Employed / Active</span>
            <span className="text-[10px] text-slate-400">8 students</span>
          </div>
        </div>
      </div>
    </div>
  );
};
