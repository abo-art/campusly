'use client';

import React from 'react';
import { 
  LayoutGrid, 
  BookOpen, 
  Laptop, 
  Shirt, 
  Armchair, 
  Wrench, 
  Tag,
  Briefcase,
  GraduationCap,
  Bike,
  Palette,
  Megaphone
} from 'lucide-react';
import { ListingCategory, JobCategory } from '@/types';

interface CategoryChipsProps<T extends string> {
  categories: readonly T[];
  selectedCategory: T;
  onSelect: (category: T) => void;
  type?: 'listing' | 'job';
}

export function CategoryChips<T extends string>({
  categories,
  selectedCategory,
  onSelect,
  type = 'listing'
}: CategoryChipsProps<T>) {
  const getIcon = (cat: string) => {
    switch (cat) {
      case 'All': return <LayoutGrid className="w-3.5 h-3.5" />;
      case 'Books': return <BookOpen className="w-3.5 h-3.5" />;
      case 'Tech': return <Laptop className="w-3.5 h-3.5" />;
      case 'Clothing': return <Shirt className="w-3.5 h-3.5" />;
      case 'Furniture': return <Armchair className="w-3.5 h-3.5" />;
      case 'Services': return <Wrench className="w-3.5 h-3.5" />;
      case 'Tutoring': return <GraduationCap className="w-3.5 h-3.5" />;
      case 'Delivery': return <Bike className="w-3.5 h-3.5" />;
      case 'Design': return <Palette className="w-3.5 h-3.5" />;
      case 'IT': return <Laptop className="w-3.5 h-3.5" />;
      case 'Marketing': return <Megaphone className="w-3.5 h-3.5" />;
      case 'Other': return <Briefcase className="w-3.5 h-3.5" />;
      default: return <Tag className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-[#D4AF37] text-black font-bold shadow-[0_2px_10px_rgba(212,175,55,0.4)]'
                : 'border border-[#D4AF37]/50 text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10'
            }`}
          >
            {getIcon(cat)}
            <span>{cat}</span>
          </button>
        );
      })}
    </div>
  );
}
