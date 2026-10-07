'use client';

import React from 'react';
import { 
  GraduationCap, 
  Bike, 
  Palette, 
  Laptop, 
  Megaphone, 
  Briefcase, 
  Clock, 
  MapPin 
} from 'lucide-react';
import { Job } from '@/types';

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
}

export function JobCard({ job, onSelect }: JobCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tutoring': return <GraduationCap className="w-5 h-5 text-[#D4AF37]" />;
      case 'Delivery': return <Bike className="w-5 h-5 text-[#D4AF37]" />;
      case 'Design': return <Palette className="w-5 h-5 text-[#D4AF37]" />;
      case 'IT': return <Laptop className="w-5 h-5 text-[#D4AF37]" />;
      case 'Marketing': return <Megaphone className="w-5 h-5 text-[#D4AF37]" />;
      default: return <Briefcase className="w-5 h-5 text-[#D4AF37]" />;
    }
  };

  const formattedDate = () => {
    try {
      const d = new Date(job.createdAt);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div 
      onClick={() => onSelect(job)}
      className="campus-glass-card rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-[0_8px_20px_rgba(0,0,0,0.5)] flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A3560] flex items-center justify-center shrink-0">
              {getCategoryIcon(job.category)}
            </div>
            <div>
              <h3 className="text-white font-semibold text-base line-clamp-1 hover:text-[#D4AF37] transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center gap-1 text-xs text-[#8FA3BF] mt-0.5">
                <MapPin className="w-3 h-3 text-[#D4AF37]" />
                <span className="line-clamp-1">{job.location}</span>
              </div>
            </div>
          </div>

          <span className="text-[#D4AF37] font-bold text-lg whitespace-nowrap">
            ₸{Number(job.price).toLocaleString()}
          </span>
        </div>

        <div className="my-3 border-t border-[#1E3A5F]/60" />

        <p className="text-xs text-[#8FA3BF] line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#8FA3BF]">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{job.duration}</span>
        </div>
        <span>{formattedDate()}</span>
      </div>
    </div>
  );
}
