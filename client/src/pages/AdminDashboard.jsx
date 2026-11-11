import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, UtensilsCrossed, Tag, Settings, QrCode, LogOut,
  Plus, Pencil, Trash2, Eye, EyeOff, Star, Flame, Upload, X, ChevronDown,
  CheckCircle, AlertCircle, Search, BarChart3, Menu, ArrowLeft, Key,
  RefreshCw, Download, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

// --- Toast Notification ---
function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-xs w-full">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-start gap-3 p-3 rounded-lg border shadow-lg slide-up ${
          t.type === 'success'
            ? 'bg-green-900/90 border-green-700 text-green-200'
            : t.type === 'error'
            ? 'bg-red-900/90 border-red-700 text-red-200'
            : 'bg-lavish-card border-lavish-gold text-lavish-cream'
        }`}>
          {t.type === 'success' ? <CheckCircle size={15} className="mt-0.5 flex-shrink-0 text-green-400" />
            : <AlertCircle size={15} className="mt-0.5 flex-shrink-0 text-red-400" />}
          <span className="font-sans text-xs flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="text-current opacity-60 hover:opacity-100 flex-shrink-0">
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
  return { toasts, addToast, removeToast };
}

// --- Sidebar ---
function Sidebar({ activeTab, setActiveTab, onLogout, isOpen, onClose }) {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'menu', icon: UtensilsCrossed, label: 'Menu Items' },
    { id: 'categories', icon: Tag, label: 'Categories' },
    { id: 'restaurant', icon: Settings, label: 'Restaurant Info' },
    { id: 'qrcode', icon: QrCode, label: 'QR Code' },
    { id: 'security', icon: Key, label: 'Security' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={onClose} />}

      <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-lavish-charcoal border-r border-lavish-border z-50 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-lavish-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gold-gradient rounded-full flex items-center justify-center shadow-gold-sm flex-shrink-0">
              <UtensilsCrossed size={16} className="text-lavish-dark" />
            </div>
            <div>
              <div className="font-cinzel text-xs font-bold tracking-widest gold-text leading-tight">THE LAVISH</div>
              <div className="font-sans text-xs text-lavish-creamMuted">Admin Dashboard</div>
            </div>
            <button onClick={onClose} className="ml-auto text-lavish-creamMuted hover:text-lavish-gold md:hidden">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => { setActiveTab(id); onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm transition-all duration-200 ${
                activeTab === id
                  ? 'bg-lavish-gold/15 text-lavish-gold border border-lavish-gold/30'
                  : 'text-lavish-creamMuted hover:text-lavish-cream hover:bg-lavish-dark/50'
              }`}>
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-lavish-border space-y-2">
          <Link to="/" className="flex items-center gap-2 font-sans text-xs text-lavish-creamMuted hover:text-lavish-gold transition-colors py-2 px-3 rounded-lg hover:bg-lavish-dark/50">
            <ExternalLink size={14} /> View Website
          </Link>
          <Link to="/menu" target="_blank" className="flex items-center gap-2 font-sans text-xs text-lavish-creamMuted hover:text-lavish-gold transition-colors py-2 px-3 rounded-lg hover:bg-lavish-dark/50">
            <UtensilsCrossed size={14} /> View Menu
          </Link>
          <button onClick={onLogout}
            className="w-full flex items-center gap-2 font-sans text-xs text-red-400 hover:text-red-300 transition-colors py-2 px-3 rounded-lg hover:bg-red-500/10">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

