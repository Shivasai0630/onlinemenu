import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, X, ChevronDown, Filter, ArrowLeft, Flame, Star,
  UtensilsCrossed, MessageCircle, Phone, AlertCircle, Info, Leaf, Egg
} from 'lucide-react';
import { api } from '../services/api.js';

// Diet indicator component
function DietDot({ type, size = 'sm' }) {
  const s = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const inner = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';
  if (type === 'veg') return (
    <div className={`${s} rounded-sm border-2 border-green-500 flex items-center justify-center flex-shrink-0`}>
      <div className={`${inner} rounded-full bg-green-500`} />
    </div>
  );
  if (type === 'egg') return (
    <div className={`${s} rounded-sm border-2 border-yellow-500 flex items-center justify-center flex-shrink-0`}>
      <div className={`${inner} rounded-full bg-yellow-500`} />
    </div>
  );
  return (
    <div className={`${s} rounded-sm border-2 border-red-500 flex items-center justify-center flex-shrink-0`}>
      <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderBottom: '7px solid #ef4444' }} />
    </div>
  );
}

// Spice level indicator
function SpiceLevel({ level }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map(i => (
        <Flame key={i} size={10} className={i <= level ? 'text-orange-500 fill-orange-500' : 'text-lavish-border'} />
      ))}
    </div>
  );
}

// Item Detail Modal
function ItemModal({ item, onClose }) {
  if (!item) return null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div
        className="relative bg-lavish-card border border-lavish-border w-full sm:max-w-lg sm:rounded-xl overflow-hidden shadow-luxury slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-56 sm:h-64">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-lavish-card via-transparent to-transparent" />
          <button onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 bg-lavish-dark/80 backdrop-blur-sm border border-lavish-border rounded-full flex items-center justify-center hover:border-lavish-gold transition-colors">
            <X size={16} className="text-lavish-cream" />
          </button>
          {item.isSpecial && (
            <div className="absolute top-3 left-3 bg-lavish-gold text-lavish-dark text-xs font-cinzel font-bold px-2 py-1 rounded-sm">
              CHEF'S SPECIAL
            </div>
          )}
          {item.isPopular && !item.isSpecial && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-cinzel font-bold px-2 py-1 rounded-sm">
              POPULAR
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-2">
              <DietDot type={item.dietary} size="md" />
              <div>
                <h3 className="font-serif font-semibold text-lavish-cream text-lg leading-tight">{item.name}</h3>
                <span className="font-sans text-xs text-lavish-gold capitalize">{item.category?.name || item.categoryName}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-cinzel font-bold gold-text text-xl">₹{item.price.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Flame size={13} className="text-orange-400" />
              <span className="font-sans text-xs text-lavish-creamMuted capitalize">
                {item.spiceLevel === 1 ? 'Mild' : item.spiceLevel === 2 ? 'Medium' : item.spiceLevel === 3 ? 'Spicy' : 'Extra Spicy'}
              </span>
              <SpiceLevel level={item.spiceLevel} />
            </div>
            {item.portionSize && (
              <span className="font-sans text-xs text-lavish-creamMuted">· {item.portionSize}</span>
            )}
            {item.servingEstimate && (
              <span className="font-sans text-xs text-lavish-creamMuted">· {item.servingEstimate}</span>
            )}
          </div>

          {item.description && (
            <p className="font-sans text-sm text-lavish-creamMuted leading-relaxed mb-4">{item.description}</p>
          )}

          {!item.isAvailable && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
              <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
              <span className="font-sans text-xs text-red-400">Currently unavailable – check back soon!</span>
            </div>
          )}

          <a
            href={`https://wa.me/919392225210?text=Hello! I would like to order: *${item.name}* (₹${item.price}) from The Lavish Restaurant.`}
            target="_blank" rel="noopener noreferrer"
            className="btn-gold w-full text-center flex items-center justify-center gap-2 font-cinzel tracking-widest text-sm py-3">
            <MessageCircle size={15} />
            ORDER ON WHATSAPP
          </a>
        </div>
      </div>
    </div>
  );
}

