/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Ticket, 
  Copy, 
  Clock, 
  ArrowLeft, 
  AlertCircle,
  Plus,
  Minus,
  Trash2,
  FileText
} from 'lucide-react';
import { SERVICE_ITEMS, TIME_SLOTS } from '../data';
import { Booking, BookingItemSelection } from '../types';

interface BookingFormProps {
  selectedQuantities: { [itemId: string]: number };
  preferredTimeSlotId: string;
  onBookingSuccess: () => void;
  onClearSelection: () => void;
}

export default function BookingForm({ 
  selectedQuantities, 
  preferredTimeSlotId, 
  onBookingSuccess,
  onClearSelection 
}: BookingFormProps) {
  // Step manager: 1 = Edit Items, 2 = Date/Time, 3 = Address/Details, 4 = Confirmed Ticket
  const [step, setStep] = useState<number>(1);
  const [quantities, setQuantities] = useState<{ [itemId: string]: number }>(selectedQuantities);
  const [selectedSlotId, setSelectedSlotId] = useState<string>(preferredTimeSlotId || 'slot_midday');
  
  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [notes, setNotes] = useState('');
  
  // Active/Created booking
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Sync quantities when pricing calculator pushes new selections
  useEffect(() => {
    if (Object.keys(selectedQuantities).length > 0) {
      setQuantities(selectedQuantities);
      if (step === 1) {
        setStep(2); // Jump straight to date and slot selection if they came from the pricing calculator
      }
    }
  }, [selectedQuantities]);

  useEffect(() => {
    if (preferredTimeSlotId) {
      setSelectedSlotId(preferredTimeSlotId);
    }
  }, [preferredTimeSlotId]);

  // Generate date options (starting tomorrow, for 14 days)
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      
      const yyyy = nextDate.getFullYear();
      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dd = String(nextDate.getDate()).padStart(2, '0');
      const formattedDate = `${yyyy}-${mm}-${dd}`;
      
      const weekday = nextDate.toLocaleDateString('en-GB', { weekday: 'short' });
      const dayNum = nextDate.getDate();
      const monthStr = nextDate.toLocaleDateString('en-GB', { month: 'short' });
      
      dates.push({
        value: formattedDate,
        weekday,
        dayNum,
        monthStr
      });
    }
    return dates;
  }, []);

  // Set default date to tomorrow
  useEffect(() => {
    if (availableDates.length > 0 && !pickupDate) {
      setPickupDate(availableDates[0].value);
    }
  }, [availableDates, pickupDate]);

  // Handle basket modifications inside the booking form
  const handleQuantityChange = (itemId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[itemId];
      } else {
        updated[itemId] = next;
      }
      return updated;
    });
  };

  const selectedItemsList = useMemo(() => {
    return Object.entries(quantities).map(([itemId, qty]) => {
      const item = SERVICE_ITEMS.find(i => i.id === itemId);
      return { item, quantity: qty };
    }).filter(x => x.item !== undefined);
  }, [quantities]);

  // Financial calculations
  const subtotal = useMemo(() => {
    return selectedItemsList.reduce((acc, current) => {
      return acc + (current.item ? current.item.price * current.quantity : 0);
    }, 0);
  }, [selectedItemsList]);

  const selectedSlot = useMemo(() => {
    return TIME_SLOTS.find(s => s.id === selectedSlotId);
  }, [selectedSlotId]);

  const serviceFee = subtotal > 0 ? (selectedSlot?.priceMarkup || 0) : 0;
  const deliveryFee = subtotal === 0 ? 0 : (subtotal >= 60 ? 0 : 7.50);
  const totalAmount = subtotal === 0 ? 0 : subtotal + serviceFee + deliveryFee;

  // Handle form submission and booking creation
  const handlePlaceBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItemsList.length === 0 || !customerName || !customerEmail || !customerPhone || !address || !pickupDate || !selectedSlotId) {
      return;
    }

    // Generate luxurious unique tracking ID
    const randomHex = Math.random().toString(16).substr(2, 4).toUpperCase();
    const bookingId = `LL-2026-${randomHex}`;

    const newBooking: Booking = {
      id: bookingId,
      customerName,
      customerEmail,
      customerPhone,
      address,
      pickupDate,
      timeSlotId: selectedSlotId,
      items: Object.entries(quantities).map(([itemId, quantity]) => ({ itemId, quantity: Number(quantity) })),
      notes,
      status: 'Pending Collection',
      totalAmount,
      createdAt: new Date().toISOString()
    };

    // Save to local storage database
    const existingBookingsStr = localStorage.getItem('laundry_ladies_bookings');
    let bookingsList: Booking[] = [];
    if (existingBookingsStr) {
      try {
        bookingsList = JSON.parse(existingBookingsStr);
      } catch (err) {
        bookingsList = [];
      }
    }
    bookingsList.unshift(newBooking);
    localStorage.setItem('laundry_ladies_bookings', JSON.stringify(bookingsList));

    // Clear counters and transition to confirmation ticket screen
    setCreatedBooking(newBooking);
    setStep(4);
    onBookingSuccess();
  };

  const handleCopyId = () => {
    if (!createdBooking) return;
    navigator.clipboard.writeText(createdBooking.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const resetFormState = () => {
    setQuantities({});
    setStep(1);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setAddress('');
    setNotes('');
    setCreatedBooking(null);
    onClearSelection();
  };

  return (
    <div id="booking-section" className="scroll-mt-24 max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-surface-raised border border-navy-200 p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <span className="text-navy-700 uppercase tracking-[0.4em] text-[11px] font-bold block mb-2">Doorstep Valet Booking</span>
              <h3 className="font-serif text-2xl md:text-3xl font-light text-navy-900 tracking-wide">Select Your Wardrobe Items</h3>
              <p className="text-navy-600 text-sm mt-1">First, let us know what we will be dry cleaning or washing for you.</p>
            </div>

            {selectedItemsList.length === 0 ? (
              <div className="py-12 border border-navy-200 text-center space-y-4">
                <p className="text-navy-600 text-sm font-sans">No items currently active in your collection cart.</p>
                <p className="text-navy-500 text-xs font-sans">Use the interactive Care & Cost Planner above, or add items here to begin.</p>
                <a
                  href="#pricing-calculator"
                  className="inline-block bg-navy-700 text-white text-[11px] uppercase tracking-[0.2em] font-bold px-8 py-3.5 hover:bg-navy-800 transition-colors"
                >
                  Open Pricing Planner
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3">
                  {selectedItemsList.map(({ item, quantity }) => {
                    if (!item) return null;
                    return (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-surface border border-navy-100">
                        <div>
                          <h4 className="font-serif font-light text-base text-navy-900 tracking-wide">{item.name}</h4>
                          <span className="text-navy-700 font-mono text-xs">£{item.price.toFixed(2)} each</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="w-8 h-8 border border-navy-200 flex items-center justify-center text-navy-700 hover:bg-navy-800 hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-navy-900 font-mono font-bold w-4 text-center">{quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="w-8 h-8 border border-navy-200 flex items-center justify-center text-navy-700 hover:bg-navy-800 hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-navy-100 pt-6 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-navy-500 block uppercase tracking-wider font-semibold">Estimated Items Subtotal</span>
                    <span className="font-mono text-xl font-bold text-navy-700">£{subtotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="bg-navy-700 text-white font-bold text-xs tracking-widest uppercase py-4 px-6 hover:bg-navy-800 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Set Collection Time <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-surface-raised border border-navy-200 p-8 md:p-12 space-y-8"
          >
            <div className="flex items-center justify-between border-b border-navy-100 pb-5">
              <button onClick={() => setStep(1)} className="text-navy-600 hover:text-coral-700 text-xs flex items-center gap-1.5 transition-colors cursor-pointer font-sans uppercase tracking-wider font-bold">
                <ArrowLeft className="w-4 h-4" /> Edit Items
              </button>
              <div className="text-right">
                <span className="text-navy-700 text-[10px] uppercase tracking-widest font-bold">Step 2 of 3</span>
                <h4 className="font-serif font-light text-navy-900 text-base tracking-wide mt-0.5">Date & Time Selection</h4>
              </div>
            </div>

            {/* Date Picker (Luxurious horizontal layout) */}
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-navy-700 uppercase tracking-[0.2em] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-navy-700" /> Select Collection Date
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-px bg-mint-200 border border-navy-200">
                {availableDates.map(dateObj => {
                  const isSelected = pickupDate === dateObj.value;
                  return (
                    <button
                      key={dateObj.value}
                      type="button"
                      onClick={() => setPickupDate(dateObj.value)}
                      className={`flex flex-col items-center justify-center p-4 text-center transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-navy-700 text-white font-bold'
                          : 'bg-surface-raised text-navy-600 hover:bg-navy-50 hover:text-coral-700'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wider leading-none font-semibold">{dateObj.weekday}</span>
                      <span className="text-lg font-mono font-bold leading-tight my-1.5 block">{dateObj.dayNum}</span>
                      <span className="text-[9px] uppercase tracking-widest leading-none font-medium">{dateObj.monthStr}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-navy-700 uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock className="w-4 h-4 text-navy-700" /> Select Service Time Slot
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TIME_SLOTS.map(slot => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`flex items-center justify-between p-5 border text-left transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-mint-100 border-navy-300 text-navy-900'
                          : 'bg-surface border-navy-100 text-navy-600 hover:border-coral-300'
                      }`}
                    >
                      <div>
                        <span className={`text-sm font-bold block tracking-wider uppercase ${isSelected ? 'text-navy-700' : 'text-navy-900'}`}>{slot.label}</span>
                        <span className="text-[10px] text-navy-500 block mt-1">{slot.timeRange}</span>
                      </div>
                      <div className="text-right font-mono text-xs">
                        {slot.premium ? (
                          <div className="flex flex-col items-end">
                            <span className="text-navy-700 font-medium">+£{slot.priceMarkup.toFixed(2)}</span>
                            <span className="bg-mint-100 text-navy-700 px-1.5 py-0.5 text-[8px] uppercase font-bold tracking-widest font-sans mt-1">VIP Priority</span>
                          </div>
                        ) : (
                          <span className="text-green-700 font-medium uppercase text-[10px] tracking-wider">Included</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-navy-100 pt-6 flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase text-navy-500 block tracking-wider font-semibold">Scheduled Date</span>
                <span className="text-sm font-semibold text-navy-900 tracking-wide">
                  {pickupDate ? new Date(pickupDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Not selected'}
                </span>
              </div>
              <button
                onClick={() => setStep(3)}
                className="bg-navy-700 text-white font-bold text-xs tracking-widest uppercase py-4 px-6 hover:bg-navy-800 transition-all flex items-center gap-2 cursor-pointer"
              >
                Enter Details <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-surface-raised border border-navy-200 p-8 md:p-12"
          >
            <div className="flex items-center justify-between border-b border-navy-100 pb-5 mb-8">
              <button onClick={() => setStep(2)} className="text-navy-600 hover:text-coral-700 text-xs flex items-center gap-1.5 transition-colors cursor-pointer font-sans uppercase tracking-wider font-bold">
                <ArrowLeft className="w-4 h-4" /> Pick-up Window
              </button>
              <div className="text-right">
                <span className="text-navy-700 text-[10px] uppercase tracking-widest font-bold">Step 3 of 3</span>
                <h4 className="font-serif font-light text-navy-900 text-base tracking-wide mt-0.5">Doorstep & Contacts</h4>
              </div>
            </div>

            <form onSubmit={handlePlaceBooking} className="space-y-6">
              {/* Client Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] text-navy-700 tracking-widest font-bold uppercase flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Lady Victoria Sterling"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full bg-surface border border-navy-100 px-4 py-3.5 text-sm text-navy-900 focus:outline-none focus:border-navy-500 placeholder-navy-400 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] text-navy-700 tracking-widest font-bold uppercase flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="E.g., +44 7700 900077"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full bg-surface border border-navy-100 px-4 py-3.5 text-sm text-navy-900 focus:outline-none focus:border-navy-500 placeholder-navy-400 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-navy-700 tracking-widest font-bold uppercase flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="E.g., victoria@mayfair.com"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full bg-surface border border-navy-100 px-4 py-3.5 text-sm text-navy-900 focus:outline-none focus:border-navy-500 placeholder-navy-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-navy-700 tracking-widest font-bold uppercase flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> Doorstep Collection Address
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Street name, building/flat number, postcode (London coverage)"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-surface border border-navy-100 px-4 py-3.5 text-sm text-navy-900 focus:outline-none focus:border-navy-500 placeholder-navy-400 transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-navy-700 tracking-widest font-bold uppercase flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Special Care Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Delicate silk trimmings, separate darks, leave on porch hanger, etc."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-surface border border-navy-100 px-4 py-3.5 text-sm text-navy-900 focus:outline-none focus:border-navy-500 placeholder-navy-400 transition-colors resize-none"
                />
              </div>

              <div className="bg-mint-50 border border-navy-200 p-4 flex gap-3 text-xs leading-relaxed text-navy-700">
                <AlertCircle className="w-4 h-4 text-navy-700 flex-shrink-0" />
                <p>
                  By completing this booking, our luxury delivery valet will arrive in our temperature-controlled mobile care van on the chosen date. No up-front deposit. Wardrobe care is calculated and billed post-delivery.
                </p>
              </div>

              <div className="border-t border-navy-100 pt-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="text-left">
                  <span className="text-[10px] text-navy-500 uppercase tracking-widest block font-bold">Complete Estimate Invoice</span>
                  <span className="font-mono text-2xl font-bold text-navy-700">£{totalAmount.toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-navy-700 text-white font-bold text-xs tracking-widest uppercase py-4 px-8 hover:bg-navy-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> Schedule Hand-Off Collection
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 4 && createdBooking && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center space-y-8"
          >
            {/* Elegant Success Banner */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-mint-100 border border-navy-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-navy-700" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-light text-navy-900 tracking-wide">Pickup Successfully Scheduled</h3>
              <p className="text-navy-600 text-sm max-w-md">
                Your luxury dry cleaning booking has been registered in our mobile dispatch queue.
              </p>
            </div>

            {/* Boarding-Pass Style Invitation Ticket */}
            <div className="w-full max-w-md bg-surface border border-navy-200 overflow-hidden relative font-sans text-sm text-navy-700">
              {/* Luxury Ticket Header */}
              <div className="bg-navy-700 p-6 text-white flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-80">Valet Collection Card</span>
                  <h4 className="font-serif font-bold text-lg leading-tight uppercase tracking-wider">The Laundry Ladies</h4>
                </div>
                <Ticket className="w-8 h-8 opacity-90" />
              </div>

              {/* Decorative side notches representing physical tear-off ticket */}
              <div className="absolute top-[88px] -left-3 w-6 h-6 rounded-full bg-surface border-r border-navy-200" />
              <div className="absolute top-[88px] -right-3 w-6 h-6 rounded-full bg-surface border-l border-navy-200" />

              <div className="p-6 space-y-6">
                {/* ID and Copy Action */}
                <div className="flex items-center justify-between bg-surface border border-navy-100 p-4">
                  <div>
                    <span className="text-[10px] text-navy-500 uppercase tracking-widest block font-bold">VALET TRACKING ID</span>
                    <span className="font-mono text-base font-bold text-navy-700">{createdBooking.id}</span>
                  </div>
                  <button
                    onClick={handleCopyId}
                    className="text-navy-700 hover:text-navy-900 p-2.5 bg-surface-raised border border-navy-200 transition-all flex items-center gap-1.5 text-xs cursor-pointer"
                  >
                    {copiedId ? <span className="text-green-700 font-bold text-[10px] uppercase">COPIED</span> : <><Copy className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Copy</span></>}
                  </button>
                </div>

                {/* Ticket Details Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-4 border-b border-navy-100 pb-5 font-sans text-xs">
                  <div>
                    <span className="text-navy-500 block font-bold uppercase tracking-wider text-[9px]">CUSTOMER</span>
                    <span className="text-navy-900 font-medium truncate block text-sm mt-1">{createdBooking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-navy-500 block font-bold uppercase tracking-wider text-[9px]">COLLECTION SLOT</span>
                    <span className="text-navy-700 font-medium block text-sm mt-1">
                      {TIME_SLOTS.find(s => s.id === createdBooking.timeSlotId)?.label || 'VIP Slot'}
                    </span>
                  </div>
                  <div>
                    <span className="text-navy-500 block font-bold uppercase tracking-wider text-[9px]">SCHEDULED DATE</span>
                    <span className="text-navy-900 font-medium block text-sm mt-1">
                      {new Date(createdBooking.pickupDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-navy-500 block font-bold uppercase tracking-wider text-[9px]">TIME WINDOW</span>
                    <span className="text-navy-700 block font-mono text-sm mt-1">
                      {TIME_SLOTS.find(s => s.id === createdBooking.timeSlotId)?.timeRange}
                    </span>
                  </div>
                </div>

                {/* Location Detail */}
                <div className="text-xs border-b border-navy-100 pb-5 font-sans">
                  <span className="text-navy-500 block font-bold uppercase tracking-wider text-[9px]">COLLECTION DOORSTEP</span>
                  <p className="text-navy-900 font-medium leading-relaxed mt-1 text-sm">{createdBooking.address}</p>
                </div>

                {/* Simulated Invoice Summary */}
                <div className="space-y-1.5 border-b border-navy-100 pb-5 text-xs">
                  <span className="text-navy-500 block font-bold uppercase tracking-wider text-[9px] mb-1">ESTIMATED INVOICE</span>
                  <div className="flex justify-between text-navy-700">
                    <span>{createdBooking.items.reduce((sum, item) => sum + item.quantity, 0)} Garments Care</span>
                    <span className="font-mono text-navy-900">
                      £{(createdBooking.totalAmount - (selectedSlot?.priceMarkup || 0) - (createdBooking.totalAmount - (selectedSlot?.priceMarkup || 0) < 60 ? 7.5 : 0)).toFixed(2)}
                    </span>
                  </div>
                  {selectedSlot?.premium && (
                    <div className="flex justify-between text-navy-700">
                      <span>VIP Care Window Premium</span>
                      <span className="font-mono">+£{selectedSlot.priceMarkup.toFixed(2)}</span>
                    </div>
                  )}
                  {createdBooking.totalAmount < 60 && (
                    <div className="flex justify-between text-navy-700">
                      <span>Doorstep Delivery Care</span>
                      <span className="font-mono">£7.50</span>
                    </div>
                  )}
                  <div className="flex justify-between text-navy-900 font-semibold text-sm pt-2">
                    <span>Grand Estimate</span>
                    <span className="font-mono text-navy-700">£{createdBooking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* SVG Barcode for authenticity */}
                <div className="flex flex-col items-center space-y-1 pt-2">
                  <svg className="w-48 h-8 opacity-80" viewBox="0 0 200 40">
                    <g fill="#D4AF37">
                      <rect x="10" y="0" width="3" height="40" />
                      <rect x="15" y="0" width="1" height="40" />
                      <rect x="18" y="0" width="2" height="40" />
                      <rect x="23" y="0" width="4" height="40" />
                      <rect x="29" y="0" width="1" height="40" />
                      <rect x="32" y="0" width="3" height="40" />
                      <rect x="38" y="0" width="1" height="40" />
                      <rect x="42" y="0" width="2" height="40" />
                      <rect x="47" y="0" width="4" height="40" />
                      <rect x="53" y="0" width="2" height="40" />
                      <rect x="58" y="0" width="1" height="40" />
                      <rect x="62" y="0" width="3" height="40" />
                      <rect x="68" y="0" width="1" height="40" />
                      <rect x="71" y="0" width="2" height="40" />
                      <rect x="76" y="0" width="4" height="40" />
                      <rect x="82" y="0" width="1" height="40" />
                      <rect x="85" y="0" width="3" height="40" />
                      <rect x="90" y="0" width="2" height="40" />
                      <rect x="94" y="0" width="1" height="40" />
                      <rect x="98" y="0" width="4" height="40" />
                      <rect x="104" y="0" width="1" height="40" />
                      <rect x="108" y="0" width="3" height="40" />
                      <rect x="113" y="0" width="2" height="40" />
                      <rect x="117" y="0" width="4" height="40" />
                      <rect x="123" y="0" width="1" height="40" />
                      <rect x="127" y="0" width="3" height="40" />
                      <rect x="132" y="0" width="2" height="40" />
                      <rect x="136" y="0" width="4" height="40" />
                      <rect x="142" y="0" width="1" height="40" />
                      <rect x="146" y="0" width="2" height="40" />
                      <rect x="150" y="0" width="3" height="40" />
                      <rect x="155" y="0" width="1" height="40" />
                      <rect x="158" y="0" width="4" height="40" />
                      <rect x="164" y="0" width="2" height="40" />
                      <rect x="168" y="0" width="1" height="40" />
                      <rect x="172" y="0" width="3" height="40" />
                      <rect x="177" y="0" width="1" height="40" />
                      <rect x="181" y="0" width="2" height="40" />
                      <rect x="185" y="0" width="4" height="40" />
                      <rect x="190" y="0" width="1" height="40" />
                    </g>
                  </svg>
                  <span className="text-[9px] font-mono tracking-widest text-navy-500">LL-EST2026-VALET</span>
                </div>
              </div>

              {/* Decorative dashed lines represent ticket fold */}
              <div className="border-t-2 border-dashed border-navy-900 h-1 bg-mint-100" />

              <div className="bg-surface-raised p-4 text-center text-xs text-navy-600 font-sans">
                💡 A confirmation invoice has been sent to <span className="text-navy-900 font-medium">{createdBooking.customerEmail}</span>. Thank you for choosing The Laundry Ladies.
              </div>
            </div>

            <button
              onClick={resetFormState}
              className="bg-transparent border border-navy-300 hover:bg-mint-100 text-navy-700 text-xs tracking-widest uppercase font-bold py-4 px-8 transition-colors cursor-pointer"
            >
              Book Another Collection
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
