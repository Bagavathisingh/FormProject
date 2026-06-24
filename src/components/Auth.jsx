import React from 'react';
import { ArrowRight, Check, Info, CheckSquare, Sparkles } from 'lucide-react';

export default function Auth({
  authMode,
  setAuthMode,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  signupStep,
  setSignupStep,
  signupForm,
  setSignupForm,
  handleLogin,
  handleSignupNext,
  handleSignupComplete
}) {
  return (
    <div className="min-h-screen bg-animated-mesh flex items-center justify-center p-4">
      {authMode === 'login' ? (
        <div className="w-full max-w-[390px] rounded-3xl backdrop-blur-xl bg-white/70 border border-white/60 p-8 shadow-2xl shadow-slate-200/40 animate-fade-in text-center relative overflow-hidden">
          {/* Absolute Decorative Blurs */}
          <div className="absolute -top-12 -left-12 h-32 w-32 bg-indigo-200/25 rounded-full filter blur-xl -z-10 animate-pulse-slow" />
          <div className="absolute -bottom-12 -right-12 h-32 w-32 bg-violet-200/20 rounded-full filter blur-xl -z-10 animate-pulse-slow" />

          {/* Minimal Logo tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50/60 border border-indigo-100/50 text-[8px] font-extrabold uppercase tracking-widest text-indigo-600 mb-5 select-none">
            ✨ Coordinator Hub
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none mb-1.5">Welcome Back</h3>
            <p className="text-[10px] text-slate-400 font-semibold">Access your placement training workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="relative">
              <input
                id="login-email"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder=" "
                className="w-full px-4 py-3 rounded-xl border border-slate-200 glass-input text-xs text-slate-800 focus:pt-5 focus:pb-1 peer focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-550/10 transition-all duration-200"
              />
              <label 
                htmlFor="login-email" 
                className="absolute left-4 top-3 text-[9px] text-slate-400 font-bold uppercase tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1 peer-focus:text-[9px] peer-focus:text-indigo-600 peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-indigo-600 peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider"
              >
                Staff Email Address
              </label>
            </div>

            <div className="relative">
              <input
                id="login-password"
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder=" "
                className="w-full px-4 py-3 rounded-xl border border-slate-200 glass-input text-xs text-slate-800 focus:pt-5 focus:pb-1 peer focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-550/10 transition-all duration-200"
              />
              <label 
                htmlFor="login-password" 
                className="absolute left-4 top-3 text-[9px] text-slate-400 font-bold uppercase tracking-wider pointer-events-none transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1 peer-focus:text-[9px] peer-focus:text-indigo-600 peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-indigo-600 peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider"
              >
                Workspace Password
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-indigo-600/10 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1.5 mt-3.5 cursor-pointer"
            >
              Enter Workspace Panel <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-slate-100/70 text-center text-xs text-slate-500">
            New workspace coordinator?{' '}
            <button
              onClick={() => { setAuthMode('signup'); setSignupStep(1); }}
              className="text-indigo-600 hover:text-indigo-800 font-bold underline decoration-indigo-200 hover:decoration-indigo-600 decoration-2 underline-offset-2 transition cursor-pointer"
            >
              Create Hub Account
            </button>
          </div>
        </div>
      ) : (
        /* Multi-step Onboarding Signup */
        <div className="w-full max-w-2xl bg-white/70 rounded-3xl glass-panel shadow-2xl p-8 md:p-12 animate-fade-in">
          {/* Progress indicators */}
          <div className="flex items-center justify-between mb-8 max-w-md mx-auto relative">
            <div className="absolute h-0.5 bg-slate-200 left-4 right-4 top-4 -z-10" />
            <div className="absolute h-0.5 bg-indigo-600 left-4 top-4 -z-10 transition-all duration-300" style={{ width: `${(signupStep - 1) * 50}%` }} />
            
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center gap-1.5">
                <div className={`h-8 w-8 rounded-full border-2 font-bold text-xs flex items-center justify-center transition-all ${
                  signupStep === step ? 'bg-indigo-600 text-white border-indigo-600 glow-primary scale-110' :
                  signupStep > step ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {signupStep > step ? <Check className="h-4 w-4" /> : step}
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${signupStep === step ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {step === 1 ? 'Personal' : step === 2 ? 'Account' : 'Success'}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Personal Info */}
          {signupStep === 1 && (
            <div className="space-y-4 max-w-md mx-auto animate-fade-in">
              <h3 className="text-xl font-bold text-slate-900 text-center">Placement Staff Onboarding</h3>
              <p className="text-xs text-slate-500 text-center mb-6">Enter your professional workspace details.</p>

              <div className="relative">
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={signupForm.fullName}
                  onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                  placeholder=" "
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 glass-input text-sm text-slate-800 focus:pt-5 focus:pb-1 peer"
                />
                <label htmlFor="signup-name" className="absolute left-4 top-3.5 text-xs text-slate-400 pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-indigo-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px]">Full Name</label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Department</label>
                  <select
                    value={signupForm.department}
                    onChange={(e) => setSignupForm({ ...signupForm, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-sm text-slate-800 focus:outline-indigo-600"
                  >
                    <option>Computer Science</option>
                    <option>Electronics Eng</option>
                    <option>Mechanical Eng</option>
                    <option>Information Tech</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Role</label>
                  <select
                    value={signupForm.role}
                    onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-sm text-slate-800 focus:outline-indigo-600"
                  >
                    <option>Placement Staff</option>
                    <option>Corporate Relations</option>
                    <option>Training Officer</option>
                    <option>Department Coordinator</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <input
                  id="signup-phone"
                  type="text"
                  required
                  value={signupForm.phone}
                  onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                  placeholder=" "
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 glass-input text-sm text-slate-800 focus:pt-5 focus:pb-1 peer"
                />
                <label htmlFor="signup-phone" className="absolute left-4 top-3.5 text-xs text-slate-400 pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-indigo-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px]">Phone Number</label>
              </div>

              <button
                type="button"
                onClick={handleSignupNext}
                disabled={!signupForm.fullName || !signupForm.phone}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold py-3 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 mt-4"
              >
                Continue to Credentials <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 2: Account Security */}
          {signupStep === 2 && (
            <div className="space-y-4 max-w-md mx-auto animate-fade-in">
              <h3 className="text-xl font-bold text-slate-900 text-center">Secure your account</h3>
              <p className="text-xs text-slate-500 text-center mb-6">Choose email and password for authorization.</p>

              <div className="relative">
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  placeholder=" "
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 glass-input text-sm text-slate-800 focus:pt-5 focus:pb-1 peer"
                />
                <label htmlFor="signup-email" className="absolute left-4 top-3.5 text-xs text-slate-400 pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-indigo-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px]">Email Address</label>
              </div>

              <div className="relative">
                <input
                  id="signup-pass"
                  type="password"
                  required
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  placeholder=" "
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 glass-input text-sm text-slate-800 focus:pt-5 focus:pb-1 peer"
                />
                <label htmlFor="signup-pass" className="absolute left-4 top-3.5 text-xs text-slate-400 pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-indigo-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px]">Security Password</label>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-2.5">
                <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-indigo-800 leading-normal">
                  Password must contain at least 8 characters, one number, and special character symbols.
                </p>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setSignupStep(1)}
                  className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold py-3 px-4 rounded-xl transition"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={handleSignupNext}
                  disabled={!signupForm.email || !signupForm.password}
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                >
                  Validate Signup <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {signupStep === 3 && (
            <div className="text-center max-w-sm mx-auto animate-fade-in space-y-6">
              <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto glow-success border border-emerald-100 animate-float">
                <CheckSquare className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Onboarding Completed!</h3>
                <p className="text-xs text-slate-500 mt-2">
                  Your institutional staff profile is verified. You have been registered as <strong>{signupForm.fullName} ({signupForm.role})</strong> in the system workspace.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl text-left border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs text-slate-500"><span className="font-medium">Department:</span> <span>{signupForm.department}</span></div>
                <div className="flex justify-between text-xs text-slate-500"><span className="font-medium">Staff Role:</span> <span>{signupForm.role}</span></div>
                <div className="flex justify-between text-xs text-slate-500"><span className="font-medium">Database Node:</span> <span>Node-3 (Primary)</span></div>
              </div>

              <button
                type="button"
                onClick={handleSignupComplete}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                Enter Command Center <Sparkles className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mt-8 text-center text-xs text-slate-500">
            Already have credentials?{' '}
            <button
              onClick={() => setAuthMode('login')}
              className="text-indigo-600 hover:text-indigo-800 font-semibold underline decoration-2 underline-offset-2"
            >
              Log In Here
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
