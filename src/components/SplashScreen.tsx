import React from 'react';
import { Sprout, TrendingUp } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d5f3f] to-[#1e4029] flex flex-col items-center justify-center p-6 animate-fadeIn">
      {/* Logo and Brand */}
      <div className="relative mb-8">
        {/* Animated path line */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-1 h-24 bg-gradient-to-b from-transparent via-[#e8915f]/50 to-[#e8915f] animate-pathGrow" />
        
        {/* Farm icon (origin) */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[#e8915f] rounded-full p-2 animate-fadeIn">
          <Sprout className="w-4 h-4 text-white" />
        </div>

        {/* Main logo circle */}
        <div className="bg-white rounded-full p-8 shadow-2xl">
          <div className="text-[#2d5f3f] text-center">
            <div className="flex items-center justify-center mb-2">
              <Sprout className="w-12 h-12" />
              <TrendingUp className="w-8 h-8 ml-1 text-[#e8915f]" />
            </div>
            <div className="font-bold text-2xl tracking-tight">Kilimo</div>
            <div className="font-light text-lg -mt-1">Trace</div>
          </div>
        </div>

        {/* Market icon (destination) */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-[#e8915f] rounded-full p-2 animate-fadeIn animation-delay-500">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>

        {/* Animated path line */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-1 h-24 bg-gradient-to-b from-[#e8915f] to-transparent animate-pathGrow animation-delay-300" />
      </div>

      {/* Tagline */}
      <div className="mt-32 text-center animate-fadeIn animation-delay-700">
        <p className="text-white/90 text-lg font-light tracking-wide">
          From Farm to Market, With Trust
        </p>
      </div>

      {/* Loading indicator */}
      <div className="mt-12 flex space-x-2">
        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse animation-delay-200" />
        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse animation-delay-400" />
      </div>
    </div>
  );
}
