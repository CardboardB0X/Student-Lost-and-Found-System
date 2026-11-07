'use client';

import React, { useState } from 'react';
import { Category, StorageLocation, FoundItem } from '../../lib/types';
import { Plus, Archive, Lock } from 'lucide-react';
import CampusZoneSelector from '../CampusZoneSelector';

interface LogItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  locations: StorageLocation[];
  onSave: (item: Partial<FoundItem>) => void;
}

export default function LogItemModal({
  isOpen,
  onClose,
  categories,
  locations,
  onSave,
}: LogItemModalProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 1);
  const [storageLocationId, setStorageLocationId] = useState<number>(locations[0]?.id || 1);
  const [locationFound, setLocationFound] = useState('Hall 3B');
  const [dateFound, setDateFound] = useState(new Date().toISOString().split('T')[0]);
  const [brand, setBrand] = useState('');
  const [publicDescription, setPublicDescription] = useState('');
  const [privateVerificationDetails, setPrivateVerificationDetails] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedLocation = locations.find((l) => l.id === storageLocationId);
  const isHighValue = selectedCategory?.isHighValue || selectedLocation?.isSecureVault;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !locationFound || !publicDescription || !privateVerificationDetails) {
      alert('Please fill in all required fields.');
      return;
    }

    onSave({
      title,
      categoryId,
      categoryName: selectedCategory?.name,
      isHighValue,
      storageLocationId,
      storageLocationName: `${selectedLocation?.campusBuilding} - ${selectedLocation?.binNumber || selectedLocation?.roomOrLocker}`,
      isSecureVault: selectedLocation?.isSecureVault,
      locationFound,
      dateFound,
      brand,
      publicDescription,
      privateVerificationDetails,
      imageUrl: imageUrl || undefined,
      status: 'STORED',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#202020] rounded-xl max-w-xl w-full border border-[#D1D1D1] dark:border-[#383838] shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#0F6CBD] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Archive className="w-4 h-4" />
            <span className="font-semibold text-xs tracking-tight">Log Found Property</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs text-[#242424] dark:text-[#E0E0E0]">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#707070] dark:text-[#AAA] mb-1">
                Item Title *
              </label>
              <input
                type="text"
                placeholder="e.g. MacBook Air"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full h-8 px-2.5 text-xs border border-[#D1D1D1] dark:border-[#383838] rounded bg-white dark:bg-[#282828] text-[#242424] dark:text-white focus:border-[#0F6CBD] outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#707070] dark:text-[#AAA] mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full h-8 px-2 text-xs border border-[#D1D1D1] dark:border-[#383838] rounded bg-white dark:bg-[#282828] text-[#242424] dark:text-white focus:border-[#0F6CBD] outline-none transition-colors"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.isHighValue ? '(High-Value)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Campus Zone Selector */}
          <CampusZoneSelector
            selectedZone={locationFound}
            onSelectZone={setLocationFound}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#707070] dark:text-[#AAA] mb-1">
                Storage Bin *
              </label>
              <select
                value={storageLocationId}
                onChange={(e) => setStorageLocationId(Number(e.target.value))}
                className="w-full h-8 px-2 text-xs border border-[#D1D1D1] dark:border-[#383838] rounded bg-white dark:bg-[#282828] text-[#242424] dark:text-white focus:border-[#0F6CBD] outline-none transition-colors"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.binNumber || loc.roomOrLocker} {loc.isSecureVault ? '🔒' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#707070] dark:text-[#AAA] mb-1">
                Date Found *
              </label>
              <input
                type="date"
                value={dateFound}
                onChange={(e) => setDateFound(e.target.value)}
                required
                className="w-full h-8 px-2.5 text-xs border border-[#D1D1D1] dark:border-[#383838] rounded bg-white dark:bg-[#282828] text-[#242424] dark:text-white focus:border-[#0F6CBD] outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#707070] dark:text-[#AAA] mb-1">
              Public Description *
            </label>
            <textarea
              rows={2}
              placeholder="General details visible to public..."
              value={publicDescription}
              onChange={(e) => setPublicDescription(e.target.value)}
              required
              className="w-full p-2 text-xs border border-[#D1D1D1] dark:border-[#383838] rounded bg-white dark:bg-[#282828] text-[#242424] dark:text-white focus:border-[#0F6CBD] outline-none resize-none transition-colors"
            />
          </div>

          {/* Confidential Blind-Proof Key */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-300 dark:border-amber-900/60 space-y-1.5">
            <span className="text-[10px] font-bold text-amber-900 dark:text-amber-400 font-mono uppercase flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>Confidential Secret Key (Intake Truth) *</span>
            </span>
            <textarea
              rows={2}
              placeholder="e.g. Serial #, wallpaper, lock code hint, contents inside..."
              value={privateVerificationDetails}
              onChange={(e) => setPrivateVerificationDetails(e.target.value)}
              required
              className="w-full p-2 text-xs border border-amber-300 dark:border-amber-800 rounded bg-white dark:bg-[#1E1E1E] text-amber-950 dark:text-amber-200 focus:border-[#0F6CBD] outline-none font-mono transition-colors"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#EDEBE9] dark:border-[#2F2F2F]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-[#D1D1D1] dark:border-[#383838] rounded text-xs text-[#424242] dark:text-[#CCC] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#0F6CBD] hover:bg-[#115EA3] active:scale-95 text-white text-xs font-semibold rounded shadow-xs flex items-center space-x-1 transition-all duration-150"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
