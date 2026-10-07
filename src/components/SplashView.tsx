'use client';

import React from 'react';

export function SplashView() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center space-y-4 animate-fade-in">
        <div className="relative inline-flex items-center justify-center mb-1">
          <div className="absolute inset-0 bg-[#2997FF] rounded-3xl blur-2xl opacity-50 scale-125 -z-10 animate-pulse" />
          <div className="w-20 h-20 rounded-[22px] overflow-hidden border border-white/20 shadow-[0_12px_36px_rgba(41,151,255,0.45)]">
            <img src="/logo.jpg" alt="Campusly" className="w-full h-full object-cover" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-0.5">
          Campus<span className="text-[#D4AF37]">ly</span>
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#8FA3BF] font-semibold">
          Student Marketplace
        </p>
        <div className="w-6 h-6 border-2 border-[#2997FF] border-t-transparent rounded-full animate-spin mt-2" />
      </div>
    </div>
  );
}
