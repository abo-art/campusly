'use client';

import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle, 
  Trash2,
  GraduationCap,
  Bike,
  Palette,
  Laptop,
  Megaphone,
  Briefcase
} from 'lucide-react';
import { Job } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  onOpenChat: (otherUserId: string, otherUserName: string, title: string) => void;
}

export function JobDetailModal({ job, onClose, onOpenChat }: JobDetailModalProps) {
  const { currentUser } = useAuth();
  const { deleteJob } = useData();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!job) return null;

  const isOwner = currentUser?.id === job.posterId;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tutoring': return <GraduationCap className="w-12 h-12 text-[#D4AF37]" />;
      case 'Delivery': return <Bike className="w-12 h-12 text-[#D4AF37]" />;
      case 'Design': return <Palette className="w-12 h-12 text-[#D4AF37]" />;
      case 'IT': return <Laptop className="w-12 h-12 text-[#D4AF37]" />;
      case 'Marketing': return <Megaphone className="w-12 h-12 text-[#D4AF37]" />;
      default: return <Briefcase className="w-12 h-12 text-[#D4AF37]" />;
    }
  };

  const handleDelete = async () => {
    await deleteJob(job.id);
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
          <div className="relative w-full h-40 bg-gradient-to-br from-[#1A3560] to-[#0B1220] rounded-xl flex flex-col items-center justify-center border border-[#1E3A5F]/60">
            {getCategoryIcon(job.category)}
            <span className="text-xs uppercase font-bold tracking-widest text-[#8FA3BF] mt-2">
              {job.category}
            </span>
          </div>

          {/* Title & Pay */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">
                {job.title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-[#8FA3BF] mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{job.location}</span>
              </div>
            </div>

            <div className="text-right whitespace-nowrap">
              <span className="text-2xl font-black text-[#D4AF37] tracking-tight">
                ₸{Number(job.price).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quick specs */}
          <div className="grid grid-cols-2 gap-2 text-xs text-[#8FA3BF] bg-[#1A3560]/30 border border-[#1E3A5F] rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <div>
                <span className="block text-[10px] uppercase text-[#8FA3BF]">Duration</span>
                <span className="font-semibold text-white">{job.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <div>
                <span className="block text-[10px] uppercase text-[#8FA3BF]">Location</span>
                <span className="font-semibold text-white">{job.location}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1E3A5F]/60" />

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8FA3BF] mb-1.5">
              Task Details
            </h4>
            <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Poster Card */}
          <div className="campus-glass-card rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1A3560] flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-[#8FA3BF] block">Posted by</span>
                <span className="text-sm font-semibold text-white">{job.posterName}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#D4AF37]">
              <CheckCircle className="w-4 h-4" />
              <span>Verified Student</span>
            </div>
          </div>

          {/* Action button */}
          {isOwner ? (
            <div className="pt-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Job Posting</span>
              </button>

              {showDeleteConfirm && (
                <div className="mt-2 p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-center space-y-2">
                  <p className="text-xs text-red-200">
                    Are you sure you want to remove this job posting?
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
              <button
                onClick={() => {
                  onClose();
                  onOpenChat(job.posterId, job.posterName, `Job: ${job.title}`);
                }}
                className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-black" />
                <span>Message Poster</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
