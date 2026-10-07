'use client';

import React, { useState } from 'react';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AuthView() {
  const { login, register, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setErrorMessage('Please enter your full name');
          setIsLoading(false);
          return;
        }
        const res = await register(name.trim(), email.trim(), password);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to register account');
        }
      } else {
        const res = await login(email.trim(), password);
        if (!res.success) {
          setErrorMessage(res.error || 'Invalid student email or password');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1A3560]/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center mb-1">
            <div className="absolute inset-0 bg-[#2997FF] rounded-3xl blur-2xl opacity-45 scale-125 -z-10" />
            <div className="w-16 h-16 rounded-[18px] overflow-hidden border border-white/20 shadow-[0_8px_24px_rgba(41,151,255,0.4)]">
              <img src="/logo.jpg" alt="Campusly" className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-0.5">
            Campus<span className="text-[#D4AF37]">ly</span>
          </h1>
          <p className="text-sm text-[#8FA3BF]">
            {mode === 'login' ? 'Welcome back to your campus community' : 'Join your university student exchange'}
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A3560]/40 border border-[#1E3A5F] text-[11px] text-[#D4AF37] mt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Private & Confidential Campus Network</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="campus-glass-card rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl border border-[#1E3A5F]">
          
          {errorMessage && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-200">
              {errorMessage}
            </div>
          )}

          {/* Social Sign In (Google) */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold text-xs rounded-xl flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1E3A5F]"></div>
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-[#0E1A2E] px-2 text-[#8FA3BF]">or with student email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-[11px] font-bold text-[#8FA3BF] uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8FA3BF] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sanzhar Kassym"
                    className="w-full bg-[#1A3560]/30 border border-[#1E3A5F] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37] placeholder-[#8FA3BF]/50"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-[#8FA3BF] uppercase tracking-wider block mb-1">
                Student Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8FA3BF] absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu.kz"
                  className="w-full bg-[#1A3560]/30 border border-[#1E3A5F] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37] placeholder-[#8FA3BF]/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#8FA3BF] uppercase tracking-wider block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8FA3BF] absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1A3560]/30 border border-[#1E3A5F] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37] placeholder-[#8FA3BF]/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(212,175,55,0.4)] transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Authenticating...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setErrorMessage(null);
              }}
              className="text-xs text-[#8FA3BF] hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign Up" 
                : 'Already have an account? Sign In'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
