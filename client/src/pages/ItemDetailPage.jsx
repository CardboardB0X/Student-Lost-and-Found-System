import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building2,
  User,
  Phone,
  CheckCircle2,
  Trash2,
  Edit,
  X,
  Check,
  Sparkles,
  ChevronRight,
  Compass,
  HelpCircle
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../context/AuthContext';

export const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Claim Modal
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimantName, setClaimantName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [claimError, setClaimError] = useState(null);

  // Turn In Modal
  const [showOfficeModal, setShowOfficeModal] = useState(false);
  const [officeLocation, setOfficeLocation] = useState('Campus Security Office');
  const [submittingOffice, setSubmittingOffice] = useState(false);

  // Delete
  const [deleting, setDeleting] = useState(false);

  // Image Zoom Modal
  const [showImageZoom, setShowImageZoom] = useState(false);

  const fetchItem = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/items/${id}`);
      const contentType = res.headers.get('content-type') || '';
      let json = null;
      if (contentType.includes('application/json')) {
        json = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Status: ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(json?.message || 'Item not found');
      }

      if (json.success && json.data) {
        setItem(json.data);

        // Fetch matches for this item
        try {
          const matchRes = await fetch(`/api/items/${id}/matches`);
          const matchJson = await matchRes.json();
          if (matchJson.success) {
            setMatches(matchJson.data || []);
          }
        } catch {
          // Non-fatal
        }
      } else {
        throw new Error(json.message || 'Failed to load details');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  // Pre-fill user data when opening claim modal
  const openClaimModal = () => {
    if (user) {
      setClaimantName(user.name || '');
      setStudentId(user.studentId || '');
    }
    setShowClaimModal(true);
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!claimantName.trim() || !studentId.trim() || !verificationNotes.trim()) {
      setClaimError('Please fill in all claim fields.');
      return;
    }

    setSubmittingClaim(true);
    setClaimError(null);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          status: 'Claimed',
          custodyLocation: 'Claimed by Owner',
          claimRecord: {
            claimantName: claimantName.trim(),
            studentId: studentId.trim(),
            claimDate: new Date(),
            verificationNotes: verificationNotes.trim()
          }
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.message || 'Failed to file claim');
      }

      setItem(json.data);
      setShowClaimModal(false);
    } catch (err) {
      setClaimError(err.message || 'Error submitting claim.');
    } finally {
      setSubmittingClaim(false);
    }
  };

  const handleTurnIn = async (e) => {
    e.preventDefault();
    setSubmittingOffice(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          status: 'Turned In to Office',
          custodyLocation: officeLocation.trim() || 'Campus Office'
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.message || 'Failed to update custody');
      }

      setItem(json.data);
      setShowOfficeModal(false);
    } catch (err) {
      alert(err.message || 'Error updating custody.');
    } finally {
      setSubmittingOffice(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this record?')) return;
    setDeleting(true);
    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`/api/items/${id}`, { method: 'DELETE', headers });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.message || 'Delete failed');
      }
      navigate('/');
    } catch (err) {
      alert(err.message || 'Error deleting item.');
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSkeleton mode="detail" />;

  if (error || !item) {
    return (
      <div className="max-w-xl mx-auto space-y-4 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 min-h-[44px] px-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
        <ErrorAlert message={error} onRetry={fetchItem} />
      </div>
    );
  }

  const isClaimed = item.status === 'Claimed';
  const isLostReport = item.itemType === 'LOST';
  const formattedDate = item.dateFound
    ? new Date(item.dateFound).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-20 sm:pb-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            to={`/items/${item._id}/edit`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 rounded-lg shadow-xs hover:bg-slate-50 transition-colors"
          >
            <Edit className="w-3 h-3" />
            <span>Edit</span>
          </Link>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-600 bg-white border border-red-200 rounded-lg shadow-xs hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3 h-3" />
            <span>{deleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-card space-y-5">
        {/* Category & Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-blue-50 text-blue-700">
              {item.category}
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                isLostReport ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isLostReport ? 'Lost Report' : 'Found Item'}
            </span>
          </div>
          <StatusBadge status={item.status} size="lg" />
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
          {item.title}
        </h1>

        {/* Item Photo if available */}
        {item.imageUrl ? (
          <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 group">
            <img
              src={item.imageUrl}
              alt={item.title}
              onClick={() => setShowImageZoom(true)}
              className="w-full max-h-72 object-cover object-center cursor-zoom-in hover:scale-[1.01] transition-transform duration-200"
            />
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-xs rounded-md text-[10px] text-white font-medium pointer-events-none">
              Tap to enlarge
            </div>
          </div>
        ) : null}

        {/* Description */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {item.description}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 block font-medium">
                {isLostReport ? 'Lost Location' : 'Found Location'}
              </span>
              <span className="text-slate-800 font-bold text-sm">{item.locationFound}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 block font-medium">Date Reported</span>
              <span className="text-slate-800 font-bold text-sm">{formattedDate || 'N/A'}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 sm:col-span-2">
            <Building2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="flex-1 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block font-medium">Current Custody</span>
                <span className="text-slate-800 font-bold text-sm">
                  {item.custodyLocation || (isLostReport ? 'Lost by Owner' : 'With Finder')}
                </span>
              </div>
              {!isLostReport && item.status === 'Reported' && (
                <button
                  onClick={() => setShowOfficeModal(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 underline min-h-[44px] flex items-center"
                >
                  Turn in?
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Finder / Reporter Info */}
        <div className="bg-blue-50/60 rounded-xl p-3.5 border border-blue-100 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <User className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-medium text-slate-500">
              {isLostReport ? 'Reported by:' : 'Finder:'}
            </span>
            <span className="font-bold text-slate-900">{item.contactInfo?.founderName || 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Phone className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-medium text-slate-500">Contact:</span>
            <span className="font-bold text-slate-900">{item.contactInfo?.contactChannel || 'N/A'}</span>
          </div>
        </div>

        {/* Claimed Status / CTA */}
        {isClaimed && item.claimRecord ? (
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Claimed &amp; Reunited</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
              <div>
                <span className="text-slate-400 block">Owner / Claimant:</span>
                <span className="font-bold text-slate-900">{item.claimRecord.claimantName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">ID Number:</span>
                <span className="font-bold text-slate-900">{item.claimRecord.studentId}</span>
              </div>
            </div>
            {item.claimRecord.verificationNotes && (
              <p className="text-slate-600 italic pt-1 border-t border-emerald-100">
                "{item.claimRecord.verificationNotes}"
              </p>
            )}
          </div>
        ) : !isLostReport ? (
          <button
            onClick={openClaimModal}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all min-h-[48px]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Claim This Item</span>
          </button>
        ) : null}
      </div>

      {/* Smart Match Discovery Widget: If matches exist */}
      {matches.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-card space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {isLostReport ? 'Possible Found Matches' : 'Matching Lost Reports'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isLostReport
                  ? 'We detected matching found items in the same category or location!'
                  : 'Students have reported missing items matching this description.'}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {matches.map((m) => (
              <Link
                key={m._id}
                to={`/items/${m._id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {m.imageUrl ? (
                    <img
                      src={m.imageUrl}
                      alt={m.title}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-blue-100/60 text-blue-600 flex items-center justify-center shrink-0">
                      <Compass className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-slate-800 group-hover:text-blue-600 truncate block">
                      {m.title}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate block">
                      {m.locationFound} &bull; {m.custodyLocation || 'Active'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-blue-600 shrink-0 pl-2">
                  <span>View</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Claim Item</h3>
                {isAuthenticated && (
                  <span className="text-[10px] text-emerald-600 font-medium">
                    Verified Student ID auto-filled
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowClaimModal(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {claimError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {claimError}
              </div>
            )}

            <form onSubmit={handleClaim} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Claimant Name
                </label>
                <input
                  type="text"
                  required
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder="e.g. Juan Dela Cruz"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student / Staff ID Number
                </label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 2024-10023"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Proof of Ownership (Required)
                </label>
                <textarea
                  required
                  rows="2"
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Describe unique scratches, lockscreen wallpaper, passcode, contents..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white min-h-[44px]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={submittingClaim}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl min-h-[44px] disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{submittingClaim ? 'Submitting...' : 'Confirm Claim'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="px-4 py-2.5 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-100 min-h-[44px]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Turn In Modal */}
      {showOfficeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Turn in to Office</h3>
              <button
                onClick={() => setShowOfficeModal(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTurnIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Holding Office / Desk
                </label>
                <input
                  type="text"
                  required
                  value={officeLocation}
                  onChange={(e) => setOfficeLocation(e.target.value)}
                  placeholder="e.g. Campus Security Office"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white min-h-[44px]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={submittingOffice}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl min-h-[44px] disabled:opacity-50"
                >
                  <span>{submittingOffice ? 'Saving...' : 'Update'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowOfficeModal(false)}
                  className="px-4 py-2.5 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-100 min-h-[44px]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full-Screen Image Zoom Modal */}
      {showImageZoom && item.imageUrl && (
        <div
          onClick={() => setShowImageZoom(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl w-full max-h-[85vh] flex flex-col items-center">
            <button
              onClick={() => setShowImageZoom(false)}
              className="absolute -top-11 right-0 text-white/80 hover:text-white p-2 rounded-full"
              aria-label="Close photo preview"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={item.imageUrl}
              alt={item.title}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailPage;
