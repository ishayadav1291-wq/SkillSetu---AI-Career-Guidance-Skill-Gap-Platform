import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Phone,
  Mail,
  Lock,
  CheckCircle2,
  Sparkles,
  Building2,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language, UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, language, setLanguage, t } = useApp();

  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('9823456789');
  const [otpCode, setOtpCode] = useState('1234');
  const [otpSent, setOtpSent] = useState(false);

  const [email, setEmail] = useState('riya.sharma@polytech.ac.in');
  const [password, setPassword] = useState('••••••••');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
    } else {
      login('riya', 'student');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login('riya', 'student');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F7F9FC] px-4 py-8">
      {/* Top Bar Language Selector */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1F4E79] flex items-center justify-center text-white shadow-xs">
            <Compass className="w-4 h-4 text-[#F28C28]" />
          </div>
          <span className="font-extrabold text-base text-[#1F4E79] tracking-tight">
            Skill<span className="text-[#F28C28]">Setu</span>
          </span>
        </div>

        {/* Minimal Language Switcher */}
        <div className="inline-flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
          {(['en', 'hi', 'mr'] as Language[]).map((lng) => (
            <button
              key={lng}
              onClick={() => setLanguage(lng)}
              className={`px-2 py-0.5 text-xs font-bold rounded transition-all ${
                language === lng
                  ? 'bg-white text-[#1F4E79] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {lng === 'en' ? 'EN' : lng === 'hi' ? 'हिन्दी' : 'मराठी'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {language === 'hi'
                ? 'स्किलसेतु में प्रवेश करें'
                : language === 'mr'
                ? 'कौशलसेतूवर लॉग इन करा'
                : 'Welcome to SkillSetu'}
            </h1>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'व्यावसायिक कौशल और करियर रोडमैप'
                : language === 'mr'
                ? 'व्यावसायिक कौशल्य आणि करिअर रोडमॅप'
                : 'AI-Based Career Guidance & Skill-Gap Platform'}
            </p>
          </div>

          {/* Phone / Email Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setAuthMode('phone'); setOtpSent(false); }}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'phone'
                  ? 'bg-white text-[#1F4E79] font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile OTP</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('email')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'email'
                  ? 'bg-white text-[#1F4E79] font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>
          </div>

          {/* Form */}
          {authMode === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1F4E79]"
                  />
                </div>
              </div>

              {otpSent && (
                <div className="animate-in fade-in duration-200">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1234"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 tracking-widest text-center focus:outline-hidden focus:ring-2 focus:ring-[#1F4E79]"
                  />
                  <span className="text-[10px] text-[#2E8B57] font-semibold mt-1 block">
                    ✓ Test OTP auto-filled (1234)
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>{otpSent ? 'Verify OTP & Enter' : 'Get OTP'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu.in"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Log In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Quick Demo Personas (1-Tap Entry for Reviewers/Students) */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-2.5">
              Or Explore with 1-Tap Demo:
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => login('riya', 'student')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-[#1F4E79] hover:bg-blue-50/50 transition-colors text-center group cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-800 group-hover:text-[#1F4E79] block">
                  Riya
                </span>
                <span className="text-[10px] text-slate-400 block">Diploma (Elec)</span>
              </button>

              <button
                type="button"
                onClick={() => login('amit', 'student')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-[#1F4E79] hover:bg-blue-50/50 transition-colors text-center group cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-800 group-hover:text-[#1F4E79] block">
                  Amit
                </span>
                <span className="text-[10px] text-slate-400 block">BCA (Data)</span>
              </button>

              <button
                type="button"
                onClick={() => login('sneha', 'student')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-[#1F4E79] hover:bg-blue-50/50 transition-colors text-center group cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-800 group-hover:text-[#1F4E79] block">
                  Sneha
                </span>
                <span className="text-[10px] text-slate-400 block">ITI (Mech)</span>
              </button>
            </div>

            <div className="mt-2.5 flex justify-center">
              <button
                type="button"
                onClick={() => login('riya', 'institution')}
                className="text-xs text-slate-500 hover:text-[#1F4E79] font-medium transition-colors cursor-pointer"
              >
                Log in as <strong>College TPO / Placement Officer →</strong>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-400">
        SkillSetu • NSQF Aligned Career Platform
      </div>
    </div>
  );
};
