'use client';

import React, { useState } from 'react';
import { Category, UserProfile, LostReport } from '../../lib/types';
import { FileQuestion, Send } from 'lucide-react';
import CampusZoneSelector from '../CampusZoneSelector';

interface ReportLostModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  currentUser: UserProfile;
  onSave: (report: Partial<LostReport>) => void;
}

export default function ReportLostModal({
  isOpen,
  onClose,
  categories,
  currentUser,
  onSave,
}: ReportLostModalProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 1);
  const [description, setDescription] = useState('');
  const [identifyingMark, setIdentifyingMark] = useState('');
  const [locationLost, setLocationLost] = useState('Library D');
  const [dateLost, setDateLost] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert('Please fill out the required fields.');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId);

    onSave({
      title,
      categoryId,
      categoryName: selectedCategory?.name,
      description,
      identifyingMark,
      locationLost,
      dateLost,
      status: 'OPEN',
      reportedByUserId: currentUser.id,
      reportedByName: currentUser.name,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#202020] rounded-xl max-w-lg w-full border border-[#D1D1D1] dark:border-[#383838] shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#0F6CBD] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileQuestion className="w-4 h-4" />
            <span className="font-semibold text-xs tracking-tight">Report Lost Item</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs text-[#242424] dark:text-[#E0E0E0]">
          <div>
            <label className="block text-[11px] font-semibold text-[#707070] dark:text-[#AAA] mb-1">
              Item Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Dell XPS Laptop, Grey Backpack"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full h-8 px-2.5 text-xs border border-[#D1D1D1] dark:border-[#383838] rounded bg-white dark:bg-[#282828] text-[#242424] dark:text-white focus:border-[#0F6CBD] outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#707070] dark:text-[#AAA] mb-1">
                Date Lost *
              </label>
              <input
                type="date"
                value={dateLost}
                onChange={(e) => setDateLost(e.target.value)}
                required
                className="w-full h-8 px-2.5 text-xs border border-[#D1D1D1] dark:border-[#383838] rounded bg-white dark:bg-[#282828] text-[#242424] dark:text-white focus:border-[#0F6CBD] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Interactive Campus Zone Selector */}
          <CampusZoneSelector
            selectedZone={locationLost}
            onSelectZone={setLocationLost}
          />

          <div>
            <label className="block text-[11px] font-semibold text-[#707070] dark:text-[#AAA] mb-1">
              Description *
            </label>
            <textarea
              rows={2}
              placeholder="Provide general description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-2 text-xs border border-[#D1D1D1] dark:border-[#383838] rounded bg-white dark:bg-[#282828] text-[#242424] dark:text-white focus:border-[#0F6CBD] outline-none resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#707070] dark:text-[#AAA] mb-1">
              Distinguishing Secret / Mark (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Specific sticker, initials, or pocket contents..."
              value={identifyingMark}
              onChange={(e) => setIdentifyingMark(e.target.value)}
              className="w-full h-8 px-2.5 text-xs border border-[#D1D1D1] dark:border-[#383838] rounded bg-white dark:bg-[#282828] text-[#242424] dark:text-white focus:border-[#0F6CBD] outline-none transition-colors"
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
              <Send className="w-3.5 h-3.5" />
              <span>Submit</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
