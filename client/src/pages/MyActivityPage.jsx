import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, LogOut, Package, CheckCircle2, AlertCircle, Plus, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

export const MyActivityPage = () => {
  const navigate = useNavigate();
  const { user, token, logout, isAuthenticated } = useAuth();

  const [activity, setActivity] = useState({ reported: [], claimed: [] });
  const [activeTab, setActiveTab] = useState('reported'); // 'reported' or 'claimed'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivity = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/items/my/activity', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActivity(data.data || { reported: [], claimed: [] });
      } else {
        throw new Error(data.message || 'Could not load your activity');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchActivity();
    }
  }, [isAuthenticated, navigate, fetchActivity]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentList = activeTab === 'reported' ? activity.reported : activity.claimed;

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-20 sm:pb-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Radar</span>
        </Link>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-lg bg-white border border-red-200 shadow-xs hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{user?.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ID: <span className="font-mono font-semibold text-slate-700">{user?.studentId}</span> &bull; {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Segmented Activity Switcher */}
      <div className="bg-slate-200/70 p-1 rounded-xl flex items-center gap-1">
        <button
          onClick={() => setActiveTab('reported')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'reported'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Items I Reported ({activity.reported.length})
        </button>
        <button
          onClick={() => setActiveTab('claimed')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'claimed'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Claims ({activity.claimed.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs">
          {error}
        </div>
      ) : currentList.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 shadow-card space-y-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">
            {activeTab === 'reported' ? 'No items reported yet' : 'No claims filed yet'}
          </h3>
          <p className="text-xs text-slate-500">
            {activeTab === 'reported'
              ? 'Found or lost a belonging? Log it on the campus radar.'
              : 'Items you successfully claim will be archived here.'}
          </p>
          {activeTab === 'reported' && (
            <Link
              to="/items/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg mt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Item</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyActivityPage;
