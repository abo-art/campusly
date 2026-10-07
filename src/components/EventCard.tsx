'use client';

import React from 'react';
import { Calendar, Heart, MapPin } from 'lucide-react';
import { CampusEvent } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface EventCardProps {
  event: CampusEvent;
  onSelect: (event: CampusEvent) => void;
}

export function EventCard({ event, onSelect }: EventCardProps) {
  const { currentUser, toggleFavoriteEvent } = useAuth();
  const isFavorite = currentUser?.favoriteEvents?.includes(event.id);

  const formattedDate = () => {
    try {
      const d = new Date(event.date);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Upcoming';
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteEvent(event.id);
  };

  return (
    <div 
      onClick={() => onSelect(event)}
      className="campus-glass-card rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-[0_8px_20px_rgba(0,0,0,0.5)] flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-white font-semibold text-base line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
              {event.title}
            </h3>
            
            <div className="flex items-center gap-2 text-xs text-[#8FA3BF] mt-1.5 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                {formattedDate()}
              </span>
              <span>•</span>
              <span>{event.time}</span>
            </div>
          </div>

          <button
            onClick={handleFavoriteClick}
            className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Favorite event"
          >
            <Heart 
              className={`w-5 h-5 transition-transform active:scale-125 ${
                isFavorite ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#8FA3BF] hover:text-[#D4AF37]'
              }`} 
            />
          </button>
        </div>

        <div className="my-3 border-t border-[#1E3A5F]/60" />

        <p className="text-xs text-[#8FA3BF] line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#8FA3BF]">
        <div className="flex items-center gap-1.5 text-white/90">
          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="line-clamp-1">{event.location}</span>
        </div>
        <span className="text-[11px] text-[#8FA3BF]">
          By {event.organizerName}
        </span>
      </div>
    </div>
  );
}
