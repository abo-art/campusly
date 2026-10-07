'use client';

import React, { useState } from 'react';
import { X, Calendar, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequireAuth?: () => void;
}

export function CreateEventModal({ isOpen, onClose, onRequireAuth }: CreateEventModalProps) {
  const { currentUser } = useAuth();
  const { createEvent } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      if (onRequireAuth) onRequireAuth();
      return;
    }

    if (!title.trim() || !description.trim() || !dateStr || !time.trim() || !location.trim()) {
      setError('Please fill in all fields with valid information.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createEvent({
        title: title.trim(),
        description: description.trim(),
        date: new Date(dateStr),
        time: time.trim(),
        location: location.trim(),
        organizerId: currentUser.id,
        organizerName: currentUser.name
      });
      // Reset & close
      setTitle('');
      setDescription('');
      setDateStr('');
      setTime('');
      setLocation('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-[#0E1A2E] border border-[#1E3A5F] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 bg-[#0B1220] border-b border-[#1E3A5F] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1A3560] flex items-center justify-center text-[#D4AF37]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Announce Event</h2>
              <p className="text-[11px] text-[#8FA3BF]">Share meetups, hackathons, and gatherings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8FA3BF] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-[#8FA3BF] uppercase tracking-wider block mb-1.5">
              Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI & Robotics Campus Workshop"
              className="w-full bg-[#1A3560]/30 border border-[#1E3A5F] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37] placeholder-[#8FA3BF]/50"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#8FA3BF] uppercase tracking-wider block mb-1.5">
              Event Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will happen? Is registration or preparation needed?"
              rows={3}
              className="w-full bg-[#1A3560]/30 border border-[#1E3A5F] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37] placeholder-[#8FA3BF]/50"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#8FA3BF] uppercase tracking-wider block mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full bg-[#1A3560]/30 border border-[#1E3A5F] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#8FA3BF] uppercase tracking-wider block mb-1.5">
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 18:30"
                className="w-full bg-[#1A3560]/30 border border-[#1E3A5F] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37] placeholder-[#8FA3BF]/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#8FA3BF] uppercase tracking-wider block mb-1.5">
              Campus Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Atrium Main Stage / Auditorium"
              className="w-full bg-[#1A3560]/30 border border-[#1E3A5F] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37] placeholder-[#8FA3BF]/50"
              required
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(212,175,55,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isSubmitting ? 'Announcing...' : 'Announce Event'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
