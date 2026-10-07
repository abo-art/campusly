'use client';

import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Clock, 
  Tag, 
  CheckCircle, 
  Pencil, 
  Trash2, 
  User, 
  Check, 
  RotateCcw,
  BookOpen,
  Laptop,
  Shirt,
  Armchair,
  Wrench
} from 'lucide-react';
import { Listing, ListingCategory } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  onOpenChat: (listing: Listing) => void;
}

export function ListingDetailModal({ listing, onClose, onOpenChat }: ListingDetailModalProps) {
  const { currentUser } = useAuth();
  const { updateListing, deleteListing, toggleListingSold } = useData();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState<ListingCategory>('Other');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!listing) return null;

  const isOwner = currentUser?.id === listing.sellerId;

  const startEdit = () => {
    setEditTitle(listing.title);
    setEditDesc(listing.description);
    setEditPrice(String(listing.price));
    setEditCategory(listing.category);
    setIsEditing(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDesc.trim() || isNaN(Number(editPrice))) return;
    setIsSaving(true);
    try {
      await updateListing(listing.id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
        price: Number(editPrice),
        category: editCategory
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    await deleteListing(listing.id);
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Books': return <BookOpen className="w-12 h-12 text-[#D4AF37]" />;
      case 'Tech': return <Laptop className="w-12 h-12 text-[#D4AF37]" />;
      case 'Clothing': return <Shirt className="w-12 h-12 text-[#D4AF37]" />;
      case 'Furniture': return <Armchair className="w-12 h-12 text-[#D4AF37]" />;
      case 'Services': return <Wrench className="w-12 h-12 text-[#D4AF37]" />;
      default: return <Tag className="w-12 h-12 text-[#D4AF37]" />;
    }
  };

  const categories: ListingCategory[] = ['Books', 'Tech', 'Clothing', 'Furniture', 'Services', 'Other'];

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
            {getCategoryIcon(listing.category)}
            <span className="text-xs uppercase font-bold tracking-widest text-[#8FA3BF] mt-2">
              {listing.category}
            </span>

            {listing.isSold && (
              <span className="absolute top-3 left-3 bg-[#D4AF37] text-black font-black text-xs tracking-wider px-3 py-1 rounded shadow-md">
                SOLD
              </span>
            )}
          </div>

          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSaveEdit} className="space-y-3.5 pt-2">
              <div>
                <label className="text-[11px] font-bold text-[#8FA3BF] uppercase tracking-wider block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#1A3560]/30 border border-[#1E3A5F] rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8FA3BF] uppercase tracking-wider block mb-1">
                  Description
                </label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-[#1A3560]/30 border border-[#1E3A5F] rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8FA3BF] uppercase tracking-wider block mb-1">
                  Price (₸)
                </label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full bg-[#1A3560]/30 border border-[#1E3A5F] rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8FA3BF] uppercase tracking-wider block mb-1">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setEditCategory(cat)}
                      className={`px-3 py-1 text-xs rounded-full border cursor-pointer ${
                        editCategory === cat
                          ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]'
                          : 'border-[#1E3A5F] text-[#8FA3BF] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-[#D4AF37] text-black font-bold text-xs rounded-xl hover:bg-[#b8952b] transition-colors cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 border border-[#1E3A5F] text-[#8FA3BF] hover:text-white text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Details View */
            <div className="space-y-4">
              {/* Title & Price */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">
                    {listing.title}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-[#8FA3BF] mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Listed on campus</span>
                  </div>
                </div>

                <div className="text-right whitespace-nowrap">
                  <span className={`text-2xl font-black tracking-tight ${listing.isSold ? 'text-[#8FA3BF] line-through' : 'text-[#D4AF37]'}`}>
                    ₸{Number(listing.price).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#1E3A5F]/60" />

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8FA3BF] mb-1.5">
                  About this item
                </h4>
                <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Seller Card */}
              <div className="campus-glass-card rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1A3560] flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#8FA3BF] block">Seller</span>
                    <span className="text-sm font-semibold text-white">{listing.sellerName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#D4AF37]">
                  <CheckCircle className="w-4 h-4" />
                  <span>Verified Student</span>
                </div>
              </div>

              {/* Owner actions or Contact button */}
              {isOwner ? (
                <div className="space-y-2 pt-2">
                  {/* Mark as sold / available */}
                  <button
                    onClick={() => toggleListingSold(listing.id)}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      listing.isSold
                        ? 'border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10'
                        : 'bg-[#D4AF37] text-black hover:bg-[#b8952b] shadow-[0_2px_10px_rgba(212,175,55,0.4)]'
                    }`}
                  >
                    {listing.isSold ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        <span>Mark as Available</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Mark as Sold</span>
                      </>
                    )}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={startEdit}
                      className="flex-1 py-2.5 bg-[#1A3560]/50 hover:bg-[#1A3560] text-white border border-[#1E3A5F] rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  {showDeleteConfirm && (
                    <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-center space-y-2">
                      <p className="text-xs text-red-200">
                        Are you sure you want to permanently delete this listing?
                      </p>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={handleDelete}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-3 py-1 border border-white/20 text-[#8FA3BF] text-xs rounded-lg hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="pt-2">
                  {!listing.isSold ? (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenChat(listing);
                      }}
                      className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 fill-black" />
                      <span>Message Seller</span>
                    </button>
                  ) : (
                    <div className="w-full py-3 text-center text-xs text-[#8FA3BF] bg-white/5 rounded-xl border border-white/10">
                      This item has been marked as sold.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
