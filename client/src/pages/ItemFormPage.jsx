import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Camera, Upload, Link as LinkIcon, X, Compass, HelpCircle } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'ID & Cards',
  'Electronics',
  'Keys & Wallets',
  'Bottles & Tumblers',
  'Bags & Apparel',
  'Books & Stationery',
  'Others'
];

const STATUSES = [
  'Reported',
  'Turned In to Office',
  'Claimed'
];

export const ItemFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const isEditMode = Boolean(id);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    itemType: 'FOUND', // 'FOUND' or 'LOST'
    description: '',
    locationFound: '',
    dateFound: new Date().toISOString().split('T')[0],
    status: 'Reported',
    custodyLocation: 'With Finder',
    imageUrl: '',
    founderName: '',
    contactChannel: ''
  });

  const [imageInputMode, setImageInputMode] = useState('upload');
  const [loadingInitial, setLoadingInitial] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  // Auto-populate user contact info if logged in (for new items)
  useEffect(() => {
    if (!isEditMode && user) {
      setFormData((prev) => ({
        ...prev,
        founderName: prev.founderName || user.name || '',
        contactChannel: prev.contactChannel || user.email || ''
      }));
    }
  }, [isEditMode, user]);

  useEffect(() => {
    if (!isEditMode) return;

    let isMounted = true;
    const loadItem = async () => {
      setLoadingInitial(true);
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
          throw new Error(json?.message || 'Failed to load item for editing');
        }

        if (json.success && json.data && isMounted) {
          const item = json.data;
          setFormData({
            title: item.title || '',
            category: item.category || CATEGORIES[0],
            itemType: item.itemType || 'FOUND',
            description: item.description || '',
            locationFound: item.locationFound || '',
            dateFound: item.dateFound ? new Date(item.dateFound).toISOString().split('T')[0] : '',
            status: item.status || 'Reported',
            custodyLocation: item.custodyLocation || 'With Finder',
            imageUrl: item.imageUrl || '',
            founderName: item.contactInfo?.founderName || '',
            contactChannel: item.contactInfo?.contactChannel || ''
          });
          if (item.imageUrl && item.imageUrl.startsWith('http')) {
            setImageInputMode('url');
          }
        }
      } catch (err) {
        if (isMounted) setFormErrors([err.message]);
      } finally {
        if (isMounted) setLoadingInitial(false);
      }
    };

    loadItem();
    return () => {
      isMounted = false;
    };
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WEBP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 900;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setFormData((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors([]);

    const errors = [];
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters.');
    }
    if (!formData.category) {
      errors.push('Category is required.');
    }
    if (!formData.description.trim()) {
      errors.push('Description is required.');
    }
    if (!formData.locationFound.trim()) {
      errors.push('Location is required.');
    }
    if (!formData.founderName.trim()) {
      errors.push('Name is required.');
    }
    if (!formData.contactChannel.trim()) {
      errors.push('Contact info is required.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        itemType: formData.itemType,
        description: formData.description.trim(),
        locationFound: formData.locationFound.trim(),
        dateFound: formData.dateFound ? new Date(formData.dateFound) : new Date(),
        status: formData.status,
        custodyLocation: formData.custodyLocation.trim() || (formData.itemType === 'LOST' ? 'Lost by Owner' : 'With Finder'),
        imageUrl: formData.imageUrl.trim() || '',
        contactInfo: {
          founderName: formData.founderName.trim(),
          contactChannel: formData.contactChannel.trim()
        }
      };

      const url = isEditMode ? `/api/items/${id}` : '/api/items';
      const method = isEditMode ? 'PUT' : 'POST';

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get('content-type') || '';
      let json = null;
      if (contentType.includes('application/json')) {
        json = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `Status: ${response.status}`);
      }

      if (!response.ok || !json.success) {
        if (json?.errors && Array.isArray(json.errors)) {
          setFormErrors(json.errors);
        } else {
          setFormErrors([json?.message || 'Operation failed.']);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const redirectId = json.data?._id || id;
      navigate(`/items/${redirectId}`);
    } catch (err) {
      setFormErrors([err.message || 'Error submitting item.']);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) return <LoadingSkeleton mode="detail" />;

  const isLostReport = formData.itemType === 'LOST';

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-20 sm:pb-8">
      {/* Back button */}
      <div>
        <Link
          to={isEditMode ? `/items/${id}` : '/'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-card space-y-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isEditMode ? 'Edit Record' : isLostReport ? 'Report a Lost Item' : 'Report a Found Belonging'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isLostReport
              ? 'Tell campus finders and guards what you are searching for.'
              : 'Enter item details so the rightful student can identify and claim it.'}
          </p>
        </div>

        {/* Dual Mode Selector (Found vs Lost) */}
        {!isEditMode && (
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setFormData((p) => ({
                  ...p,
                  itemType: 'FOUND',
                  custodyLocation: p.custodyLocation === 'Lost by Owner' ? 'With Finder' : p.custodyLocation
                }))
              }
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                formData.itemType === 'FOUND'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>I Found an Item</span>
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((p) => ({
                  ...p,
                  itemType: 'LOST',
                  custodyLocation: p.custodyLocation === 'With Finder' ? 'Lost by Owner' : p.custodyLocation
                }))
              }
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                formData.itemType === 'LOST'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>I Lost an Item</span>
            </button>
          </div>
        )}

        {formErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-red-900">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Please check the fields:</span>
            </div>
            <ul className="list-disc pl-5 space-y-0.5">
              {formErrors.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-xs font-bold text-slate-700 mb-1">
              {isLostReport ? 'What did you lose?' : 'Item Name'} <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder={isLostReport ? 'e.g. Apple iPad Air with Blue Folio Cover' : 'e.g. Student ID, Hydro Flask, Wallet...'}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="category" className="block text-xs font-bold text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white min-h-[44px]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-xs font-bold text-slate-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white min-h-[44px]"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-bold text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder={isLostReport ? 'Color, brand, key marks, wallpaper, identifying details...' : 'Color, brand, key marks, distinguishing features...'}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white min-h-[44px]"
            />
          </div>

          {/* Image Upload / Capture Section */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Photo (Optional)
              </label>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    imageInputMode === 'upload' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Upload / Camera
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    imageInputMode === 'url' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {formData.imageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      Photo attached
                    </span>
                    <span className="text-[11px] text-emerald-600 font-medium block">
                      Ready to submit
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="w-8 h-8 rounded-lg bg-slate-200/80 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-slate-600 shrink-0 transition-colors"
                  aria-label="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                {imageInputMode === 'upload' ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      id="file-upload-input"
                    />
                    <label
                      htmlFor="file-upload-input"
                      className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/30 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Camera className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        {isLostReport ? 'Upload reference photo of device' : 'Take photo or upload from device'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        PNG, JPG, WEBP (auto-compressed)
                      </span>
                    </label>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="Paste image link (e.g. https://...)"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white min-h-[44px]"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="locationFound" className="block text-xs font-bold text-slate-700 mb-1">
                {isLostReport ? 'Where was it lost?' : 'Location Found'} <span className="text-red-500">*</span>
              </label>
              <input
                id="locationFound"
                name="locationFound"
                type="text"
                required
                value={formData.locationFound}
                onChange={handleChange}
                placeholder="e.g. Library 2nd Floor, Room 302"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="dateFound" className="block text-xs font-bold text-slate-700 mb-1">
                {isLostReport ? 'Date Lost' : 'Date Found'} <span className="text-red-500">*</span>
              </label>
              <input
                id="dateFound"
                name="dateFound"
                type="date"
                required
                value={formData.dateFound}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="custodyLocation" className="block text-xs font-bold text-slate-700 mb-1">
              {isLostReport ? 'Current Status' : 'Where is the item right now?'}
            </label>
            <input
              id="custodyLocation"
              name="custodyLocation"
              type="text"
              value={formData.custodyLocation}
              onChange={handleChange}
              placeholder={isLostReport ? 'Lost by Owner' : 'e.g. With Finder, or Security Office Desk'}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label htmlFor="founderName" className="block text-xs font-bold text-slate-700 mb-1">
                {isLostReport ? 'Your Name' : 'Finder Name'} <span className="text-red-500">*</span>
              </label>
              <input
                id="founderName"
                name="founderName"
                type="text"
                required
                value={formData.founderName}
                onChange={handleChange}
                placeholder="e.g. Maria Santos"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="contactChannel" className="block text-xs font-bold text-slate-700 mb-1">
                Contact Channel (Email / Phone) <span className="text-red-500">*</span>
              </label>
              <input
                id="contactChannel"
                name="contactChannel"
                type="text"
                required
                value={formData.contactChannel}
                onChange={handleChange}
                placeholder="Phone or email"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white min-h-[44px]"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 min-h-[44px] transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : isEditMode ? 'Save Changes' : isLostReport ? 'Broadcast Lost Report' : 'Submit Found Item'}</span>
            </button>

            <Link
              to={isEditMode ? `/items/${id}` : '/'}
              className="px-5 py-3 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100 min-h-[44px] flex items-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemFormPage;
