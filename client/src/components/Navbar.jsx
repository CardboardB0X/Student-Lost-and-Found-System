import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Plus, Search, PlusCircle, User, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const isHome = location.pathname === '/';
  const isNew = location.pathname === '/items/new';
  const isActivity = location.pathname === '/my-activity' || location.pathname === '/login';

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Logo / Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 py-1 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/25 group-hover:bg-blue-700 transition-colors">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900 tracking-tight">
              LostRadar
            </span>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* User Profile / Sign In Pill */}
            {isAuthenticated ? (
              <Link
                to="/my-activity"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                title="View My Activity"
              >
                <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline truncate max-w-[100px]">{user?.name}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Report Item */}
            <Link
              to="/items/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95"
              aria-label="Report lost or found item"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Report Item</span>
              <span className="sm:hidden">Report</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-3 left-4 right-4 z-50 max-w-xs mx-auto">
        <div className="bg-white/95 backdrop-blur-lg rounded-full px-6 py-1.5 flex items-center justify-around shadow-float border border-slate-200/80">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] rounded-full transition-colors ${
              isHome ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Search className="w-4 h-4 mb-0.5" />
            <span className="text-[11px]">Browse</span>
          </Link>

          <Link
            to="/items/new"
            className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] rounded-full transition-colors ${
              isNew ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <PlusCircle className="w-4 h-4 mb-0.5" />
            <span className="text-[11px]">Report</span>
          </Link>

          <Link
            to={isAuthenticated ? '/my-activity' : '/login'}
            className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] rounded-full transition-colors ${
              isActivity ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            {isAuthenticated ? (
              <UserCheck className="w-4 h-4 mb-0.5" />
            ) : (
              <User className="w-4 h-4 mb-0.5" />
            )}
            <span className="text-[11px]">{isAuthenticated ? 'Activity' : 'Account'}</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
