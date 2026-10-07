'use client';

import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Heart, 
  User, 
  CheckCircle, 
  Trash2 
} from 'lucide-react';
import { CampusEvent } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';

interface EventDetailModalProps {
  event: CampusEvent | null;
  onClose: () => void;
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const { currentUser, toggleFavoriteEvent } = useAuth();
  const { deleteEvent } = useData();

  if (!event) return null;

  const isFavorite = currentUser?.favoriteEvents?.includes(event.id);
  const isOwner = currentUser?.id === event.organizerId;

  const formattedDate = () => {
    try {
      const d = new Date(event.date);
      return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Date Announced';
    }
  };

  const handleDelete = async () => {
    await deleteEvent(event.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-[#0E1A2E] border border-[#1E3A5F] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/50 text-[#8FA3BF] hover:text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-4">
          
          {/* Header Banner */}
          <div className="relative w-full h-44 bg-gradient-to-br from-[#1A3560] to-[#0B1220] rounded-xl flex flex-col items-center justify-center border border-[#1E3A5F]/60">
            <Calendar className="w-14 h-14 text-[#D4AF37]" />
            <span className="text-xs uppercase font-bold tracking-widest text-[#8FA3BF] mt-2">
              Campus Event
            </span>

            {/* Favorite button in corner */}
            <button
              onClick={() => toggleFavoriteEvent(event.id)}
              className="absolute top-3 left-3 p-2 rounded-full bg-black/40 backdrop-blur-sm text-[#8FA3BF] hover:text-[#D4AF37] cursor-pointer"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
            </button>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">
              {event.title}
            </h2>
            <div className="mt-3 space-y-2 bg-[#1A3560]/30 border border-[#1E3A5F] rounded-xl p-3.5 text-xs text-white">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{formattedDate()}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1E3A5F]/60" />

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8FA3BF] mb-1.5">
              Event Details
            </h4>
            <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Organizer Card */}
          <div className="campus-glass-card rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1A3560] flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-[#8FA3BF] block">Organized by</span>
                <span className="text-sm font-semibold text-white">{event.organizerName}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#D4AF37]">
              <CheckCircle className="w-4 h-4" />
              <span>Campus Society</span>
            </div>
          </div>

          {/* Favorite Toggle Button */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => toggleFavoriteEvent(event.id)}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isFavorite
                  ? 'border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10'
                  : 'bg-[#D4AF37] hover:bg-[#b8952b] text-black shadow-[0_4px_16px_rgba(212,175,55,0.4)]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#D4AF37]' : ''}`} />
              <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
            </button>

            {isOwner && (
              <button
                onClick={handleDelete}
                className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Event</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
