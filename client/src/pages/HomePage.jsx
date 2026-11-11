import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Clock, Star, ChevronDown, Instagram, MessageCircle, ExternalLink, ArrowRight, Flame, Award, Users, UtensilsCrossed } from 'lucide-react';
import { api } from '../services/api.js';

// --- Navbar Component ---
function Navbar({ info }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'navbar-blur border-b border-lavish-border shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gold-gradient rounded-full flex items-center justify-center shadow-gold-sm group-hover:shadow-gold-glow transition-all duration-300">
              <UtensilsCrossed size={16} className="text-lavish-dark" />
            </div>
            <span className="font-cinzel text-sm md:text-base font-bold tracking-widest gold-text hidden sm:block">
              THE LAVISH
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 font-sans text-sm font-medium text-lavish-creamMuted">
            <button onClick={() => scrollTo('home')} className="hover:text-lavish-gold transition-colors duration-200">Home</button>
            <button onClick={() => scrollTo('about')} className="hover:text-lavish-gold transition-colors duration-200">About</button>
            <Link to="/menu" className="hover:text-lavish-gold transition-colors duration-200">Menu</Link>
            <button onClick={() => scrollTo('reviews')} className="hover:text-lavish-gold transition-colors duration-200">Reviews</button>
            <button onClick={() => scrollTo('contact')} className="hover:text-lavish-gold transition-colors duration-200">Contact</button>
          </div>

          {/* CTA + Mobile Menu */}
          <div className="flex items-center gap-3">
            <Link to="/menu" className="btn-gold text-xs md:text-sm py-2 px-4 md:px-5 font-cinzel tracking-widest">
              ORDER NOW
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-lavish-gold p-1">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden navbar-blur border-t border-lavish-border px-4 py-4 space-y-3 slide-up">
          {['home','about','reviews','contact'].map(id => (
            <button key={id} onClick={() => scrollTo(id)}
              className="block w-full text-left font-sans text-lavish-creamMuted hover:text-lavish-gold py-2 capitalize border-b border-lavish-border/50 transition-colors">
              {id}
            </button>
          ))}
          <Link to="/menu" onClick={() => setIsOpen(false)}
            className="block w-full text-left font-sans text-lavish-creamMuted hover:text-lavish-gold py-2 border-b border-lavish-border/50 transition-colors">
            Menu
          </Link>
        </div>
      )}
    </nav>
  );
}

