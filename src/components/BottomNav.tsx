'use client';

import React from 'react';
import { 
  Home, 
  Briefcase, 
  Calendar, 
  PlusCircle, 
  MessageSquare, 
  User 
} from 'lucide-react';
import { useData } from '@/context/DataContext';

interface BottomNavProps {
  activeTab: 'home' | 'jobs' | 'events' | 'chats' | 'profile';
  setActiveTab: (tab: 'home' | 'jobs' | 'events' | 'chats' | 'profile') => void;
  onOpenCreateListing: () => void;
}

export function BottomNav({ activeTab, setActiveTab, onOpenCreateListing }: BottomNavProps) {
  const { chats } = useData();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0B1220]/95 backdrop-blur-xl border-t border-[#1E3A5F]/70 px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-[#D4AF37]' : 'text-[#8FA3BF] hover:text-white'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </button>

        {/* Jobs */}
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'jobs' ? 'text-[#D4AF37]' : 'text-[#8FA3BF] hover:text-white'
          }`}
        >
          <Briefcase className={`w-5 h-5 ${activeTab === 'jobs' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium mt-1">Jobs</span>
        </button>

        {/* Events */}
        <button
          onClick={() => setActiveTab('events')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'events' ? 'text-[#D4AF37]' : 'text-[#8FA3BF] hover:text-white'
          }`}
        >
          <Calendar className={`w-5 h-5 ${activeTab === 'events' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium mt-1">Events</span>
        </button>

        {/* Sell Button */}
        <button
          onClick={onOpenCreateListing}
          className="flex flex-col items-center py-1 px-2.5 rounded-lg text-[#D4AF37] cursor-pointer"
        >
          <PlusCircle className="w-6 h-6 fill-[#D4AF37] text-black drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]" />
          <span className="text-[10px] font-bold mt-0.5">Sell</span>
        </button>

        {/* Chats */}
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors relative cursor-pointer ${
            activeTab === 'chats' ? 'text-[#D4AF37]' : 'text-[#8FA3BF] hover:text-white'
          }`}
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 ${activeTab === 'chats' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {chats.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#D4AF37] rounded-full" />
            )}
          </div>
          <span className="text-[10px] font-medium mt-1">Chats</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-[#D4AF37]' : 'text-[#8FA3BF] hover:text-white'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium mt-1">Profile</span>
        </button>

      </div>
    </nav>
  );
}
