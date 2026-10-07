'use client';

import React from 'react';
import { 
  Search, 
  Plus, 
  MessageSquare, 
  User as UserIcon, 
  Sparkles,
  Briefcase,
  Calendar,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';

interface HeaderProps {
  activeTab: 'home' | 'jobs' | 'events' | 'chats' | 'profile';
  setActiveTab: (tab: 'home' | 'jobs' | 'events' | 'chats' | 'profile') => void;
  searchText: string;
  setSearchText: (text: string) => void;
  onOpenCreateListing: () => void;
  onOpenCreateJob: () => void;
  onOpenCreateEvent: () => void;
  onOpenAuth: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  searchText,
  setSearchText,
  onOpenCreateListing,
  onOpenCreateJob,
  onOpenCreateEvent,
  onOpenAuth
}: HeaderProps) {
  const { currentUser } = useAuth();
  const { chats } = useData();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full campus-glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer shrink-0 group"
          >
            <div className="relative w-[30px] h-[30px] rounded-[8px] overflow-hidden border border-white/15 shadow-sm group-hover:scale-105 transition-transform duration-200">
              <img 
                src="/logo.jpg" 
                alt="Campusly" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-0.5 group-hover:text-[#2997FF] transition-colors">
                Campus<span className="text-[#D4AF37]">ly</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#1A3560]/30 border border-[#1E3A5F]/60 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#D4AF37] text-black shadow-sm font-bold'
                  : 'text-[#8FA3BF] hover:text-white hover:bg-white/5'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'jobs'
                  ? 'bg-[#D4AF37] text-black shadow-sm font-bold'
                  : 'text-[#8FA3BF] hover:text-white hover:bg-white/5'
              }`}
            >
              Jobs & Gigs
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-[#D4AF37] text-black shadow-sm font-bold'
                  : 'text-[#8FA3BF] hover:text-white hover:bg-white/5'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab('chats')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
                activeTab === 'chats'
                  ? 'bg-[#D4AF37] text-black shadow-sm font-bold'
                  : 'text-[#8FA3BF] hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Messages</span>
              {chats.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-[#D4AF37] text-black font-black text-[9px] rounded-full">
                  {chats.length}
                </span>
              )}
            </button>
          </nav>

          {/* Search bar (for Home, Jobs, Events) */}
          <div className="flex-1 max-w-xs md:max-w-sm hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8FA3BF] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={
                  activeTab === 'jobs'
                    ? 'Search campus gigs...'
                    : activeTab === 'events'
                    ? 'Search events...'
                    : 'Search listings...'
                }
                className="w-full bg-[#0E1A2E]/80 border border-[#1E3A5F] rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-[#8FA3BF]/60 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Action buttons & Profile */}
          <div className="flex items-center gap-2">
            
            {/* Desktop Post Dropdown / Buttons */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={onOpenCreateListing}
                className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold text-xs rounded-lg shadow-[0_2px_8px_rgba(212,175,55,0.3)] transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Sell</span>
              </button>

              <button
                onClick={onOpenCreateJob}
                className="px-2.5 py-1.5 border border-[#1E3A5F] hover:border-[#D4AF37]/50 text-[#8FA3BF] hover:text-white text-xs rounded-lg transition-colors cursor-pointer"
                title="Post a job"
              >
                + Job
              </button>

              <button
                onClick={onOpenCreateEvent}
                className="px-2.5 py-1.5 border border-[#1E3A5F] hover:border-[#D4AF37]/50 text-[#8FA3BF] hover:text-white text-xs rounded-lg transition-colors cursor-pointer"
                title="Announce event"
              >
                + Event
              </button>
            </div>

            {/* Profile Avatar / Login */}
            {currentUser ? (
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-9 h-9 rounded-full bg-[#1A3560] border-2 flex items-center justify-center transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.5)]'
                    : 'border-[#1E3A5F] hover:border-[#D4AF37]/60'
                }`}
              >
                <span className="text-xs font-bold text-[#D4AF37]">
                  {getInitials(currentUser.name)}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold text-xs rounded-lg shadow-[0_2px_10px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}

          </div>

        </div>

        {/* Mobile Search Bar row */}
        <div className="pb-3 block sm:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8FA3BF] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search campus marketplace..."
              className="w-full bg-[#0E1A2E]/80 border border-[#1E3A5F] rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-[#8FA3BF]/60 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

      </div>
    </header>
  );
}
