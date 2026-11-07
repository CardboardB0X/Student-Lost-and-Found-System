import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  X,
  Plus,
  RefreshCw,
  LayoutGrid,
  CreditCard,
  Smartphone,
  Key,
  Coffee,
  Shirt,
  BookOpen,
  Package,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Compass,
  HelpCircle
} from 'lucide-react';
import ItemCard from '../components/ItemCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorAlert from '../components/ErrorAlert';

const CATEGORIES = [
  { label: 'All', icon: LayoutGrid },
  { label: 'ID & Cards', icon: CreditCard },
  { label: 'Electronics', icon: Smartphone },
  { label: 'Keys & Wallets', icon: Key },
  { label: 'Bottles & Tumblers', icon: Coffee },
  { label: 'Bags & Apparel', icon: Shirt },
  { label: 'Books & Stationery', icon: BookOpen },
  { label: 'Others', icon: Package }
];

const STATUSES = ['All', 'Reported', 'Turned In to Office', 'Claimed'];

export const ItemListPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [itemTypeTab, setItemTypeTab] = useState('FOUND'); // 'FOUND', 'LOST', 'ALL'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Carousel ref for scroll
  const categoryScrollRef = useRef(null);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (itemTypeTab !== 'ALL') {
        params.append('itemType', itemTypeTab);
      }
      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (selectedStatus && selectedStatus !== 'All') {
        params.append('status', selectedStatus);
      }
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`/api/items${queryString}`);

      const contentType = response.headers.get('content-type') || '';
      let json = null;
      if (contentType.includes('application/json')) {
        json = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(json?.message || `Failed to fetch items (${response.status})`);
      }

      if (json.success) {
        setItems(json.data || []);
      } else {
        throw new Error(json.message || 'Error fetching records');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }, [itemTypeTab, selectedCategory, selectedStatus, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchItems]);

  const handleClear = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setItemTypeTab('FOUND');
  };

  const hasFilter = searchTerm !== '' || selectedCategory !== 'All' || selectedStatus !== 'All' || itemTypeTab !== 'FOUND';

  return (
    <div className="space-y-3.5 pb-20 sm:pb-8">
      {/* Dual Mode Switcher: Found Items vs Lost Inquiries */}
      <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1 shadow-2xs">
        <button
          onClick={() => setItemTypeTab('FOUND')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all min-h-[38px] ${
            itemTypeTab === 'FOUND'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Found Belongings</span>
        </button>

        <button
          onClick={() => setItemTypeTab('LOST')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all min-h-[38px] ${
            itemTypeTab === 'LOST'
              ? 'bg-white text-rose-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Lost Reports</span>
        </button>

        <button
          onClick={() => setItemTypeTab('ALL')}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all min-h-[38px] hidden sm:block ${
            itemTypeTab === 'ALL'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={itemTypeTab === 'LOST' ? 'Search lost reports, missing items...' : 'Search found belongings, locations...'}
          className="w-full pl-10 pr-9 py-2.5 bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200/90 shadow-card focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all min-h-[42px]"
          aria-label="Search items"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 min-w-[36px] min-h-[36px] justify-center"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Swipeable Category Carousel Section */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Categories
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => scrollCategories('left')}
              className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center shadow-2xs hover:bg-slate-50 active:scale-95 transition-all"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => scrollCategories('right')}
              className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center shadow-2xs hover:bg-slate-50 active:scale-95 transition-all"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={categoryScrollRef}
            className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 -mx-1 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`snap-start shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="whitespace-nowrap">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Filter Tabs & Reset */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {STATUSES.map((st) => {
            const isSel = selectedStatus === st;
            let displayLabel = st;
            if (st === 'Turned In to Office') displayLabel = 'In Office';
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  isSel
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>

        {hasFilter && (
          <button
            onClick={handleClear}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2 flex items-center shrink-0"
          >
            Reset
          </button>
        )}
      </div>

      {/* Items Count & Refresh */}
      <div className="flex items-center justify-between px-0.5 pt-0.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {!loading && !error && `${items.length} ${itemTypeTab === 'LOST' ? 'lost report' : 'found item'}${items.length === 1 ? '' : 's'}`}
        </span>
        <button
          onClick={fetchItems}
          disabled={loading}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 px-1.5 py-1 rounded-md"
          aria-label="Refresh items list"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* UI States */}
      {error && <ErrorAlert message={error} onRetry={fetchItems} />}

      {loading && !error && <LoadingSkeleton count={6} />}

      {!loading && !error && items.length === 0 && (
        <div className="bg-white rounded-2xl p-7 text-center border border-slate-200/80 shadow-card max-w-sm mx-auto space-y-3 my-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">
            {itemTypeTab === 'LOST' ? 'No lost reports logged' : 'No found items recorded'}
          </h3>
          <p className="text-xs text-slate-500">
            {hasFilter
              ? 'Try adjusting your search or category filter.'
              : itemTypeTab === 'LOST'
              ? 'Misplaced an item on campus? File a report so finders can notify you.'
              : 'No items currently awaiting claim.'}
          </p>
          <div className="pt-1 flex items-center justify-center gap-2">
            {hasFilter && (
              <button
                onClick={handleClear}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
              >
                Reset
              </button>
            )}
            <Link
              to="/items/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{itemTypeTab === 'LOST' ? 'Report Lost Item' : 'Report Found Item'}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Populated Grid */}
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemListPage;
