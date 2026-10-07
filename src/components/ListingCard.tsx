'use client';

import React from 'react';
import { 
  MessageSquare, 
  BookOpen, 
  Laptop, 
  Shirt, 
  Armchair, 
  Wrench, 
  Tag 
} from 'lucide-react';
import { Listing } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  onOpenChat: (listing: Listing) => void;
}

export function ListingCard({ listing, onSelect, onOpenChat }: ListingCardProps) {
  const { currentUser } = useAuth();
  const isOwner = currentUser?.id === listing.sellerId;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Books': return <BookOpen className="w-8 h-8 text-[#D4AF37]" />;
      case 'Tech': return <Laptop className="w-8 h-8 text-[#D4AF37]" />;
      case 'Clothing': return <Shirt className="w-8 h-8 text-[#D4AF37]" />;
      case 'Furniture': return <Armchair className="w-8 h-8 text-[#D4AF37]" />;
      case 'Services': return <Wrench className="w-8 h-8 text-[#D4AF37]" />;
      default: return <Tag className="w-8 h-8 text-[#D4AF37]" />;
    }
  };

  return (
    <div className="campus-glass-card rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-[0_8px_20px_rgba(0,0,0,0.6)] group">
      {/* Category banner / preview */}
      <div 
        onClick={() => onSelect(listing)}
        className="relative w-full h-28 bg-[#1A3560]/50 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden transition-transform duration-200 group-hover:scale-[1.01]"
      >
        <div className="opacity-90 group-hover:scale-110 transition-transform duration-300">
          {getCategoryIcon(listing.category)}
        </div>
        
        {/* Category tag */}
        <span className="absolute bottom-2 left-2 text-[10px] uppercase font-semibold tracking-wider text-[#8FA3BF] bg-[#0E1A2E]/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
          {listing.category}
        </span>

        {/* Sold Badge */}
        {listing.isSold && (
          <span className="absolute top-2 right-2 bg-[#D4AF37] text-black font-black text-[10px] tracking-wider px-2 py-0.5 rounded shadow">
            SOLD
          </span>
        )}
      </div>

      {/* Info */}
      <div 
        onClick={() => onSelect(listing)} 
        className="mt-3 cursor-pointer flex-1 flex flex-col justify-between"
      >
        <div>
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 hover:text-[#D4AF37] transition-colors">
            {listing.title}
          </h3>
          <p className="text-xs text-[#8FA3BF] mt-1 line-clamp-1">
            {listing.sellerName}
          </p>
        </div>

        <div className="mt-2.5 flex items-baseline justify-between">
          <span className="text-[#D4AF37] font-bold text-base tracking-tight">
            ₸{Number(listing.price).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Chat button for non-owners */}
      {!isOwner && !listing.isSold && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenChat(listing);
          }}
          className="mt-3 w-full h-8 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-[0_2px_8px_rgba(212,175,55,0.35)] cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-black" />
          <span>Chat</span>
        </button>
      )}

      {isOwner && (
        <div 
          onClick={() => onSelect(listing)}
          className="mt-3 w-full py-1.5 text-center text-[11px] text-[#8FA3BF] border border-[#1E3A5F] rounded-lg hover:border-[#D4AF37]/40 cursor-pointer"
        >
          Your Listing (Manage)
        </div>
      )}
    </div>
  );
}
