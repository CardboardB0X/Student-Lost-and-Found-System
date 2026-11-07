'use client';

import React, { useState } from 'react';
import { FoundItem, Category } from '../lib/types';
import { 
  MapPin, 
  Calendar, 
  Tag, 
  ShieldCheck, 
  Lock, 
  Layers, 
  Sparkles,
  Inbox,
  LayoutGrid,
  List,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface PublicCatalogProps {
  items: FoundItem[];
  categories: Category[];
  searchQuery: string;
  onClaimItem: (item: FoundItem) => void;
  onOpenReportModal: () => void;
  onSelectItem: (item: FoundItem) => void;
}

export default function PublicCatalog({
  items,
  categories,
  searchQuery,
  onClaimItem,
  onOpenReportModal,
  onSelectItem,
}: PublicCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'code' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const toggleSort = (field: 'date' | 'code' | 'title') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredItems = items
    .filter((item) => {
      const isAvailable = item.status === 'STORED' || item.status === 'CLAIM_PENDING' || item.status === 'REGISTERED';
      if (!isAvailable) return false;

      if (selectedCategory !== 'ALL' && item.categoryId !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.publicDescription.toLowerCase().includes(q) ||
          item.locationFound.toLowerCase().includes(q) ||
          item.itemCode.toLowerCase().includes(q) ||
          (item.brand || '').toLowerCase().includes(q)
        );
      }

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.dateFound).getTime() - new Date(b.dateFound).getTime();
      } else if (sortBy === 'code') {
        comparison = a.itemCode.localeCompare(b.itemCode);
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Action & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#202020] p-3 rounded-lg border border-[#E0E0E0] dark:border-[#333333] shadow-xs">
        
        {/* Category Pills */}
        <div className="flex items-center flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 text-xs rounded-full font-medium transition-all duration-150 active:scale-95 ${
              selectedCategory === 'ALL'
                ? 'bg-[#0F6CBD] text-white shadow-xs'
                : 'bg-[#F5F5F5] dark:bg-[#2B2B2B] text-[#424242] dark:text-[#CCC] hover:bg-[#EBEBEB] dark:hover:bg-[#333]'
            }`}
          >
            All ({items.filter(i => i.status === 'STORED' || i.status === 'CLAIM_PENDING').length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-all duration-150 active:scale-95 ${
                selectedCategory === cat.id
                  ? 'bg-[#0F6CBD] text-white shadow-xs'
                  : 'bg-[#F5F5F5] dark:bg-[#2B2B2B] text-[#424242] dark:text-[#CCC] hover:bg-[#EBEBEB] dark:hover:bg-[#333]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* View Mode & Sort Controls */}
        <div className="flex items-center space-x-2">
          
          {/* Sort By Date Toggle */}
          <button
            onClick={() => toggleSort('date')}
            title="Sort by date"
            className="flex items-center space-x-1 px-2.5 py-1 text-xs rounded border border-[#E0E0E0] dark:border-[#383838] bg-[#FAFAFA] dark:bg-[#2A2A2A] text-[#555] dark:text-[#AAA] hover:bg-white dark:hover:bg-[#333] transition-colors"
          >
            <span>Date</span>
            {sortBy === 'date' && (
              sortOrder === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />
            )}
          </button>

          {/* View Toggle */}
          <div className="flex items-center space-x-1 border border-[#E0E0E0] dark:border-[#383838] rounded-md bg-[#FAFAFA] dark:bg-[#2A2A2A] p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid"
              className={`p-1 rounded text-xs transition-colors duration-150 ${
                viewMode === 'grid' ? 'bg-white dark:bg-[#383838] shadow-xs text-[#0F6CBD] dark:text-white' : 'text-[#616161] dark:text-[#888]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="List"
              className={`p-1 rounded text-xs transition-colors duration-150 ${
                viewMode === 'list' ? 'bg-white dark:bg-[#383838] shadow-xs text-[#0F6CBD] dark:text-white' : 'text-[#616161] dark:text-[#888]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Catalog Grid / List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#202020] rounded-lg border border-[#E0E0E0] dark:border-[#333333] space-y-3 animate-in fade-in duration-200">
          <Inbox className="w-8 h-8 text-[#A19F9D] mx-auto" />
          <button
            onClick={onOpenReportModal}
            className="px-3.5 py-1.5 bg-[#0F6CBD] text-white text-xs font-medium rounded-md hover:bg-[#115EA3] transition-all duration-150 active:scale-95 inline-flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Report Lost</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isPending = item.status === 'CLAIM_PENDING';
            return (
              <div 
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="bg-white dark:bg-[#242424] rounded-lg border border-[#EDEBE9] dark:border-[#333333] hover:border-[#C7DCF8] dark:hover:border-[#2886DE] shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between overflow-hidden group cursor-pointer"
              >
                <div>
                  {/* Media Banner */}
                  <div className="h-40 w-full bg-[#F3F2F1] dark:bg-[#1C1C1C] relative overflow-hidden flex items-center justify-center">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out" 
                      />
                    ) : (
                      <Layers className="w-10 h-10 text-[#C8C6C4] dark:text-[#444]" />
                    )}

                    {/* Status Pill */}
                    <div className="absolute top-2 left-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shadow-xs ${
                        isPending 
                          ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700'
                      }`}>
                        {isPending ? 'REVIEW' : 'AVAILABLE'}
                      </span>
                    </div>

                    {/* Code Badge */}
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                      {item.itemCode}
                    </div>

                    {item.isHighValue && (
                      <div className="absolute bottom-2 left-2 bg-red-600/90 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Body Details */}
                  <div className="p-3.5 space-y-2">
                    <h3 className="font-semibold text-xs text-[#242424] dark:text-white leading-snug line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="text-[11px] text-[#616161] dark:text-[#A0A0A0] line-clamp-2 leading-relaxed">
                      {item.publicDescription}
                    </p>

                    <div className="space-y-1 text-[11px] text-[#707070] dark:text-[#888] pt-1">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#A19F9D] flex-shrink-0" />
                        <span className="truncate">{item.locationFound}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#A19F9D] flex-shrink-0" />
                        <span>{item.dateFound}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-3.5 pt-0">
                  <div className="border-t border-[#F3F2F1] dark:border-[#2D2D2D] pt-2.5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#A19F9D]">
                      {item.categoryName}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClaimItem(item);
                      }}
                      className="px-2.5 py-1 bg-[#0F6CBD] hover:bg-[#115EA3] active:scale-95 text-white text-xs font-semibold rounded shadow-xs transition-all duration-150 flex items-center space-x-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Claim</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table */
        <div className="bg-white dark:bg-[#202020] rounded-lg border border-[#EDEBE9] dark:border-[#333333] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs text-[#242424] dark:text-[#E0E0E0]">
            <thead className="bg-[#F8F8F8] dark:bg-[#262626] border-b border-[#E0E0E0] dark:border-[#333333] text-[11px] font-semibold text-[#616161] dark:text-[#888]">
              <tr>
                <th className="py-2.5 px-3 cursor-pointer" onClick={() => toggleSort('code')}>
                  <div className="flex items-center space-x-1">
                    <span>Code</span>
                    {sortBy === 'code' && (sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="py-2.5 px-3 cursor-pointer" onClick={() => toggleSort('title')}>
                  <div className="flex items-center space-x-1">
                    <span>Item</span>
                    {sortBy === 'title' && (sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3 cursor-pointer" onClick={() => toggleSort('date')}>
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {sortBy === 'date' && (sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEBE9] dark:divide-[#2D2D2D]">
              {filteredItems.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => onSelectItem(item)}
                  className="hover:bg-[#F9FAFB] dark:hover:bg-[#2A2A2A] transition-colors duration-150 cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-mono font-medium text-[#0F6CBD] dark:text-[#479EF5]">{item.itemCode}</td>
                  <td className="py-2.5 px-3 font-semibold">{item.title}</td>
                  <td className="py-2.5 px-3 text-[#616161] dark:text-[#AAA]">{item.locationFound}</td>
                  <td className="py-2.5 px-3 text-[#616161] dark:text-[#AAA]">{item.dateFound}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold font-mono ${
                      item.status === 'CLAIM_PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClaimItem(item);
                      }}
                      className="px-2 py-0.5 bg-[#0F6CBD] hover:bg-[#115EA3] active:scale-95 text-white text-[11px] font-medium rounded transition-all duration-150"
                    >
                      Claim
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