// --- Hero Section ---
function HeroSection({ info }) {
  const navigate = useNavigate();
  const whatsappUrl = `https://wa.me/${info?.whatsappNumber || '919392225210'}?text=Hello! I'd like to place an order at The Lavish Restaurant.`;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background collage */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1920&q=80"
          alt="Biryani"
          className="w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        {/* Gold vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(11,11,12,0.6) 100%)'
        }} />
      </div>

      {/* Floating food images - desktop only */}
      <div className="absolute top-24 right-8 w-40 h-40 rounded-full overflow-hidden border-2 border-lavish-gold/40 shadow-gold-glow hidden xl:block opacity-70">
        <img src="https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=400&q=80" alt="Kebab" className="w-full h-full object-cover" />
      </div>
      <div className="absolute bottom-32 right-16 w-32 h-32 rounded-full overflow-hidden border-2 border-lavish-gold/40 shadow-gold-sm hidden xl:block opacity-60">
        <img src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80" alt="Curry" className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24 pb-16">
        <div className="inline-flex items-center gap-2 bg-lavish-gold/10 border border-lavish-gold/30 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
          <Star size={12} className="text-lavish-gold fill-lavish-gold" />
          <span className="font-sans text-xs text-lavish-goldLight tracking-widest uppercase">Premium Dining Experience</span>
          <Star size={12} className="text-lavish-gold fill-lavish-gold" />
        </div>

        <h1 className="font-cinzel font-black text-4xl sm:text-5xl md:text-7xl xl:text-8xl text-lavish-cream leading-tight mb-4 tracking-wider drop-shadow-2xl">
          THE <span className="gold-text">LAVISH</span>
          <br />RESTAURANT
        </h1>

        <div className="divider-gold max-w-xs mx-auto my-6">
          <span className="text-lavish-gold text-lg">✦</span>
        </div>

        <p className="font-serif italic text-lavish-goldLight text-xl md:text-2xl mb-4 drop-shadow-lg">
          "Experience the Taste. Enjoy the Lavish Life."
        </p>

        <p className="font-sans text-lavish-creamMuted text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed">
          Indulge in our slow-cooked royal Dum Biryanis, succulent clay-oven Kebabs, and 
          rich aromatic Curries — crafted with time-honored recipes and premium spices.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button onClick={() => navigate('/menu')} className="btn-gold font-cinzel tracking-widest text-sm w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-2">
            <UtensilsCrossed size={16} />
            EXPLORE OUR MENU
          </button>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="btn-gold-outline font-cinzel tracking-widest text-sm w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-2">
            <MessageCircle size={16} />
            ORDER ON WHATSAPP
          </a>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-sans text-lavish-creamMuted hover:text-lavish-gold text-sm py-4 transition-colors underline underline-offset-4 decoration-lavish-gold/40">
            Contact Us
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto sm:max-w-md">
          {[
            { icon: Flame, label: 'Dishes', value: '70+' },
            { icon: Award, label: 'Years', value: '5+' },
            { icon: Users, label: 'Served', value: '50K+' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center bg-lavish-dark/50 backdrop-blur-sm rounded-lg p-3 border border-lavish-border/50">
              <Icon size={20} className="text-lavish-gold mx-auto mb-1" />
              <div className="font-cinzel text-lg font-bold gold-text">{value}</div>
              <div className="font-sans text-xs text-lavish-creamMuted">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <span className="font-sans text-xs text-lavish-creamMuted tracking-widest">SCROLL</span>
        <ChevronDown size={16} className="text-lavish-gold" />
      </div>
    </section>
  );
}

// --- About Section ---
function AboutSection({ info }) {
  return (
    <section id="about" className="py-20 md:py-28 bg-lavish-charcoal relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-lavish-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-lavish-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="rounded-lg overflow-hidden aspect-[3/4] shadow-luxury border border-lavish-border">
                  <img src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80" alt="Biryani" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="rounded-lg overflow-hidden aspect-square shadow-luxury border border-lavish-border">
                  <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80" alt="Kebab platter" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <div className="rounded-lg overflow-hidden aspect-square shadow-luxury border border-lavish-border">
                  <img src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" alt="Paneer curry" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="rounded-lg overflow-hidden aspect-[3/4] shadow-luxury border border-lavish-border">
                  <img src="https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80" alt="Naan bread" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </div>
            {/* Gold badge overlay */}
            <div className="absolute -bottom-4 -right-4 bg-gold-gradient rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-gold-glow">
              <Award size={18} className="text-lavish-dark mb-0.5" />
              <span className="font-cinzel text-lavish-dark text-xs font-bold leading-tight text-center">TOP<br/>RATED</span>
            </div>
          </div>

          {/* Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-10 bg-lavish-gold" />
              <span className="font-sans text-xs text-lavish-gold tracking-[0.3em] uppercase">Our Story</span>
            </div>
            <h2 className="section-title mb-4 text-left">About <br/>The Lavish</h2>
            <div className="divider-gold justify-start mb-6">
              <span className="text-lavish-gold text-sm">✦</span>
            </div>
            <p className="font-sans text-lavish-creamMuted leading-relaxed mb-4">
              {info?.about || 'Welcome to The Lavish Restaurant, where culinary grandeur meets unforgettable hospitality. For over five years, we have been serving the finest Hyderabadi Dum Biryanis, clay-oven Kebabs, and aromatic curries prepared with time-honored royal recipes.'}
            </p>
            <p className="font-sans text-lavish-creamMuted leading-relaxed mb-8">
              Every dish at The Lavish is a masterpiece — crafted with premium ingredients, freshly ground spices, and the passion of our award-winning culinary team. Whether you dine in or order through our digital menu, we promise an experience worthy of royalty.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Premium Biryanis', desc: 'Slow-cooked dum style' },
                { label: 'Live Tandoor', desc: 'Clay oven kebabs' },
                { label: 'Fresh Ingredients', desc: 'Sourced daily' },
                { label: 'Royal Ambience', desc: 'Luxury dining space' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-lavish-gold mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-sans text-sm font-semibold text-lavish-cream">{label}</div>
                    <div className="font-sans text-xs text-lavish-creamMuted">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/menu" className="btn-gold inline-flex items-center gap-2 font-cinzel tracking-widest text-sm">
              EXPLORE OUR MENU <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Featured Dishes Section ---
function FeaturedSection() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getMenuItems({ special: 'true', available: 'true' })
      .then(res => { if (res.success) setItems(res.data.slice(0, 6)); })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-20 bg-lavish-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gold-gradient opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px w-10 bg-lavish-gold" />
            <span className="font-sans text-xs text-lavish-gold tracking-[0.3em] uppercase">Chef's Recommendation</span>
            <div className="h-px w-10 bg-lavish-gold" />
          </div>
          <h2 className="section-title mb-2">Chef's Special</h2>
          <p className="font-sans text-lavish-creamMuted text-sm mt-2 max-w-md mx-auto">
            Handpicked signature creations from our Master Chef's private collection
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="card-luxury group cursor-pointer" onClick={() => navigate('/menu')}>
              <div className="relative h-52 overflow-hidden">
                <img
                  src={item.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80`}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-lavish-dark via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-lavish-gold text-lavish-dark text-xs font-cinzel font-bold px-2 py-1 rounded-sm">
                  CHEF'S SPECIAL
                </div>
                <div className="absolute top-3 right-3">
                  <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${
                    item.dietary === 'veg' ? 'border-green-500' : item.dietary === 'egg' ? 'border-yellow-500' : 'border-red-500'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      item.dietary === 'veg' ? 'bg-green-500' : item.dietary === 'egg' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lavish-cream font-semibold text-base mb-1 group-hover:text-lavish-gold transition-colors">{item.name}</h3>
                <p className="font-sans text-lavish-creamMuted text-xs line-clamp-2 mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-cinzel font-bold gold-text text-base">₹{item.price.toLocaleString('en-IN')}</span>
                  <span className="font-sans text-xs text-lavish-creamMuted">{item.portionSize}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/menu" className="btn-gold-outline font-cinzel tracking-widest text-sm inline-flex items-center gap-2 px-8 py-3">
            VIEW FULL MENU <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// --- Hours & Location Section ---
function HoursLocationSection({ info }) {
  const days = [
    { day: 'Monday – Thursday', hours: '11:30 AM – 11:00 PM' },
    { day: 'Friday', hours: '11:30 AM – 11:30 PM' },
    { day: 'Saturday', hours: '11:00 AM – 11:30 PM' },
    { day: 'Sunday', hours: '11:00 AM – 11:00 PM' },
  ];

  return (
    <section id="contact" className="py-20 bg-lavish-charcoal relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gold-gradient opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="section-title mb-2">Find Us</h2>
          <p className="font-sans text-lavish-creamMuted text-sm">We're open 7 days a week for dine-in, takeaway & delivery</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Opening Hours */}
          <div className="card-luxury p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-lavish-gold/10 border border-lavish-gold/30 rounded-full flex items-center justify-center">
                <Clock size={18} className="text-lavish-gold" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-lavish-cream tracking-wide">Opening Hours</h3>
            </div>
            <div className="space-y-3">
              {days.map(({ day, hours }) => (
                <div key={day} className="flex justify-between items-center py-2 border-b border-lavish-border/50 last:border-0">
                  <span className="font-sans text-sm text-lavish-creamMuted">{day}</span>
                  <span className="font-sans text-sm font-medium text-lavish-gold">{hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Contact */}
          <div className="card-luxury p-6 space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-lavish-gold/10 border border-lavish-gold/30 rounded-full flex items-center justify-center">
                <MapPin size={18} className="text-lavish-gold" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-lavish-cream tracking-wide">Location & Contact</h3>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-lavish-gold mt-0.5 flex-shrink-0" />
              <p className="font-sans text-sm text-lavish-creamMuted leading-relaxed">
                {info?.address || 'Plot 42, Royal Grand Avenue, Jubilee Hills, Hyderabad, Telangana 500033'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={16} className="text-lavish-gold flex-shrink-0" />
              <a href={`tel:${info?.phone}`} className="font-sans text-sm text-lavish-creamMuted hover:text-lavish-gold transition-colors">
                {info?.phone || '+91 98765 43210'}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <a href={info?.googleMapsUrl || 'https://maps.google.com'} target="_blank" rel="noopener noreferrer"
                className="btn-gold-outline text-xs py-2.5 flex items-center justify-center gap-1.5 font-sans">
                <MapPin size={12} /> Get Directions
              </a>
              <a href={`https://wa.me/${info?.whatsappNumber || '919876543210'}`} target="_blank" rel="noopener noreferrer"
                className="btn-gold text-xs py-2.5 flex items-center justify-center gap-1.5 font-sans">
                <MessageCircle size={12} /> WhatsApp
              </a>
              <a href={`tel:${info?.phone || '+919876543210'}`}
                className="col-span-2 btn-gold-outline text-xs py-2.5 flex items-center justify-center gap-1.5 font-sans">
                <Phone size={12} /> Call Us Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Reviews Section ---
const reviews = [
  { name: 'Rahul Sharma', stars: 5, text: 'The Mutton Biryani here is absolutely extraordinary! The dum cooking technique gives it an unmatched royal aroma. Best I\'ve ever had in Hyderabad.', date: '2 weeks ago', avatar: 'RS' },
  { name: 'Priya Reddy', stars: 5, text: 'Chicken Majestic and the Malai Kebab were absolutely divine! The presentation is restaurant-level quality and the food arrived piping hot. Will definitely order again!', date: '1 month ago', avatar: 'PR' },
  { name: 'Mohammed Ali', stars: 5, text: 'The Lavish never disappoints. Their Prawns Biryani is a hidden gem — fresh ocean prawns with perfectly spiced basmati. Family pack easily served 4 people generously.', date: '3 weeks ago', avatar: 'MA' },
  { name: 'Sneha Patel', stars: 5, text: 'Excellent Paneer Tikka Masala and Garlic Naan combo! The digital menu is super convenient. Scanned the QR and placed my order instantly. Very professional!', date: '1 week ago', avatar: 'SP' },
  { name: 'Kiran Kumar', stars: 5, text: 'The Chicken Platter for 5 people was a celebration in itself! Seekh Kebab, Tandoori, Malai — all perfectly done. The service is as lavish as the name suggests.', date: '2 months ago', avatar: 'KK' },
  { name: 'Deepika Nair', stars: 5, text: 'The Cream of Mushroom Soup and Palak Paneer are outstanding vegetarian options. Beautifully plated, fresh ingredients, and absolutely delicious. Highly recommend!', date: '5 days ago', avatar: 'DN' },
];

function ReviewsSection() {
  return (
    <section id="reviews" className="py-20 bg-lavish-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gold-gradient opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px w-10 bg-lavish-gold" />
            <span className="font-sans text-xs text-lavish-gold tracking-[0.3em] uppercase">What Guests Say</span>
            <div className="h-px w-10 bg-lavish-gold" />
          </div>
          <h2 className="section-title mb-2">Guest Reviews</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-lavish-gold fill-lavish-gold" />)}
            <span className="font-sans text-sm text-lavish-creamMuted ml-1">4.9/5 · 1,200+ Reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <div key={i} className="card-luxury p-5 hover:border-lavish-borderGold transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center font-cinzel text-lavish-dark font-bold text-sm flex-shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <div className="font-sans text-sm font-semibold text-lavish-cream">{review.name}</div>
                  <div className="font-sans text-xs text-lavish-creamMuted">{review.date}</div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(review.stars)].map((_, j) => <Star key={j} size={12} className="text-lavish-gold fill-lavish-gold" />)}
              </div>
              <p className="font-sans text-xs text-lavish-creamMuted leading-relaxed line-clamp-4">"{review.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Footer ---
function Footer({ info }) {
  return (
    <footer className="bg-lavish-brownDeep border-t border-lavish-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gold-gradient rounded-full flex items-center justify-center">
                <UtensilsCrossed size={14} className="text-lavish-dark" />
              </div>
              <span className="font-cinzel font-bold tracking-widest gold-text text-sm">THE LAVISH RESTAURANT</span>
            </div>
            <p className="font-serif italic text-lavish-goldLight text-sm mb-4">
              "Experience the Taste. Enjoy the Lavish Life."
            </p>
            <div className="flex gap-3">
              <a href={info?.instagramUrl || '#'} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-lavish-border rounded-full flex items-center justify-center hover:border-lavish-gold hover:text-lavish-gold transition-colors text-lavish-creamMuted">
                <Instagram size={15} />
              </a>
              <a href={`https://wa.me/${info?.whatsappNumber || '919876543210'}`} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-lavish-border rounded-full flex items-center justify-center hover:border-lavish-gold hover:text-lavish-gold transition-colors text-lavish-creamMuted">
                <MessageCircle size={15} />
              </a>
              <a href={`tel:${info?.phone || ''}`}
                className="w-9 h-9 border border-lavish-border rounded-full flex items-center justify-center hover:border-lavish-gold hover:text-lavish-gold transition-colors text-lavish-creamMuted">
                <Phone size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel text-sm font-bold text-lavish-cream tracking-widest mb-4">QUICK LINKS</h4>
            <div className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Digital Menu', href: '/menu' },
                { label: 'Admin Login', href: '/admin/login' },
              ].map(({ label, href }) => (
                <a key={label} href={href} className="block font-sans text-sm text-lavish-creamMuted hover:text-lavish-gold transition-colors">{label}</a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-cinzel text-sm font-bold text-lavish-cream tracking-widest mb-4">CONTACT</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-lavish-gold mt-0.5 flex-shrink-0" />
                <span className="font-sans text-sm text-lavish-creamMuted leading-relaxed">
                  {info?.address || 'Jubilee Hills, Hyderabad, Telangana'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-lavish-gold flex-shrink-0" />
                <span className="font-sans text-sm text-lavish-creamMuted">{info?.phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-lavish-gold flex-shrink-0" />
                <span className="font-sans text-sm text-lavish-creamMuted">Mon–Sun: 11:30 AM – 11:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-lavish-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-sans text-xs text-lavish-creamMuted text-center">
            © 2026 The Lavish Restaurant. All rights reserved.
          </p>
          <p className="font-sans text-xs text-lavish-creamMuted">
            Crafted with ♥ for Royal Dining Experiences
          </p>
        </div>
      </div>
    </footer>
  );
}

// --- Back to Top Button ---
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
      className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-gold-gradient rounded-full flex items-center justify-center shadow-gold-glow hover:scale-110 active:scale-95 transition-transform duration-200">
      <ChevronDown size={18} className="text-lavish-dark rotate-180" />
    </button>
  );
}

// --- Main HomePage ---
export default function HomePage() {
  const [restaurantInfo, setRestaurantInfo] = useState(null);

  useEffect(() => {
    api.getRestaurantInfo().then(res => {
      if (res.success) setRestaurantInfo(res.data);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-lavish-dark">
      <Navbar info={restaurantInfo} />
      <HeroSection info={restaurantInfo} />
      <AboutSection info={restaurantInfo} />
      <FeaturedSection />
      <ReviewsSection />
      <HoursLocationSection info={restaurantInfo} />
      <Footer info={restaurantInfo} />
      <BackToTop />
      {/* Floating WhatsApp */}
      <a href={`https://wa.me/${restaurantInfo?.whatsappNumber || '919876543210'}?text=Hello! I'd like to order from The Lavish Restaurant.`}
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-20 right-6 z-50 w-11 h-11 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200 hover:bg-green-400">
        <MessageCircle size={20} className="text-white" />
      </a>
    </div>
  );
}
