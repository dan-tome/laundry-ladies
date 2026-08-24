/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Wind, 
  Zap, 
  Heart, 
  Truck, 
  Calendar, 
  ChevronDown, 
  ShieldCheck, 
  Check, 
  Menu, 
  X, 
  Star, 
  PhoneCall, 
  MapPin, 
  Clock, 
  Lock, 
  Info,
  Gift,
  AlertCircle
} from 'lucide-react';
import Logo from './components/Logo';
import PricingCalculator from './components/PricingCalculator';
import BookingForm from './components/BookingForm';
import ValetPortal from './components/ValetPortal';
import { SERVICE_CATEGORIES } from './data';

export default function App() {
  const [selectedItems, setSelectedItems] = useState<{ [itemId: string]: number }>({});
  const [preferredSlotId, setPreferredSlotId] = useState<string>('slot_midday');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  // Navigation states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Callback when user confirms from pricing calculator
  const handleProceedToBooking = (quantities: { [itemId: string]: number }, slotId: string) => {
    setSelectedItems(quantities);
    setPreferredSlotId(slotId);
    
    // Smooth scroll down to the booking form
    setTimeout(() => {
      const element = document.getElementById('booking-portal-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Callback on successful booking
  const handleBookingSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleClearSelection = () => {
    setSelectedItems({});
  };

  return (
    <div className="min-h-screen bg-surface text-navy-900 font-sans selection:bg-mint-200 selection:text-navy-900 overflow-x-hidden antialiased">
      
      {/* Sticky Premium Glassmorphic Header */}
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-navy-200 py-4 px-6 md:px-12 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Small Brand Logo Left */}
          <div 
            onClick={() => scrollToSection('hero-section')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Logo size="sm" showText={false} className="animate-none" />
            <div>
              <span className="font-serif text-sm md:text-base font-medium tracking-[0.2em] text-navy-700 uppercase leading-none block group-hover:text-coral-700 transition-colors">
                The Laundry Ladies
              </span>
              <span className="text-[8px] tracking-[0.4em] text-navy-500 uppercase block mt-1">
                Est. 2026
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-10 text-[10px] uppercase tracking-[0.3em] text-navy-600 font-semibold">
            <button onClick={() => scrollToSection('services-section')} className="hover:text-coral-700 transition-colors cursor-pointer">Services</button>
            <button onClick={() => scrollToSection('wheels-section')} className="hover:text-coral-700 transition-colors cursor-pointer">The Mobile Van</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-coral-700 transition-colors cursor-pointer">How It Works</button>
            <button onClick={() => scrollToSection('pricing-section')} className="hover:text-coral-700 transition-colors cursor-pointer">Cost Estimator</button>
            <button 
              onClick={() => {
                setShowAdminPanel(true);
                setTimeout(() => scrollToSection('admin-section'), 100);
              }} 
              className={`flex items-center gap-1 transition-colors cursor-pointer ${showAdminPanel ? 'text-navy-700' : 'hover:text-coral-700'}`}
            >
              <Lock className="w-3 h-3 text-navy-500" /> Valet Console
            </button>
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-6">
            <a 
              href="tel:+442079460192" 
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-navy-600 hover:text-coral-700 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-navy-700" /> <span>020 7946 0192</span>
            </a>
            <button
              onClick={() => scrollToSection('pricing-section')}
              className="bg-navy-700 text-white font-bold text-[10px] py-2.5 px-6 uppercase tracking-widest hover:bg-navy-600 transition-colors duration-300"
            >
              Book Pickup
            </button>
            
            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-navy-700 p-1 hover:text-navy-900 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[73px] z-40 bg-surface/95 backdrop-blur-lg border-t border-navy-200 lg:hidden p-8 space-y-8">
          <nav className="flex flex-col gap-6 text-[11px] font-semibold tracking-[0.25em] uppercase text-navy-600">
            <button onClick={() => scrollToSection('services-section')} className="text-left py-3 border-b border-navy-100 hover:text-coral-700">Services</button>
            <button onClick={() => scrollToSection('wheels-section')} className="text-left py-3 border-b border-navy-100 hover:text-coral-700">The Mobile Van</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-left py-3 border-b border-navy-100 hover:text-coral-700">How It Works</button>
            <button onClick={() => scrollToSection('pricing-section')} className="text-left py-3 border-b border-navy-100 hover:text-coral-700">Cost Estimator</button>
            <button 
              onClick={() => {
                setShowAdminPanel(true);
                setTimeout(() => scrollToSection('admin-section'), 100);
              }} 
              className="text-left py-3 border-b border-navy-100 hover:text-coral-700 flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4 text-navy-700" /> Valet Console
            </button>
          </nav>
          <div className="space-y-4 pt-6 border-t border-navy-100">
            <a href="tel:+442079460192" className="flex items-center gap-2 text-navy-700 font-semibold text-xs tracking-wider uppercase">
              <PhoneCall className="w-4 h-4" /> 020 7946 0192
            </a>
            <p className="text-xs text-navy-500 leading-relaxed font-sans">
              Serving Chelsea, Kensington, Belgravia, Mayfair & Westminster's premier addresses.
            </p>
          </div>
        </div>
      )}

      {/* Hero Spotlight Section */}
      <section id="hero-section" className="relative pt-16 pb-28 md:py-36 px-6 overflow-hidden border-b border-navy-100 flex flex-col items-center">
        {/* Ambient background decorative glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-mint-200/60 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -top-10 left-10 w-32 h-32 bg-coral-200/50 blur-[60px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Big Central Emblem Re-creation */}
          <Logo size="lg" showText={true} className="mb-6" />

          {/* Subtext and Main Heading */}
          <div className="space-y-4">
            <span className="text-navy-700 uppercase tracking-[0.4em] text-[11px] font-bold block">
              Boutique Mobile Dry Cleaning
            </span>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light leading-[1.1] text-navy-900 tracking-wide">
              Luxury Garment Care <br/>
              <span className="italic text-navy-700">Delivered</span>
            </h1>
          </div>

          <p className="text-navy-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-sans">
            Expert garment restoration and professional dry cleaning collected and returned to your doorstep. The ultimate convenience for the modern wardrobe. Est. 2026.
          </p>

          {/* Quick CTA Actions */}
          <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-6">
            <button
              onClick={() => scrollToSection('pricing-section')}
              className="w-full sm:w-auto bg-navy-700 text-white px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-navy-600 transition-colors duration-300"
            >
              Interactive Cost Estimate
            </button>
            <button
              onClick={() => scrollToSection('booking-portal-section')}
              className="w-full sm:w-auto bg-transparent border border-navy-200 hover:bg-mint-100 text-navy-700 text-[11px] font-bold uppercase tracking-widest px-10 py-4 transition-colors duration-300"
            >
              Direct Book Pickup
            </button>
          </div>

          {/* Bulleted trust badges */}
          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-[10px] md:text-[11px] text-navy-600 uppercase tracking-[0.2em] font-medium border-t border-navy-100">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-navy-700" /> White-Glove Valet
            </div>
            <div className="flex items-center justify-center gap-2">
              <Wind className="w-4 h-4 text-navy-700" /> Eco-Luxe Solvents
            </div>
            <div className="flex items-center justify-center gap-2">
              <Truck className="w-4 h-4 text-navy-700" /> Mobile Crease-Free
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-navy-700" /> 100% Post-Care Billing
            </div>
          </div>

        </div>
      </section>

      {/* The Wheels spotlight ("On Wheels") */}
      <section id="wheels-section" className="py-24 px-6 max-w-7xl mx-auto border-b border-navy-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Spotlight Details (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <span className="text-navy-700 uppercase tracking-[0.4em] text-[11px] font-bold block">Elite Wardrobe Mobility</span>
            <h3 className="font-serif text-3xl md:text-5xl font-light text-navy-900 leading-tight">
              Your Fine Clothing Never Leaves <span className="italic text-navy-700">Protective Hanging Care</span>
            </h3>
            
            <p className="text-navy-600 text-sm leading-relaxed font-sans max-w-2xl">
              Unlike traditional laundry services that stuff your pristine clothing into giant transport bags, our state-of-the-art <strong className="text-navy-900 font-medium">Dry Cleaning on Wheels</strong> model operates with specialized climate-controlled mobile boutiques. 
            </p>
            
            <div className="space-y-6 pt-4 text-sm">
              <div className="flex gap-4">
                <div className="w-10 h-10 border border-navy-200 flex items-center justify-center text-navy-700 flex-shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-light text-navy-900">Full Length Hanging Rails</h4>
                  <p className="text-navy-500 text-xs mt-1 leading-relaxed max-w-xl">From pick-up to doorstep drop-off, your suits, cocktail dresses, and silk coats remain hung on supportive wide-shoulder hangers, completely preventing travel creases.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 border border-navy-200 flex items-center justify-center text-navy-700 flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-light text-navy-900">Pristine Timing Coordination</h4>
                  <p className="text-navy-500 text-xs mt-1 leading-relaxed max-w-xl">Select customizable VIP priority morning and evening collection windows. Perfect for busy professionals, corporate galas, and pre-travel packing.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 border border-navy-200 flex items-center justify-center text-navy-700 flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-light text-navy-900">Ecological Fabric Chemistry</h4>
                  <p className="text-navy-500 text-xs mt-1 leading-relaxed max-w-xl">We utilize odorless, non-toxic, biodegradable solvents that are highly effective on deep stains yet incredibly gentle on natural silk, fine cashmeres, and lace fibers.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Showcase Block (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-surface-raised border border-navy-200 p-8 relative overflow-hidden">
              {/* Soft mint wash in the corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-mint-200/70 blur-3xl rounded-none" />
              
              <div className="space-y-8">
                <span className="text-navy-700 uppercase tracking-[0.3em] text-[10px] font-bold block">The Mobile Van Specs</span>
                
                <div className="space-y-4 font-sans text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-navy-100">
                    <span className="text-navy-500 font-medium tracking-wider text-[10px] uppercase">Valet Vehicle</span>
                    <span className="text-navy-900 font-serif font-light text-sm">Bespoke Mercedes Sprinter Elite</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-navy-100">
                    <span className="text-navy-500 font-medium tracking-wider text-[10px] uppercase">Hanging Capacity</span>
                    <span className="text-navy-900 font-serif font-light text-sm">Up to 120 Garments In Care</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-navy-100">
                    <span className="text-navy-500 font-medium tracking-wider text-[10px] uppercase">Climate Control</span>
                    <span className="text-navy-900 font-serif font-light text-sm">Steady 18°C / 45% Humidified</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-navy-100">
                    <span className="text-navy-500 font-medium tracking-wider text-[10px] uppercase">Wardrobe Accessibility</span>
                    <span className="text-navy-900 font-serif font-light text-sm">Protective Garment Shields</span>
                  </div>
                </div>

                {/* Micro illustration inside card */}
                <div className="bg-surface p-6 border border-navy-100 flex flex-col items-center justify-center space-y-3">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-serif text-5xl font-light text-navy-700">0</span>
                    <span className="text-navy-700 text-sm font-semibold tracking-widest uppercase">Crease</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-navy-500 text-center leading-normal">
                    Designed to simulate high-end boutique closets so your luxury wear arrives ready to wear.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Services Portfolio Grid */}
      <section id="services-section" className="bg-surface py-24 px-6 border-b border-navy-100">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-3">
            <span className="text-navy-700 uppercase tracking-[0.4em] text-[11px] font-bold block">Crafted Rejuvenation</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-navy-900 tracking-wide">
              Our Signature <span className="italic text-navy-700">Garment Services</span>
            </h2>
            <p className="text-navy-600 text-sm max-w-lg mx-auto leading-relaxed">
              Explore our four specialized restoration categories, designed to extend the life of your wardrobe investments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-mint-200 border border-navy-200">
            {SERVICE_CATEGORIES.map((cat, idx) => {
              const icons: { [key: string]: React.ReactNode } = {
                'Sparkles': <Sparkles className="w-5 h-5 text-navy-700" />,
                'Wind': <Wind className="w-5 h-5 text-navy-700" />,
                'Zap': <Zap className="w-5 h-5 text-navy-700" />,
                'Heart': <Heart className="w-5 h-5 text-navy-700" />,
              };
              return (
                <div 
                  key={cat.id} 
                  className="bg-surface-raised p-8 min-h-[300px] flex flex-col justify-between hover:bg-navy-800 transition-colors duration-300 relative group"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-3xl font-serif text-navy-400 group-hover:text-coral-700 transition-colors">0{idx + 1}</span>
                    <div className="w-10 h-10 border border-navy-200 flex items-center justify-center">
                      {icons[cat.iconName] || <Sparkles className="w-5 h-5 text-navy-700" />}
                    </div>
                  </div>
                  
                  <div className="mt-8 space-y-2">
                    <h4 className="font-serif text-xl font-light text-navy-900 tracking-wide group-hover:text-coral-700 transition-colors">{cat.name}</h4>
                    <p className="text-navy-500 text-xs leading-relaxed font-sans">{cat.description}</p>
                  </div>

                  <button 
                    onClick={() => scrollToSection('pricing-section')} 
                    className="mt-6 text-navy-700 text-[10px] tracking-[0.2em] uppercase font-semibold hover:text-navy-900 flex items-center gap-1.5 transition-colors self-start"
                  >
                    View Rates <ChevronDown className="w-3 h-3 -rotate-90 text-navy-700" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* How it Works Section (5 steps) */}
      <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto space-y-16 border-b border-navy-100">
        
        <div className="text-center space-y-3">
          <span className="text-navy-700 uppercase tracking-[0.4em] text-[11px] font-bold block">The Customer Loop</span>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-navy-900 tracking-wide">
            How Doorstep Mobile <span className="italic text-navy-700">Care Operates</span>
          </h2>
          <p className="text-navy-600 text-sm max-w-lg mx-auto leading-relaxed">
            Our white-glove process ensures maximum convenience with absolute zero-compromise care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
          
          {/* Symmetrical timeline connector line on desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-navy-200/0 via-navy-200 to-navy-200/0 z-0" />

          {[
            {
              num: '1',
              title: 'Schedule Online',
              desc: 'Select preferred collection date & VIP morning or evening window using our online estimator.',
            },
            {
              num: '2',
              title: 'Hanging Pick-up',
              desc: 'A professional valet collects your garments at your door, logging them directly on hanging racks.',
            },
            {
              num: '3',
              title: 'Artisanal Care',
              desc: 'Fibers are evaluated, stain-extracted, eco-cleansed, and individually shaped in our main hub.',
            },
            {
              num: '4',
              title: 'Crisp Finish',
              desc: 'Every item is hand-finished, steam-aligned, and encased in breathable custom garment covers.',
            },
            {
              num: '5',
              title: 'Prêt-à-Porter Return',
              desc: 'Your valet returns them crease-free to your door. Hang them straight in your wardrobe.',
            }
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-5 relative z-10 group">
              <div className="w-10 h-10 border border-navy-300 bg-surface flex items-center justify-center font-mono text-sm font-semibold text-navy-700 group-hover:bg-navy-700 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                0{step.num}
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-lg font-light text-navy-900 tracking-wide">{step.title}</h4>
                <p className="text-navy-500 text-xs leading-relaxed max-w-[200px] mx-auto font-sans">{step.desc}</p>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* Interactive Pricing Estimator Section */}
      <section id="pricing-section" className="bg-surface-raised py-24 px-6 border-b border-navy-100">
        <div className="max-w-7xl mx-auto space-y-10">
          <PricingCalculator onProceedToBooking={handleProceedToBooking} initialQuantities={selectedItems} />
        </div>
      </section>

      {/* Scheduling & Booking Form Section */}
      <section id="booking-portal-section" className="py-24 px-6 max-w-7xl mx-auto space-y-12 scroll-mt-20 border-b border-navy-100">
        <div className="text-center mb-10 space-y-3">
          <span className="text-navy-700 uppercase tracking-[0.4em] text-[11px] font-bold block">Doorstep Dispatch Scheduler</span>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-navy-900 tracking-wide">Secure Your <span className="italic text-navy-700">Collection</span></h2>
          <p className="text-navy-600 text-sm max-w-sm mx-auto leading-relaxed font-sans">
            Finalize dates, preferred timings, and collection address. We take care of the rest.
          </p>
        </div>
        <BookingForm 
          selectedQuantities={selectedItems} 
          preferredTimeSlotId={preferredSlotId} 
          onBookingSuccess={handleBookingSuccess}
          onClearSelection={handleClearSelection}
        />
      </section>

      {/* Elite Client Reviews */}
      <section className="bg-surface-raised py-24 px-6 border-b border-navy-100">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-3">
            <span className="text-navy-700 uppercase tracking-[0.4em] text-[11px] font-bold block">Guest Testimonials</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-navy-900 tracking-wide">
              Trusted by London's <span className="italic text-navy-700">Finest Wardrobes</span>
            </h2>
            <p className="text-navy-600 text-sm">Pragmatic reviews from our highly valued residents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-mint-200 border border-navy-200">
            {[
              {
                text: 'The absolute height of luxury convenience. My designer suits are collected on hangers and returned in pristine crease-free condition on full hanging rails. "The Laundry Ladies" has saved me hours of errands.',
                author: 'Lord Julian Sterling',
                loc: 'Belgravia SW1'
              },
              {
                text: 'Extremely professional doorstep service. Their eco-solvents completely eliminated red wine stains on my vintage silk gown without any chemical odors. The evening VIP slot is perfect for pre-travel.',
                author: 'Lady Genevieve de Montfort',
                loc: 'Chelsea SW3'
              },
              {
                text: 'A brilliant model! The valet sprinter is beautifully clean and organized inside. My cashmere sweaters feel incredibly soft, almost brand new. Having an online billing receipt post-care gives total peace of mind.',
                author: 'Charles Montgomery, Esq.',
                loc: 'Kensington W8'
              }
            ].map((rev, idx) => (
              <div key={idx} className="bg-surface p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-gold-500 text-navy-700" />
                    ))}
                  </div>
                  <p className="text-navy-600 text-xs italic leading-relaxed font-sans">"{rev.text}"</p>
                </div>
                <div className="border-t border-navy-100 pt-4 flex justify-between items-baseline">
                  <span className="font-serif text-base font-light text-navy-900">{rev.author}</span>
                  <span className="text-[9px] uppercase text-navy-700 font-mono tracking-[0.15em]">{rev.loc}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Administrative Valet Console Section Toggle */}
      <section id="admin-section" className="py-24 px-6 max-w-7xl mx-auto border-b border-navy-100">
        <div className="text-center mb-8">
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="inline-flex items-center gap-2 bg-surface-raised border border-navy-200 hover:border-coral-400 hover:bg-mint-50 text-navy-700 px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase font-bold transition-colors duration-300"
          >
            <Lock className="w-3.5 h-3.5 text-navy-500" /> 
            {showAdminPanel ? 'Collapse Valet Console' : 'Open Valet Dispatch Console'}
          </button>
          {!showAdminPanel && (
            <p className="text-[10px] uppercase tracking-wider text-navy-500 mt-4 max-w-xs mx-auto">
              For business owner administration (PIN required). Update booking status, manage queues, view stats.
            </p>
          )}
        </div>

        {showAdminPanel && (
          <div className="pt-2">
            <ValetPortal onRefreshTrigger={refreshTrigger} />
          </div>
        )}
      </section>

      {/* Luxury Footer */}
      <footer className="bg-surface py-20 px-6 md:px-12 border-t border-navy-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Logo & Slogan Column (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <Logo size="sm" showText={false} className="animate-none" />
              <div>
                <span className="font-serif text-base font-medium tracking-[0.2em] text-navy-700 uppercase leading-none block">
                  The Laundry Ladies
                </span>
                <span className="text-[8px] tracking-[0.4em] text-navy-500 uppercase block mt-1">
                  Doorstep Service Est. 2026
                </span>
              </div>
            </div>
            <p className="text-xs text-navy-500 leading-relaxed max-w-sm">
              Crafting premium fabric restoration and dry cleaning on wheels. Our temperature-regulated mobile care vans serve central London's premier residential enclaves with pristine doorstep collection and courier return.
            </p>
            <p className="text-[9px] uppercase tracking-wider text-navy-500 font-mono">
              © 2026 The Laundry Ladies Ltd. All rights preserved.
            </p>
          </div>

          {/* Operation coverage (4 cols) */}
          <div className="md:col-span-4 space-y-6 text-xs font-sans">
            <h4 className="font-serif text-sm font-light text-navy-900 tracking-[0.2em] uppercase">VALET SERVICE AREA</h4>
            <div className="space-y-2.5 text-navy-600">
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-navy-700 flex-shrink-0" /> Chelsea (SW3, SW10)</p>
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-navy-700 flex-shrink-0" /> Kensington (W8, SW7)</p>
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-navy-700 flex-shrink-0" /> Belgravia & Mayfair (SW1X, W1K)</p>
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-navy-700 flex-shrink-0" /> Westminster & St James's (SW1A, SW1P)</p>
            </div>
          </div>

          {/* Contacts (3 cols) */}
          <div className="md:col-span-3 space-y-6 text-xs font-sans">
            <h4 className="font-serif text-sm font-light text-navy-900 tracking-[0.2em] uppercase">WARDROBE CONCIERGE</h4>
            <div className="space-y-3.5 text-navy-600">
              <p>
                <span className="text-navy-500 block uppercase text-[10px] tracking-wider font-semibold">Direct Hot-line:</span>
                <a href="tel:+442079460192" className="text-navy-700 font-semibold hover:underline mt-1 block">020 7946 0192</a>
              </p>
              <p>
                <span className="text-navy-500 block uppercase text-[10px] tracking-wider font-semibold">Email Support:</span>
                <a href="mailto:concierge@laundryladies.co.uk" className="text-navy-700 font-semibold hover:underline mt-1 block">concierge@laundryladies.co.uk</a>
              </p>
              <p>
                <span className="text-navy-500 block uppercase text-[10px] tracking-wider font-semibold">Operation Hours:</span>
                <span className="text-navy-600 block mt-1">Mon - Sat: 07:00 AM - 08:30 PM</span>
              </p>
            </div>
          </div>

        </div>

        {/* Status Bar Section */}
        <div className="border-t border-navy-200 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap gap-6 items-center justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-navy-600 font-bold">Now accepting bookings</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-navy-100"></div>
            <span className="text-[11px] text-navy-500">Mon–Sat: 07:00 — 21:00</span>
          </div>
          <div className="text-[11px] text-navy-700 font-serif italic tracking-wider">
            “Elegance, preserved.”
          </div>
          <div className="text-navy-500 text-[11px] tracking-tighter font-mono">
            +44 20 7946 0192
          </div>
        </div>
      </footer>

    </div>
  );
}
