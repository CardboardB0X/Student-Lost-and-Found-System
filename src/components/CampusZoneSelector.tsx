'use client';

import React from 'react';
import { 
  Building2, 
  BookOpen, 
  Landmark, 
  Dumbbell, 
  Bus, 
  Coffee,
  Check
} from 'lucide-react';

export interface CampusZone {
  id: string;
  name: string;
  icon: React.ElementType;
}

export const CAMPUS_ZONES: CampusZone[] = [
  { id: 'hall_3b', name: 'Hall 3B', icon: Landmark },
  { id: 'library_d', name: 'Library D', icon: BookOpen },
  { id: 'center_a', name: 'Center A', icon: Building2 },
  { id: 'hub_c', name: 'Hub C', icon: Coffee },
  { id: 'gym', name: 'Gym Court 2', icon: Dumbbell },
  { id: 'transit', name: 'Transit Stop', icon: Bus },
];

interface CampusZoneSelectorProps {
  selectedZone: string;
  onSelectZone: (zoneName: string) => void;
}

export default function CampusZoneSelector({
  selectedZone,
  onSelectZone,
}: CampusZoneSelectorProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold text-[#707070] dark:text-[#AAA]">
        Campus Zone *
      </label>
      <div className="grid grid-cols-3 gap-2">
        {CAMPUS_ZONES.map((zone) => {
          const Icon = zone.icon;
          const isSelected = selectedZone === zone.name;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onSelectZone(zone.name)}
              className={`p-2 rounded-lg border text-left flex items-center space-x-2 transition-all duration-150 active:scale-95 ${
                isSelected 
                  ? 'bg-[#EBF3FC] dark:bg-[#1B2A3D] border-[#0F6CBD] dark:border-[#2886DE] text-[#0F6CBD] dark:text-[#479EF5] font-semibold shadow-xs' 
                  : 'bg-white dark:bg-[#282828] border-gray-200 dark:border-[#383838] text-[#424242] dark:text-[#CCC] hover:bg-gray-50 dark:hover:bg-[#303030]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-[11px] truncate">{zone.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
