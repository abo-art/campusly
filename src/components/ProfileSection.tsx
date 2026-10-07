'use client';

import React, { useState } from 'react';
import { 
  LogOut, 
  Tag, 
  Pencil, 
  Check, 
  RotateCcw, 
  Trash2, 
  Plus, 
  Sparkles,
  BookOpen,
  Laptop,
  Shirt,
  Armchair,
  Wrench
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Listing } from '@/types';

interface ProfileSectionProps {
  onOpenCreateListing: () => void;
  onEditListing: (listing: Listing) => void;
}

export function ProfileSection({ onOpenCreateListing, onEditListing }: ProfileSectionProps) {
  const { currentUser, logout } = useAuth();
  const { listings, toggleListingSold, deleteListing } = useData();

  const [showSignOutAlert, setShowSignOutAlert] = useState(false);

  if (!currentUser) return null;

  const myListings = listings.filter(l => l.sellerId === currentUser.id);
  const soldCount = myListings.filter(l => l.isSold).length;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Books': return <BookOpen className="w-5 h-5 text-[#D4AF37]" />;
      case 'Tech': return <Laptop className="w-5 h-5 text-[#D4AF37]" />;
      case 'Clothing': return <Shirt className="w-5 h-5 text-[#D4AF37]" />;
      case 'Furniture': return <Armchair className="w-5 h-5 text-[#D4AF37]" />;
      case 'Services': return <Wrench className="w-5 h-5 text-[#D4AF37]" />;
      default: return <Tag className="w-5 h-5 text-[#D4AF37]" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 pt-4">
      
      {/* Avatar & User Details */}
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#1A3560] to-[#D4AF37]/30 border-2 border-[#D4AF37] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.4)]">
            <span className="text-3xl font-extrabold text-[#D4AF37]">
              {getInitials(currentUser.name)}
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-3.5">
          {currentUser.name}
        </h2>
        <p className="text-sm text-[#8FA3BF] mt-0.5">
          {currentUser.email}
        </p>
        <span className="text-xs text-[#8FA3BF]/70 mt-1">
          Campus Member
        </span>
      </div>

      {/* Stats Card */}
      <div className="campus-glass-card rounded-2xl p-4 flex items-center justify-around text-center">
        <div>
          <span className="text-2xl font-black text-[#D4AF37] block">
            {myListings.length}
          </span>
          <span className="text-xs text-[#8FA3BF] mt-0.5 block">Listings</span>
        </div>

        <div className="h-10 w-[1px] bg-[#1E3A5F]" />

        <div>
          <span className="text-2xl font-black text-[#D4AF37] block">
            {soldCount}
          </span>
          <span className="text-xs text-[#8FA3BF] mt-0.5 block">Sold</span>
        </div>

        <div className="h-10 w-[1px] bg-[#1E3A5F]" />

        <div>
          <span className="text-2xl font-black text-[#D4AF37] block">
            ⭐ —
          </span>
          <span className="text-xs text-[#8FA3BF] mt-0.5 block">Rating</span>
        </div>
      </div>

      {/* My Listings Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-white">
            My Listings ({myListings.length})
          </h3>
          <button
            onClick={onOpenCreateListing}
            className="flex items-center gap-1 text-xs text-[#D4AF37] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New</span>
          </button>
        </div>

        {myListings.length === 0 ? (
          <div className="campus-glass-card rounded-2xl p-8 text-center">
            <Tag className="w-8 h-8 text-[#8FA3BF] mx-auto mb-2 opacity-50" />
            <p className="text-sm text-[#8FA3BF]">You don&apos;t have any active listings.</p>
            <button
              onClick={onOpenCreateListing}
              className="mt-3 px-4 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded-xl shadow cursor-pointer"
            >
              Post your first item
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myListings.map((listing) => (
              <div 
                key={listing.id}
                className="campus-glass-card rounded-2xl p-3.5 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1A3560]/50 border border-[#1E3A5F] flex items-center justify-center shrink-0">
                    {getCategoryIcon(listing.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {listing.title}
                      </h4>
                      {listing.isSold && (
                        <span className="bg-[#D4AF37] text-black font-black text-[9px] px-1.5 py-0.5 rounded">
                          SOLD
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#D4AF37] font-bold mt-0.5 block">
                      ₸{Number(listing.price).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-[#1E3A5F]/40">
                  <button
                    onClick={() => onEditListing(listing)}
                    className="flex-1 py-1.5 bg-[#1A3560]/40 hover:bg-[#1A3560] border border-[#1E3A5F] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => toggleListingSold(listing.id)}
                    className={`flex-1 py-1.5 border text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      listing.isSold
                        ? 'border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10'
                        : 'bg-[#D4AF37] text-black border-[#D4AF37] hover:bg-[#b8952b]'
                    }`}
                  >
                    {listing.isSold ? (
                      <>
                        <RotateCcw className="w-3 h-3" />
                        <span>Unsell</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Sold</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => deleteListing(listing.id)}
                    className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title="Delete listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sign Out Button */}
      <div className="pt-2">
        <button
          onClick={() => setShowSignOutAlert(true)}
          className="w-full py-3.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>

        {showSignOutAlert && (
          <div className="mt-3 p-4 campus-glass-card border-red-500/40 rounded-xl text-center space-y-3">
            <p className="text-sm text-gray-200">
              Are you sure you want to sign out of your Campusly account?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowSignOutAlert(false);
                  logout();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Yes, Sign Out
              </button>
              <button
                onClick={() => setShowSignOutAlert(false)}
                className="px-4 py-2 border border-white/20 text-[#8FA3BF] text-xs rounded-xl hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