// Menu Item Card
function MenuItemCard({ item, onSelect }) {
  return (
    <div
      className={`card-luxury group cursor-pointer fade-in relative ${!item.isAvailable ? 'opacity-60' : ''}`}
      onClick={() => onSelect(item)}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-lavish-dark/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.isSpecial && (
            <span className="bg-lavish-gold text-lavish-dark text-xs font-bold px-1.5 py-0.5 rounded font-cinzel leading-none">★ SPECIAL</span>
          )}
          {item.isPopular && !item.isSpecial && (
            <span className="bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded font-sans leading-none">🔥 POPULAR</span>
          )}
          {!item.isAvailable && (
            <span className="bg-gray-800 text-gray-400 text-xs font-bold px-1.5 py-0.5 rounded font-sans leading-none">UNAVAILABLE</span>
          )}
        </div>

        <div className="absolute top-2 right-2">
          <DietDot type={item.dietary} />
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-serif text-lavish-cream font-semibold text-sm leading-snug group-hover:text-lavish-gold transition-colors line-clamp-1">
            {item.name}
          </h3>
        </div>
        {item.description && (
          <p className="font-sans text-xs text-lavish-creamMuted line-clamp-1 mb-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="font-cinzel font-bold gold-text text-base">₹{item.price.toLocaleString('en-IN')}</span>
          <SpiceLevel level={item.spiceLevel} />
        </div>
        {item.portionSize && (
          <div className="font-sans text-xs text-lavish-creamMuted mt-0.5">{item.portionSize}</div>
        )}
      </div>
    </div>
  );
}

// Category Tab
function CategoryTab({ cat, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 font-sans text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full border transition-all duration-200 whitespace-nowrap ${
        active
          ? 'bg-gold-gradient text-lavish-dark border-transparent shadow-gold-sm font-semibold'
          : 'border-lavish-border text-lavish-creamMuted hover:border-lavish-gold hover:text-lavish-gold bg-transparent'
      }`}
    >
      {cat.name}
      {count !== undefined && (
        <span className={`ml-1.5 text-xs ${active ? 'opacity-70' : 'text-lavish-creamMuted'}`}>({count})</span>
      )}
    </button>
  );
}

// Shimmer loader cards
function ShimmerCards({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-lavish-card border border-lavish-border rounded-lg overflow-hidden">
          <div className="shimmer h-44" />
          <div className="p-3 space-y-2">
            <div className="shimmer h-4 w-3/4 rounded" />
            <div className="shimmer h-3 w-full rounded" />
            <div className="shimmer h-5 w-1/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Main MenuPage
export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dietFilter, setDietFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const searchRef = useRef(null);
  const catScrollRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    api.getRestaurantInfo().then(res => { if (res.success) setRestaurantInfo(res.data); }).catch(() => {});
    api.getCategories().then(res => { if (res.success) setCategories(res.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (dietFilter !== 'all') params.dietary = dietFilter;
    params.available = 'true'; // Show only available items to customers

    api.getMenuItems(params).then(res => {
      if (res.success) setItems(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedCategory, debouncedSearch, dietFilter]);

  const clearSearch = () => {
    setSearch('');
    setDebouncedSearch('');
    searchRef.current?.focus();
  };

  // Group items by category when showing all
  const groupedItems = selectedCategory === 'all'
    ? categories.reduce((acc, cat) => {
        const catItems = items.filter(item => item.categoryId === cat.id);
        if (catItems.length > 0) acc.push({ category: cat, items: catItems });
        return acc;
      }, [])
    : [{ category: null, items }];

  const totalItems = items.length;

  return (
    <div className="min-h-screen bg-lavish-dark">
      {/* Header */}
      <div className="sticky top-0 z-40 navbar-blur border-b border-lavish-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-gold-gradient rounded-full flex items-center justify-center">
                <UtensilsCrossed size={13} className="text-lavish-dark" />
              </div>
              <span className="font-cinzel text-xs font-bold tracking-widest gold-text hidden sm:block">THE LAVISH</span>
            </Link>

            <div className="flex-1 mx-3 sm:mx-6 relative max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-lavish-creamMuted pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search dishes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-luxury py-2 pl-9 pr-9 text-sm rounded-full border-lavish-border/50"
              />
              {search && (
                <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-lavish-creamMuted hover:text-lavish-gold transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 font-sans text-xs py-1.5 px-3 rounded-full border transition-all ${
                  showFilters || dietFilter !== 'all' ? 'border-lavish-gold text-lavish-gold bg-lavish-gold/10' : 'border-lavish-border text-lavish-creamMuted hover:border-lavish-gold hover:text-lavish-gold'
                }`}>
                <Filter size={13} />
                <span className="hidden sm:inline">Filter</span>
                {dietFilter !== 'all' && <span className="w-1.5 h-1.5 bg-lavish-gold rounded-full" />}
              </button>
            </div>
          </div>

          {/* Diet filter dropdown */}
          {showFilters && (
            <div className="pb-3 flex items-center gap-2 flex-wrap slide-up">
              <span className="font-sans text-xs text-lavish-creamMuted">Diet:</span>
              {[
                { value: 'all', label: 'All', icon: null },
                { value: 'veg', label: '🟢 Veg', icon: null },
                { value: 'non-veg', label: '🔴 Non-Veg', icon: null },
                { value: 'egg', label: '🟡 Egg', icon: null },
              ].map(opt => (
                <button key={opt.value} onClick={() => setDietFilter(opt.value)}
                  className={`font-sans text-xs px-3 py-1.5 rounded-full border transition-all ${
                    dietFilter === opt.value
                      ? 'bg-lavish-gold text-lavish-dark border-lavish-gold font-semibold'
                      : 'border-lavish-border text-lavish-creamMuted hover:border-lavish-gold hover:text-lavish-gold'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Category Tabs */}
          <div ref={catScrollRef} className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-hide -mx-1 px-1 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <CategoryTab
              cat={{ name: 'All', id: 'all' }}
              active={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
              count={undefined}
            />
            {categories.map(cat => (
              <CategoryTab
                key={cat.id}
                cat={cat}
                active={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                count={cat.itemCount}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Page title */}
      <div className="text-center py-8 px-4">
        <h1 className="section-title text-2xl sm:text-3xl">
          {selectedCategory !== 'all'
            ? categories.find(c => c.id === selectedCategory)?.name || 'Menu'
            : debouncedSearch ? `Results for "${debouncedSearch}"` : 'Our Royal Menu'}
        </h1>
        {!loading && (
          <p className="font-sans text-xs text-lavish-creamMuted mt-1">
            {totalItems} {totalItems === 1 ? 'dish' : 'dishes'} found
          </p>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {loading ? (
          <ShimmerCards />
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full border border-lavish-border flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed size={28} className="text-lavish-creamMuted" />
            </div>
            <h3 className="font-cinzel text-lg text-lavish-cream mb-2">No Dishes Found</h3>
            <p className="font-sans text-sm text-lavish-creamMuted">
              {debouncedSearch ? `No results for "${debouncedSearch}". Try a different search.` : 'No dishes available in this category.'}
            </p>
            {debouncedSearch && (
              <button onClick={clearSearch} className="btn-gold-outline mt-4 text-xs px-6 py-2 font-sans">
                Clear Search
              </button>
            )}
          </div>
        ) : selectedCategory === 'all' && !debouncedSearch ? (
          // Grouped by category view
          <div className="space-y-10">
            {groupedItems.map(({ category, items: catItems }) => (
              <div key={category?.id}>
                <div className="flex items-center gap-4 mb-5">
                  <div>
                    <h2 className="font-cinzel text-xl font-bold text-lavish-cream tracking-wide">{category?.name}</h2>
                    {category?.description && (
                      <p className="font-sans text-xs text-lavish-creamMuted mt-0.5 max-w-lg">{category.description}</p>
                    )}
                  </div>
                  <div className="flex-1 h-px bg-lavish-border" />
                  <span className="font-sans text-xs text-lavish-creamMuted flex-shrink-0">{catItems.length} items</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {catItems.map(item => (
                    <MenuItemCard key={item.id} item={item} onSelect={setSelectedItem} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Flat grid view (search / category filter)
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map(item => (
              <MenuItemCard key={item.id} item={item} onSelect={setSelectedItem} />
            ))}
          </div>
        )}
      </div>

      {/* WhatsApp FAB */}
      <a href={`https://wa.me/${restaurantInfo?.whatsappNumber || '919876543210'}?text=Hello! I'd like to order from The Lavish Restaurant.`}
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200 hover:bg-green-400">
        <MessageCircle size={22} className="text-white" />
      </a>

      {/* Back to top */}
      <BackToTop />

      {/* Item Detail Modal */}
      {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  if (!visible) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-20 right-6 z-40 w-10 h-10 bg-lavish-card border border-lavish-gold rounded-full flex items-center justify-center hover:bg-lavish-gold hover:text-lavish-dark text-lavish-gold transition-all duration-200 shadow-gold-sm">
      <ChevronDown size={16} className="rotate-180" />
    </button>
  );
}