// --- Dashboard Stats ---
function DashboardTab({ token }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getDashboardStats(token).then(res => { if (res.success) setStats(res.data); }).catch(() => {});
  }, [token]);

  if (!stats) return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => <div key={i} className="h-24 shimmer rounded-xl" />)}
    </div>
  );

  const cards = [
    { label: 'Total Dishes', value: stats.totalItems, color: 'text-lavish-gold', bg: 'bg-lavish-gold/10 border-lavish-gold/20' },
    { label: 'Categories', value: stats.totalCategories, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Available', value: stats.availableItems, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Unavailable', value: stats.unavailableItems, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    { label: 'Veg Dishes', value: stats.vegItems, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Non-Veg', value: stats.nonVegItems, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    { label: 'Chef\'s Special', value: stats.specialItems, color: 'text-lavish-gold', bg: 'bg-lavish-gold/10 border-lavish-gold/20' },
    { label: 'Popular', value: stats.popularItems, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  ];

  return (
    <div className="p-6">
      <h2 className="font-cinzel text-xl font-bold text-lavish-cream mb-6 tracking-wide">Dashboard Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} border rounded-xl p-4`}>
            <div className={`font-cinzel text-3xl font-bold ${color} mb-1`}>{value}</div>
            <div className="font-sans text-xs text-lavish-creamMuted">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-lavish-card border border-lavish-border rounded-xl p-5">
          <h3 className="font-cinzel text-sm font-bold text-lavish-cream tracking-wide mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link to="/menu" target="_blank"
              className="flex items-center justify-between p-3 rounded-lg border border-lavish-border hover:border-lavish-gold hover:bg-lavish-gold/5 transition-all group">
              <span className="font-sans text-sm text-lavish-creamMuted group-hover:text-lavish-cream">View Public Menu</span>
              <ExternalLink size={14} className="text-lavish-creamMuted group-hover:text-lavish-gold transition-colors" />
            </Link>
            <Link to="/" target="_blank"
              className="flex items-center justify-between p-3 rounded-lg border border-lavish-border hover:border-lavish-gold hover:bg-lavish-gold/5 transition-all group">
              <span className="font-sans text-sm text-lavish-creamMuted group-hover:text-lavish-cream">View Homepage</span>
              <ExternalLink size={14} className="text-lavish-creamMuted group-hover:text-lavish-gold transition-colors" />
            </Link>
          </div>
        </div>

        <div className="bg-lavish-card border border-lavish-border rounded-xl p-5">
          <h3 className="font-cinzel text-sm font-bold text-lavish-cream tracking-wide mb-4">Menu Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-sans text-sm text-lavish-creamMuted">Availability Rate</span>
              <span className="font-sans text-sm font-semibold text-green-400">
                {stats.totalItems > 0 ? Math.round((stats.availableItems / stats.totalItems) * 100) : 0}%
              </span>
            </div>
            <div className="h-2 bg-lavish-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-500"
                style={{ width: `${stats.totalItems > 0 ? (stats.availableItems / stats.totalItems) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-sans text-sm text-lavish-creamMuted">Chef's Specials</span>
              <span className="font-sans text-sm font-semibold text-lavish-gold">{stats.specialItems} dishes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-sans text-sm text-lavish-creamMuted">Popular Items</span>
              <span className="font-sans text-sm font-semibold text-orange-400">{stats.popularItems} dishes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Menu Item Form Modal ---
function MenuItemFormModal({ item, categories, token, onClose, onSave, addToast }) {
  const isEdit = !!item;
  const [form, setForm] = useState({
    name: item?.name || '',
    categoryId: item?.categoryId || (categories[0]?.id || ''),
    price: item?.price || '',
    description: item?.description || '',
    dietary: item?.dietary || 'non-veg',
    spiceLevel: item?.spiceLevel || 2,
    isPopular: item?.isPopular || false,
    isSpecial: item?.isSpecial || false,
    isAvailable: item?.isAvailable !== undefined ? item.isAvailable : true,
    portionSize: item?.portionSize || '',
    servingEstimate: item?.servingEstimate || '',
    imageUrl: item?.image || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(item?.image || '');
  const [saving, setSaving] = useState(false);

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setForm(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.categoryId || !form.price) {
      addToast('Name, category, and price are required.', 'error');
      return;
    }
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);

    const result = isEdit
      ? await api.updateMenuItem(token, item.id, fd)
      : await api.createMenuItem(token, fd);

    setSaving(false);
    if (result.success) {
      addToast(isEdit ? 'Menu item updated!' : 'New dish added to menu!', 'success');
      onSave();
      onClose();
    } else {
      addToast(result.message || 'Failed to save.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative bg-lavish-card border border-lavish-border w-full sm:max-w-xl sm:rounded-xl overflow-hidden shadow-luxury slide-up max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-lavish-border flex-shrink-0">
          <h3 className="font-cinzel text-sm font-bold text-lavish-cream tracking-wide">
            {isEdit ? 'Edit Dish' : 'Add New Dish'}
          </h3>
          <button onClick={onClose} className="text-lavish-creamMuted hover:text-lavish-gold transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Name + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="font-sans text-xs text-lavish-creamMuted block mb-1">Dish Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Chicken Biryani" className="input-luxury py-2.5 text-sm" required />
            </div>
            <div>
              <label className="font-sans text-xs text-lavish-creamMuted block mb-1">Category *</label>
              <select value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
                className="input-luxury py-2.5 text-sm appearance-none" required>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="font-sans text-xs text-lavish-creamMuted block mb-1">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                placeholder="299" className="input-luxury py-2.5 text-sm" min="1" step="1" required />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-sans text-xs text-lavish-creamMuted block mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Describe this dish..." rows={2}
              className="input-luxury py-2.5 text-sm resize-none" />
          </div>

          {/* Dietary + Spice */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-sans text-xs text-lavish-creamMuted block mb-1">Dietary Type</label>
              <select value={form.dietary} onChange={e => setForm(p => ({ ...p, dietary: e.target.value }))}
                className="input-luxury py-2.5 text-sm appearance-none">
                <option value="veg">🟢 Veg</option>
                <option value="non-veg">🔴 Non-Veg</option>
                <option value="egg">🟡 Egg</option>
              </select>
            </div>
            <div>
              <label className="font-sans text-xs text-lavish-creamMuted block mb-1">Spice Level</label>
              <select value={form.spiceLevel} onChange={e => setForm(p => ({ ...p, spiceLevel: parseInt(e.target.value) }))}
                className="input-luxury py-2.5 text-sm appearance-none">
                <option value={1}>🌶 Mild</option>
                <option value={2}>🌶🌶 Medium</option>
                <option value={3}>🌶🌶🌶 Spicy</option>
                <option value={4}>🌶🌶🌶🌶 Extra Spicy</option>
              </select>
            </div>
          </div>

          {/* Portion */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-sans text-xs text-lavish-creamMuted block mb-1">Portion Size</label>
              <input value={form.portionSize} onChange={e => setForm(p => ({ ...p, portionSize: e.target.value }))}
                placeholder="e.g. Full Portion" className="input-luxury py-2.5 text-sm" />
            </div>
            <div>
              <label className="font-sans text-xs text-lavish-creamMuted block mb-1">Serves</label>
              <input value={form.servingEstimate} onChange={e => setForm(p => ({ ...p, servingEstimate: e.target.value }))}
                placeholder="e.g. Serves 2" className="input-luxury py-2.5 text-sm" />
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'isAvailable', label: 'Available' },
              { key: 'isPopular', label: 'Popular' },
              { key: 'isSpecial', label: 'Chef Special' },
            ].map(({ key, label }) => (
              <button key={key} type="button"
                onClick={() => setForm(p => ({ ...p, [key]: !p[key] }))}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border font-sans text-xs font-medium transition-all ${
                  form[key] ? 'bg-lavish-gold/15 border-lavish-gold text-lavish-gold' : 'border-lavish-border text-lavish-creamMuted'
                }`}>
                <div className={`w-3 h-3 rounded-full border ${form[key] ? 'bg-lavish-gold border-lavish-gold' : 'border-lavish-creamMuted'}`} />
                {label}
              </button>
            ))}
          </div>

          {/* Image */}
          <div>
            <label className="font-sans text-xs text-lavish-creamMuted block mb-1">Food Image</label>
            {imagePreview && (
              <div className="relative mb-2 h-32 rounded-lg overflow-hidden border border-lavish-border">
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none'; }} />
                <button type="button" onClick={() => { setImagePreview(''); setImageFile(null); setForm(p => ({ ...p, imageUrl: '' })); }}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center hover:bg-red-500/80 transition-colors">
                  <X size={12} className="text-white" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-dashed border-lavish-border rounded-lg cursor-pointer hover:border-lavish-gold hover:bg-lavish-gold/5 transition-all group">
                <Upload size={14} className="text-lavish-creamMuted group-hover:text-lavish-gold" />
                <span className="font-sans text-xs text-lavish-creamMuted group-hover:text-lavish-gold">Upload Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
              </label>
            </div>
            <div className="mt-2">
              <input value={form.imageUrl} onChange={e => { setForm(p => ({ ...p, imageUrl: e.target.value })); if (e.target.value) { setImagePreview(e.target.value); setImageFile(null); } }}
                placeholder="Or paste image URL (e.g. https://...)" className="input-luxury py-2 text-xs" />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-lavish-border flex-shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 btn-gold-outline py-2.5 text-sm font-sans">Cancel</button>
          <button type="submit" form="menu-item-form" onClick={handleSubmit} disabled={saving}
            className="flex-1 btn-gold py-2.5 text-sm font-sans flex items-center justify-center gap-2 disabled:opacity-60">
            {saving ? <><div className="w-4 h-4 border-2 border-lavish-dark/50 border-t-lavish-dark rounded-full animate-spin" /> Saving...</> : (isEdit ? 'Update Dish' : 'Add Dish')}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Menu Items Tab ---
function MenuItemsTab({ token, addToast }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterAvail, setFilterAvail] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadData = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filterCat !== 'all') params.category = filterCat;
    if (filterAvail !== 'all') params.available = filterAvail;
    if (search.trim()) params.search = search.trim();
    Promise.all([
      api.getMenuItems(params),
      api.getCategories()
    ]).then(([menuRes, catRes]) => {
      if (menuRes.success) setItems(menuRes.data);
      if (catRes.success) setCategories(catRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [filterCat, filterAvail, search]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async (id) => {
    const result = await api.deleteMenuItem(token, id);
    if (result.success) {
      addToast('Dish deleted.', 'success');
      loadData();
    } else {
      addToast(result.message || 'Failed to delete.', 'error');
    }
    setDeleteConfirm(null);
  };

  const handleToggle = async (id, type) => {
    const result = type === 'availability'
      ? await api.toggleAvailability(token, id)
      : await api.toggleSpecial(token, id);
    if (result.success) {
      addToast(result.message, 'success');
      loadData();
    } else {
      addToast(result.message || 'Failed to update.', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-lavish-creamMuted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search dishes..."
            className="input-luxury pl-9 py-2.5 text-sm w-full" />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="input-luxury py-2.5 text-sm">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterAvail} onChange={e => setFilterAvail(e.target.value)} className="input-luxury py-2.5 text-sm">
          <option value="all">All Status</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
        <button onClick={() => { setEditItem(null); setShowForm(true); }}
          className="btn-gold py-2.5 px-4 text-sm font-sans flex items-center gap-1.5 flex-shrink-0">
          <Plus size={15} /> Add Dish
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 shimmer rounded-lg" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <UtensilsCrossed size={32} className="text-lavish-creamMuted mx-auto mb-3" />
          <p className="font-sans text-sm text-lavish-creamMuted">No dishes found.</p>
          <button onClick={() => { setEditItem(null); setShowForm(true); }} className="btn-gold mt-4 text-sm py-2 px-5 font-sans">
            Add First Dish
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans text-xs text-lavish-creamMuted">{items.length} items</span>
            <button onClick={loadData} className="text-lavish-creamMuted hover:text-lavish-gold transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>
          {items.map(item => (
            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              item.isAvailable ? 'bg-lavish-card border-lavish-border hover:border-lavish-borderGold' : 'bg-lavish-dark border-lavish-border opacity-70'
            }`}>
              {/* Image */}
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-lavish-dark border border-lavish-border">
                <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=60'}
                  alt={item.name} className="w-full h-full object-cover"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=60'; }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-sans text-sm font-medium text-lavish-cream truncate">{item.name}</span>
                  {item.isSpecial && <span className="text-xs bg-lavish-gold/20 text-lavish-gold px-1.5 py-0.5 rounded font-sans">Special</span>}
                  {item.isPopular && <span className="text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-sans">Popular</span>}
                  {!item.isAvailable && <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-sans">Off</span>}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-cinzel text-xs text-lavish-gold font-bold">₹{item.price}</span>
                  <span className="font-sans text-xs text-lavish-creamMuted">{item.categoryName}</span>
                  <span className={`text-xs ${item.dietary === 'veg' ? 'text-green-500' : item.dietary === 'egg' ? 'text-yellow-500' : 'text-red-500'}`}>
                    {item.dietary}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => handleToggle(item.id, 'availability')}
                  title={item.isAvailable ? 'Mark unavailable' : 'Mark available'}
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                    item.isAvailable ? 'border-green-500/30 text-green-400 hover:bg-green-500/10' : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                  }`}>
                  {item.isAvailable ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                <button onClick={() => handleToggle(item.id, 'special')}
                  title="Toggle Chef Special"
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                    item.isSpecial ? 'border-lavish-gold/40 text-lavish-gold hover:bg-lavish-gold/10' : 'border-lavish-border text-lavish-creamMuted hover:border-lavish-gold hover:text-lavish-gold'
                  }`}>
                  <Star size={13} />
                </button>
                <button onClick={() => { setEditItem(item); setShowForm(true); }}
                  className="w-8 h-8 rounded-lg border border-lavish-border text-lavish-creamMuted hover:border-lavish-gold hover:text-lavish-gold transition-all flex items-center justify-center">
                  <Pencil size={13} />
                </button>
                <button onClick={() => setDeleteConfirm(item.id)}
                  className="w-8 h-8 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative bg-lavish-card border border-lavish-border rounded-xl p-6 max-w-xs w-full text-center shadow-luxury slide-up" onClick={e => e.stopPropagation()}>
            <Trash2 size={28} className="text-red-400 mx-auto mb-3" />
            <h4 className="font-cinzel text-sm font-bold text-lavish-cream mb-2">Delete Dish?</h4>
            <p className="font-sans text-xs text-lavish-creamMuted mb-5">This action cannot be undone. The dish will be permanently removed from your menu.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-gold-outline py-2 text-sm font-sans">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-sm text-sm font-sans transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <MenuItemFormModal
          item={editItem}
          categories={categories}
          token={token}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSave={loadData}
          addToast={addToast}
        />
      )}
    </div>
  );
}

// --- Categories Tab ---
function CategoriesTab({ token, addToast }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: 'Utensils' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadCategories = () => {
    setLoading(true);
    api.getCategories().then(res => { if (res.success) setCategories(res.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { loadCategories(); }, []);

  const handleOpenForm = (cat = null) => {
    setEditCat(cat);
    setForm({ name: cat?.name || '', description: cat?.description || '', icon: cat?.icon || 'Utensils' });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { addToast('Category name is required.', 'error'); return; }
    setSaving(true);
    const result = editCat
      ? await api.updateCategory(token, editCat.id, form)
      : await api.createCategory(token, form);
    setSaving(false);
    if (result.success) {
      addToast(editCat ? 'Category updated!' : 'Category created!', 'success');
      setShowForm(false);
      loadCategories();
    } else {
      addToast(result.message || 'Failed.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await api.deleteCategory(token, id);
    if (result.success) {
      addToast('Category deleted.', 'success');
      loadCategories();
    } else {
      addToast(result.message || 'Cannot delete — remove all dishes first.', 'error');
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-cinzel text-lg font-bold text-lavish-cream tracking-wide">Categories</h2>
        <button onClick={() => handleOpenForm()} className="btn-gold text-sm py-2 px-4 font-sans flex items-center gap-1.5">
          <Plus size={15} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 shimmer rounded-lg" />)}</div>
      ) : (
        <div className="space-y-3">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-4 p-4 bg-lavish-card border border-lavish-border rounded-lg hover:border-lavish-borderGold transition-all">
              <div className="w-10 h-10 bg-lavish-gold/10 border border-lavish-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Tag size={16} className="text-lavish-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-sans text-sm font-semibold text-lavish-cream">{cat.name}</div>
                <div className="font-sans text-xs text-lavish-creamMuted">
                  {cat.itemCount || 0} dishes · {cat.description || 'No description'}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleOpenForm(cat)}
                  className="w-8 h-8 border border-lavish-border text-lavish-creamMuted hover:border-lavish-gold hover:text-lavish-gold rounded-lg flex items-center justify-center transition-all">
                  <Pencil size={13} />
                </button>
                <button onClick={() => setDeleteConfirm(cat.id)}
                  className="w-8 h-8 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg flex items-center justify-center transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="absolute inset-0 bg-black/80" />
          <div className="relative bg-lavish-card border border-lavish-border rounded-xl w-full max-w-sm shadow-luxury slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-lavish-border">
              <h3 className="font-cinzel text-sm font-bold text-lavish-cream">{editCat ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={() => setShowForm(false)} className="text-lavish-creamMuted hover:text-lavish-gold"><X size={16} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="font-sans text-xs text-lavish-creamMuted block mb-1">Category Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Desserts" className="input-luxury py-2.5 text-sm" required autoFocus />
              </div>
              <div>
                <label className="font-sans text-xs text-lavish-creamMuted block mb-1">Description</label>
                <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Short description..." className="input-luxury py-2.5 text-sm" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn-gold-outline py-2.5 text-sm font-sans">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-gold py-2.5 text-sm font-sans flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <div className="w-4 h-4 border-2 border-lavish-dark/50 border-t-lavish-dark rounded-full animate-spin" /> : (editCat ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative bg-lavish-card border border-lavish-border rounded-xl p-6 max-w-xs w-full text-center shadow-luxury slide-up" onClick={e => e.stopPropagation()}>
            <Trash2 size={28} className="text-red-400 mx-auto mb-3" />
            <h4 className="font-cinzel text-sm font-bold text-lavish-cream mb-2">Delete Category?</h4>
            <p className="font-sans text-xs text-lavish-creamMuted mb-5">Categories with dishes cannot be deleted. First move or delete all dishes.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-gold-outline py-2 text-sm font-sans">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-sm text-sm font-sans transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Restaurant Info Tab ---
function RestaurantInfoTab({ token, addToast }) {
  const [info, setInfo] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRestaurantInfo().then(res => {
      if (res.success) {
        setInfo(res.data);
        setForm(res.data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await api.updateRestaurantInfo(token, form);
    setSaving(false);
    if (result.success) {
      setInfo(result.data);
      addToast('Restaurant info updated!', 'success');
    } else {
      addToast(result.message || 'Failed to update.', 'error');
    }
  };

  if (loading) return <div className="p-6"><div className="shimmer h-96 rounded-xl" /></div>;

  const fields = [
    { key: 'name', label: 'Restaurant Name', type: 'text', placeholder: 'THE LAVISH RESTAURANT' },
    { key: 'tagline', label: 'Tagline / Motto', type: 'text', placeholder: 'Experience the Taste...' },
    { key: 'about', label: 'About / Description', type: 'textarea', placeholder: 'Tell customers about your restaurant...' },
    { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210' },
    { key: 'whatsappNumber', label: 'WhatsApp Number (digits only)', type: 'text', placeholder: '919876543210' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'contact@thelavish.com' },
    { key: 'address', label: 'Full Address', type: 'textarea', placeholder: 'Street, City, State, PIN' },
    { key: 'openingHours', label: 'Opening Hours', type: 'text', placeholder: 'Mon–Sun: 11:30 AM – 11:30 PM' },
    { key: 'googleMapsUrl', label: 'Google Maps URL', type: 'url', placeholder: 'https://maps.google.com/...' },
    { key: 'instagramUrl', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/...' },
    { key: 'facebookUrl', label: 'Facebook URL', type: 'url', placeholder: 'https://facebook.com/...' },
  ];

  return (
    <div className="p-4 md:p-6">
      <h2 className="font-cinzel text-lg font-bold text-lavish-cream mb-5 tracking-wide">Restaurant Information</h2>
      <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
        {fields.map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label className="font-sans text-xs text-lavish-creamMuted block mb-1.5">{label}</label>
            {type === 'textarea' ? (
              <textarea value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder} rows={3}
                className="input-luxury py-2.5 text-sm resize-none" />
            ) : (
              <input type={type} value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder} className="input-luxury py-2.5 text-sm" />
            )}
          </div>
        ))}
        <div className="flex items-center gap-3 p-4 bg-lavish-card border border-lavish-border rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className={`w-10 h-5 rounded-full transition-colors ${form.tableReservationEnabled ? 'bg-lavish-gold' : 'bg-lavish-border'} relative`}
              onClick={() => setForm(p => ({ ...p, tableReservationEnabled: !p.tableReservationEnabled }))}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.tableReservationEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="font-sans text-sm text-lavish-cream">Table Reservation Enabled</span>
          </label>
        </div>
        <button type="submit" disabled={saving}
          className="btn-gold py-3 px-8 font-cinzel tracking-widest text-sm flex items-center gap-2 disabled:opacity-60">
          {saving ? <><div className="w-4 h-4 border-2 border-lavish-dark/50 border-t-lavish-dark rounded-full animate-spin" />Saving...</> : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

// --- QR Code Tab ---
function QRCodeTab() {
  const [qrData, setQrData] = useState(null);
  const [tableNumber, setTableNumber] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    const url = customUrl.trim() || `${window.location.origin}/menu`;
    const result = await api.generateQR(url, tableNumber.trim() || undefined);
    setLoading(false);
    if (result.success) {
      setQrData(result);
    } else {
      setError(result.message || 'Failed to generate QR code.');
    }
  };

  const downloadQR = () => {
    if (!qrData?.qrDataUrl) return;
    const link = document.createElement('a');
    link.download = tableNumber ? `lavish-qr-table-${tableNumber}.png` : 'lavish-restaurant-qr.png';
    link.href = qrData.qrDataUrl;
    link.click();
  };

  useEffect(() => { generate(); }, []);

  return (
    <div className="p-4 md:p-6">
      <h2 className="font-cinzel text-lg font-bold text-lavish-cream mb-5 tracking-wide">QR Code Generator</h2>

      <div className="max-w-xl">
        <div className="bg-lavish-card border border-lavish-border rounded-xl p-5 mb-5 space-y-4">
          <div>
            <label className="font-sans text-xs text-lavish-creamMuted block mb-1.5">Menu URL (auto-filled)</label>
            <input value={customUrl} onChange={e => setCustomUrl(e.target.value)}
              placeholder={`${window.location.origin}/menu`}
              className="input-luxury py-2.5 text-sm" />
            <p className="font-sans text-xs text-lavish-creamMuted mt-1">Leave blank to use this device's menu URL.</p>
          </div>
          <div>
            <label className="font-sans text-xs text-lavish-creamMuted block mb-1.5">Table Number (optional)</label>
            <input value={tableNumber} onChange={e => setTableNumber(e.target.value)}
              placeholder="e.g. Table 5" className="input-luxury py-2.5 text-sm" />
          </div>
          <button onClick={generate} disabled={loading}
            className="btn-gold py-2.5 px-6 text-sm font-sans flex items-center gap-2 disabled:opacity-60">
            {loading ? <><div className="w-4 h-4 border-2 border-lavish-dark/50 border-t-lavish-dark rounded-full animate-spin" />Generating...</>
              : <><RefreshCw size={15} />Generate QR Code</>}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-5 text-red-400 font-sans text-sm">{error}</div>
        )}

        {qrData?.qrDataUrl && (
          <div className="bg-lavish-card border border-lavish-border rounded-xl p-6 text-center space-y-4">
            <div className="inline-flex flex-col items-center gap-1">
              <div className="w-8 h-1 bg-gold-gradient rounded-full" />
              <span className="font-cinzel text-xs text-lavish-gold tracking-widest">SCAN TO VIEW MENU</span>
              <div className="w-8 h-1 bg-gold-gradient rounded-full" />
            </div>

            <div className="relative inline-block">
              <div className="p-4 bg-lavish-cream rounded-xl inline-block shadow-gold-glow">
                <img src={qrData.qrDataUrl} alt="QR Code" className="w-56 h-56 mx-auto" />
              </div>
            </div>

            <div>
              <p className="font-cinzel text-sm font-bold text-lavish-cream tracking-wide">THE LAVISH RESTAURANT</p>
              <p className="font-sans text-xs text-lavish-creamMuted mt-0.5">
                Links to: {qrData.targetUrl}
              </p>
              {tableNumber && (
                <p className="font-sans text-xs text-lavish-gold mt-1">Table: {tableNumber}</p>
              )}
            </div>

            <button onClick={downloadQR}
              className="btn-gold py-2.5 px-8 text-sm font-cinzel tracking-widest flex items-center gap-2 mx-auto">
              <Download size={15} />
              Download QR Code (PNG)
            </button>

            <p className="font-sans text-xs text-lavish-creamMuted">
              Print this QR code and place it on restaurant tables, counters, or brochures. No customer login required.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Security Tab ---
function SecurityTab({ token, addToast }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [showPass, setShowPass] = useState({ curr: false, new: false, conf: false });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      addToast('All fields are required.', 'error'); return;
    }
    if (form.newPassword.length < 8) {
      addToast('New password must be at least 8 characters.', 'error'); return;
    }
    if (form.newPassword !== form.confirmPassword) {
      addToast('New passwords do not match.', 'error'); return;
    }
    setSaving(true);
    const result = await api.changePassword(token, form.currentPassword, form.newPassword);
    setSaving(false);
    if (result.success) {
      addToast('Password changed successfully!', 'success');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      addToast(result.message || 'Failed to change password.', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="font-cinzel text-lg font-bold text-lavish-cream mb-5 tracking-wide">Security Settings</h2>
      <form onSubmit={handleSave} className="max-w-sm space-y-4">
        <div className="bg-lavish-card border border-lavish-border rounded-xl p-5 space-y-4">
          {[
            { key: 'currentPassword', label: 'Current Password', show: 'curr' },
            { key: 'newPassword', label: 'New Password', show: 'new' },
            { key: 'confirmPassword', label: 'Confirm New Password', show: 'conf' },
          ].map(({ key, label, show }) => (
            <div key={key}>
              <label className="font-sans text-xs text-lavish-creamMuted block mb-1.5">{label}</label>
              <div className="relative">
                <input type={showPass[show] ? 'text' : 'password'} value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder="••••••••" className="input-luxury py-2.5 text-sm pr-10" required />
                <button type="button" onClick={() => setShowPass(p => ({ ...p, [show]: !p[show] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lavish-creamMuted hover:text-lavish-gold transition-colors">
                  {showPass[show] ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="submit" disabled={saving}
          className="btn-gold py-3 px-8 font-cinzel tracking-widest text-sm flex items-center gap-2 disabled:opacity-60">
          {saving ? <><div className="w-4 h-4 border-2 border-lavish-dark/50 border-t-lavish-dark rounded-full animate-spin" />Saving...</> : 'Change Password'}
        </button>
      </form>
    </div>
  );
}

// --- Main AdminDashboard ---
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab token={token} />;
      case 'menu': return <MenuItemsTab token={token} addToast={addToast} />;
      case 'categories': return <CategoriesTab token={token} addToast={addToast} />;
      case 'restaurant': return <RestaurantInfoTab token={token} addToast={addToast} />;
      case 'qrcode': return <QRCodeTab />;
      case 'security': return <SecurityTab token={token} addToast={addToast} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-lavish-dark flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}
        isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 navbar-blur border-b border-lavish-border h-14 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="text-lavish-creamMuted hover:text-lavish-gold md:hidden">
              <Menu size={20} />
            </button>
            <h1 className="font-cinzel text-sm font-bold text-lavish-cream tracking-wide capitalize">
              {activeTab === 'dashboard' ? 'Dashboard' :
               activeTab === 'menu' ? 'Menu Items' :
               activeTab === 'categories' ? 'Categories' :
               activeTab === 'restaurant' ? 'Restaurant Info' :
               activeTab === 'qrcode' ? 'QR Code' : 'Security'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs text-lavish-creamMuted hidden sm:block">
              Logged in as <span className="text-lavish-gold">{user?.username || 'admin'}</span>
            </span>
            <button onClick={handleLogout}
              className="font-sans text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 border border-red-500/20 hover:border-red-400/40 px-3 py-1.5 rounded-lg">
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {renderTab()}
        </main>
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
