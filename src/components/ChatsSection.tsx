'use client';

import React from 'react';
import { MessageSquare, User, Tag, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Chat } from '@/types';

interface ChatsSectionProps {
  onRequireAuth?: () => void;
}

export function ChatsSection({ onRequireAuth }: ChatsSectionProps) {
  const { currentUser } = useAuth();
  const { chats, setActiveChat } = useData();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#1A3560] flex items-center justify-center mx-auto text-[#D4AF37]">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">Sign In to View Messages</h3>
        <p className="text-xs text-[#8FA3BF]">
          Connect with buyers and sellers on campus directly.
        </p>
        <button
          onClick={onRequireAuth}
          className="px-6 py-2.5 bg-[#D4AF37] text-black font-bold text-xs rounded-xl shadow-lg cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

  const formattedTime = (dateAny: any) => {
    try {
      const d = new Date(dateAny);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20 pt-2">
      <div className="px-1">
        <h2 className="text-xl font-bold text-white">Messages</h2>
        <p className="text-xs text-[#8FA3BF]">Direct conversations with campus students</p>
      </div>

      {chats.length === 0 ? (
        <div className="campus-glass-card rounded-2xl p-10 text-center space-y-3">
          <MessageSquare className="w-12 h-12 text-[#8FA3BF] mx-auto opacity-40" />
          <h3 className="text-base font-bold text-white">No conversations yet</h3>
          <p className="text-xs text-[#8FA3BF] max-w-sm mx-auto">
            Find an item on the marketplace or a gig on the jobs board and tap &quot;Chat&quot; to begin!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className="campus-glass-card rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer transition-all duration-200 hover:border-[#D4AF37]/50 hover:bg-[#1A3560]/20"
            >
              <div className="w-12 h-12 rounded-full bg-[#1A3560] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <User className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white truncate">
                    {chat.otherUserName || 'Student'}
                  </h4>
                  {chat.lastMessageAt && (
                    <span className="text-[10px] text-[#8FA3BF] whitespace-nowrap ml-2">
                      {formattedTime(chat.lastMessageAt)}
                    </span>
                  )}
                </div>

                {chat.listingTitle && (
                  <div className="flex items-center gap-1 text-[11px] text-[#D4AF37] truncate mt-0.5">
                    <Tag className="w-3 h-3 shrink-0" />
                    <span className="truncate">Re: {chat.listingTitle}</span>
                  </div>
                )}

                <p className="text-xs text-[#8FA3BF] truncate mt-1">
                  {chat.lastMessage || 'Tap to chat...'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
