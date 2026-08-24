/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Lock, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  ClipboardList, 
  Search, 
  Trash2, 
  Calendar, 
  MapPin, 
  Check, 
  LogOut, 
  ChevronDown, 
  RefreshCw,
  Layers,
  User,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { SEED_BOOKINGS, SERVICE_ITEMS, TIME_SLOTS } from '../data';
import { Booking, BookingStatus } from '../types';

interface ValetPortalProps {
  onRefreshTrigger: number; // Trigger reload when booking is placed outside
}

export default function ValetPortal({ onRefreshTrigger }: ValetPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  
  // Bookings list state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // Initialize and reload bookings from localStorage
  const loadBookings = () => {
    const stored = localStorage.getItem('laundry_ladies_bookings');
    if (stored) {
      try {
        setBookings(JSON.parse(stored));
      } catch (err) {
        setBookings(SEED_BOOKINGS);
        localStorage.setItem('laundry_ladies_bookings', JSON.stringify(SEED_BOOKINGS));
      }
    } else {
      setBookings(SEED_BOOKINGS);
      localStorage.setItem('laundry_ladies_bookings', JSON.stringify(SEED_BOOKINGS));
    }
  };

  useEffect(() => {
    loadBookings();
  }, [onRefreshTrigger]);

  // Handle PIN login (Founded in 2026!)
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '2026') {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
      setPinInput('');
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Update booking status
  const handleUpdateStatus = (bookingId: string, newStatus: BookingStatus) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: newStatus };
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem('laundry_ladies_bookings', JSON.stringify(updated));
  };

  // Delete booking
  const handleDeleteBooking = (bookingId: string) => {
    if (window.confirm(`Are you sure you want to remove tracking for booking ${bookingId}? This cannot be undone.`)) {
      const updated = bookings.filter(b => b.id !== bookingId);
      setBookings(updated);
      localStorage.setItem('laundry_ladies_bookings', JSON.stringify(updated));
      if (selectedBookingId === bookingId) {
        setSelectedBookingId(null);
      }
    }
  };

  // Reset to original seed bookings (Factory Reset)
  const handleResetData = () => {
    if (window.confirm('Do you want to restore original seed bookings? This will clear custom bookings.')) {
      setBookings(SEED_BOOKINGS);
      localStorage.setItem('laundry_ladies_bookings', JSON.stringify(SEED_BOOKINGS));
    }
  };

  // Metrics calculations
  const stats = useMemo(() => {
    const total = bookings.length;
    const active = bookings.filter(b => b.status !== 'Delivered' && b.status !== 'Cancelled').length;
    const pending = bookings.filter(b => b.status === 'Pending Collection').length;
    const inCare = bookings.filter(b => b.status === 'In Care').length;
    const ready = bookings.filter(b => b.status === 'Ready for Delivery').length;
    const delivered = bookings.filter(b => b.status === 'Delivered').length;
    
    const revenue = bookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    return { total, active, pending, inCare, ready, delivered, revenue };
  }, [bookings]);

  // Filter & search bookings
  const processedBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = 
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  // Expand booking details
  const activeBookingDetails = useMemo(() => {
    if (!selectedBookingId) return null;
    return bookings.find(b => b.id === selectedBookingId) || null;
  }, [selectedBookingId, bookings]);

  // Map item names and calculations
  const getItemDetails = (itemId: string) => {
    return SERVICE_ITEMS.find(item => item.id === itemId);
  };

  return (
    <div id="valet-dispatch-portal" className="scroll-mt-24 max-w-6xl mx-auto min-h-[500px]">
      {!isAuthenticated ? (
        /* Pin Code Screen */
        <div className="max-w-md mx-auto bg-surface-raised border border-navy-200 p-8 text-center">
          <div className="w-16 h-16 bg-mint-100 border border-navy-200 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-6 h-6 text-navy-700" />
          </div>
          <h3 className="font-serif text-2xl font-light text-navy-900 tracking-wide">Valet Care Dispatch</h3>
          <p className="text-navy-600 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
            Authorized doorstep collectors only. Enter the secure PIN to enter the business registry console.
          </p>

          <form onSubmit={handlePinSubmit} className="mt-6 space-y-4">
            <div className="relative">
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={pinInput}
                onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
                className={`w-full bg-surface border py-4 px-4 text-center text-xl font-mono text-navy-700 tracking-[1em] focus:outline-none focus:border-navy-500 ${
                  pinError ? 'border-red-600 animate-shake' : 'border-navy-200'
                }`}
              />
              {pinError && (
                <span className="text-red-700 text-[10px] mt-2 flex items-center justify-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Access Denied. Incorrect Passcode.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-navy-700 text-white font-bold text-xs tracking-widest uppercase py-4 hover:bg-navy-800 transition-colors cursor-pointer"
            >
              Authenticate Portal
            </button>
            <p className="text-[10px] text-navy-500 italic mt-2">
              Hint: Found on logo (Est. YYYY)
            </p>
          </form>
        </div>
      ) : (
        /* Dashboard Screen */
        <div className="bg-surface-raised border border-navy-200 p-8 md:p-12 space-y-8">
          
          {/* Header Dashboard Nav */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-navy-100 pb-5 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy-700 flex items-center justify-center text-white">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-light text-navy-900 tracking-wide">Valet Care Dispatch</h3>
                <span className="text-navy-700 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Live Mobile Network Console
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <button
                onClick={handleResetData}
                className="text-[10px] text-navy-500 hover:text-coral-700 transition-colors flex items-center gap-1 border border-navy-200 px-3 py-2 bg-surface cursor-pointer uppercase tracking-wider font-bold"
                title="Restore original simulated seed bookings"
              >
                <RefreshCw className="w-3 h-3" /> Reset Seeds
              </button>
              <button
                onClick={handleLogout}
                className="bg-transparent border border-red-200 hover:bg-red-50 text-red-700 hover:text-navy-900 px-4 py-2 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer uppercase tracking-wider"
              >
                <LogOut className="w-3.5 h-3.5" /> Close Console
              </button>
            </div>
          </div>

          {/* Analytics Board */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface border border-navy-100 p-5">
              <span className="text-navy-500 text-[10px] uppercase tracking-widest block font-bold">VALET REVENUE LOGS</span>
              <span className="font-mono text-xl md:text-2xl font-bold text-navy-700 mt-1 block">£{stats.revenue.toFixed(2)}</span>
              <span className="text-navy-500 text-[9px] block mt-0.5 font-light">Gross estimated invoices</span>
            </div>
            <div className="bg-surface border border-navy-100 p-5">
              <span className="text-navy-500 text-[10px] uppercase tracking-widest block font-bold">PENDING COLLECTIONS</span>
              <span className="font-mono text-xl md:text-2xl font-bold text-navy-900 mt-1 block">{stats.pending}</span>
              <span className="text-amber-700 text-[9px] block mt-0.5 font-bold uppercase tracking-wide">Doorstep pickup required</span>
            </div>
            <div className="bg-surface border border-navy-100 p-5">
              <span className="text-navy-500 text-[10px] uppercase tracking-widest block font-bold">IN LAUNDRY CARE</span>
              <span className="font-mono text-xl md:text-2xl font-bold text-navy-900 mt-1 block">{stats.inCare}</span>
              <span className="text-blue-700 text-[9px] block mt-0.5 font-bold uppercase tracking-wide">Processing in center</span>
            </div>
            <div className="bg-surface border border-navy-100 p-5">
              <span className="text-navy-500 text-[10px] uppercase tracking-widest block font-bold">READY / DELIVERED</span>
              <span className="font-mono text-xl md:text-2xl font-bold text-navy-900 mt-1 block">{stats.ready + stats.delivered}</span>
              <span className="text-green-700 text-[9px] block mt-0.5 font-bold uppercase tracking-wide">Satisfied luxury guests</span>
            </div>
          </div>

          {/* Booking Management Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Workspace: Filters, Search & Table (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-navy-500" />
                  <input
                    type="text"
                    placeholder="Search by guest, id, address..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-surface border border-navy-100 pl-9 pr-4 py-3 text-xs text-navy-900 focus:outline-none focus:border-navy-500 placeholder-navy-400 transition-colors"
                  />
                </div>
                <div className="flex gap-1 overflow-x-auto pb-0.5 select-none">
                  {['All', 'Pending Collection', 'In Care', 'Ready for Delivery', 'Delivered'].map(status => {
                    const isSelected = statusFilter === status;
                    const label = status === 'Pending Collection' ? 'Pending' : (status === 'Ready for Delivery' ? 'Ready' : status);
                    return (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'bg-navy-700 text-white'
                            : 'bg-surface text-navy-600 hover:text-coral-700 hover:bg-navy-50 border border-navy-100'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                           {/* Bookings Queue */}
              <div className="bg-surface border border-navy-100 overflow-hidden max-h-[450px] overflow-y-auto custom-scroll">
                {processedBookings.length === 0 ? (
                  <div className="py-16 text-center text-navy-500 space-y-2">
                    <Layers className="w-8 h-8 text-navy-400 mx-auto" />
                    <p className="text-xs">No active collections match your search criteria.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-navy-100">
                    {processedBookings.map(b => {
                      const isSelected = selectedBookingId === b.id;
                      const statusColors: { [key: string]: string } = {
                        'Pending Collection': 'text-amber-700 bg-amber-50 border-amber-200',
                        'In Care': 'text-blue-700 bg-blue-50 border-blue-200',
                        'Ready for Delivery': 'text-purple-700 bg-purple-50 border-purple-200',
                        'Delivered': 'text-green-700 bg-green-50 border-green-200',
                        'Cancelled': 'text-red-700 bg-red-50 border-red-200',
                      };

                      return (
                        <div
                          key={b.id}
                          className={`p-4 transition-all duration-200 cursor-pointer border-l-2 ${
                            isSelected ? 'bg-mint-50 border-navy-700' : 'border-transparent hover:bg-navy-50'
                          }`}
                          onClick={() => setSelectedBookingId(b.id)}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-navy-700">{b.id}</span>
                                <span className={`px-2 py-0.5 text-[8px] font-bold uppercase border ${statusColors[b.status] || 'text-navy-600 bg-navy-100 border-navy-200'}`}>
                                  {b.status}
                                </span>
                              </div>
                              <h4 className="font-serif font-light text-navy-900 text-sm mt-1">{b.customerName}</h4>
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-xs font-semibold text-navy-900">£{b.totalAmount.toFixed(2)}</span>
                              <span className="text-[9px] text-navy-500 block font-light mt-0.5">
                                {new Date(b.pickupDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-navy-600 mt-2.5 pt-2 border-t border-navy-100">
                            <span className="truncate max-w-[200px] flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-navy-700" /> {b.address}
                            </span>
                            <span className="text-navy-500 font-light">
                              Slot: {TIME_SLOTS.find(s => s.id === b.timeSlotId)?.label.split(' ')[0] || 'VIP'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>    </div>
            </div>

            {/* Right Workspace: Selected Booking Operations (5 cols) */}
            <div className="lg:col-span-5">
              {activeBookingDetails ? (
                <div className="bg-surface border border-navy-200 p-6 space-y-6 relative">
                  
                  {/* Operations Card Header */}
                  <div className="flex justify-between items-start border-b border-navy-100 pb-4">
                    <div>
                      <span className="text-[10px] text-navy-500 uppercase tracking-widest block font-bold">Collection Workspace</span>
                      <h4 className="font-serif font-light text-navy-900 text-lg tracking-wide mt-1">{activeBookingDetails.id}</h4>
                    </div>
                    <button
                      onClick={() => handleDeleteBooking(activeBookingDetails.id)}
                      className="text-navy-500 hover:text-red-700 p-2 border border-transparent hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete tracking record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Status Controller */}
                  <div className="space-y-3">
                    <label className="text-[10px] text-navy-700 tracking-wider font-bold uppercase block">Update Collection State</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Pending Collection', 'In Care', 'Ready for Delivery', 'Delivered', 'Cancelled'] as BookingStatus[]).map(status => {
                        const isCurrent = activeBookingDetails.status === status;
                        return (
                          <button
                            key={status}
                            onClick={() => handleUpdateStatus(activeBookingDetails.id, status)}
                            className={`px-2 py-2 text-[9px] font-bold uppercase border transition-all text-center cursor-pointer ${
                              isCurrent
                                ? 'bg-navy-700 text-white border-transparent font-bold'
                                : 'bg-surface border-navy-100 text-navy-600 hover:border-coral-300 hover:text-coral-700'
                            }`}
                          >
                            {status === 'Pending Collection' ? 'Pickup Queue' : status}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customer Information Card */}
                  <div className="space-y-3 bg-surface p-4 border border-navy-100 text-xs font-sans">
                    <h5 className="font-bold text-[10px] uppercase text-navy-700 tracking-widest flex items-center gap-2 border-b border-navy-100 pb-2">
                      <User className="w-3.5 h-3.5" /> Customer Logistics
                    </h5>
                    <div className="space-y-2 text-navy-700">
                      <p className="flex items-center gap-2"><span className="text-navy-500 font-bold w-14 uppercase text-[9px]">Name:</span> <span className="text-navy-900 font-medium">{activeBookingDetails.customerName}</span></p>
                      <p className="flex items-center gap-2"><span className="text-navy-500 font-bold w-14 uppercase text-[9px]">Phone:</span> <a href={`tel:${activeBookingDetails.customerPhone}`} className="text-navy-700 hover:underline">{activeBookingDetails.customerPhone}</a></p>
                      <p className="flex items-center gap-2"><span className="text-navy-500 font-bold w-14 uppercase text-[9px]">Email:</span> <a href={`mailto:${activeBookingDetails.customerEmail}`} className="text-navy-700 hover:underline truncate block max-w-[160px]">{activeBookingDetails.customerEmail}</a></p>
                      <p className="flex items-start gap-2 pt-2 border-t border-navy-100"><span className="text-navy-500 font-bold w-14 uppercase text-[9px] mt-0.5">Address:</span> <span className="text-navy-900 font-medium leading-relaxed">{activeBookingDetails.address}</span></p>
                    </div>
                  </div>

                  {/* Wardrobe Items Care Card */}
                  <div className="space-y-3 bg-surface p-4 border border-navy-100 text-xs font-sans">
                    <h5 className="font-bold text-[10px] uppercase text-navy-700 tracking-widest flex items-center gap-2 border-b border-navy-100 pb-2">
                      <Layers className="w-3.5 h-3.5" /> Garments Care Ledger
                    </h5>
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {activeBookingDetails.items.map(basketItem => {
                        const detail = getItemDetails(basketItem.itemId);
                        if (!detail) return null;
                        return (
                          <div key={basketItem.itemId} className="flex justify-between items-center">
                            <span className="text-navy-700 truncate max-w-[180px] font-light">
                              {detail.name}
                            </span>
                            <span className="font-mono text-navy-900 font-medium">
                              {basketItem.quantity}x <span className="text-navy-500 text-[10px]">({(detail.price * basketItem.quantity).toFixed(2)} £)</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-navy-100 pt-2 flex justify-between items-baseline font-sans">
                      <span className="text-navy-500 text-[9px] uppercase tracking-wider font-bold">Projected Billing</span>
                      <span className="font-mono text-base font-bold text-navy-700">£{activeBookingDetails.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Special Notes Accordion */}
                  {activeBookingDetails.notes && (
                    <div className="bg-mint-50 border border-navy-100 p-4 text-xs text-navy-700">
                      <span className="font-bold text-[9px] uppercase text-coral-700 tracking-widest block mb-1.5 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Special Collector Notes:
                      </span>
                      <p className="leading-relaxed italic font-light">"{activeBookingDetails.notes}"</p>
                    </div>
                  )}

                  {/* Logistics Scheduler Badge */}
                  <div className="flex items-center gap-2 text-[10px] text-navy-500 font-bold border-t border-navy-100 pt-3">
                    <Calendar className="w-3.5 h-3.5 text-navy-700" />
                    <span>Created: {new Date(activeBookingDetails.createdAt).toLocaleString('en-GB')}</span>
                  </div>

                </div>
              ) : (
                <div className="h-full bg-surface border border-navy-100 p-8 flex flex-col items-center justify-center text-center space-y-3 text-navy-500 min-h-[300px]">
                  <ClipboardList className="w-10 h-10 text-navy-400 animate-pulse" />
                  <p className="text-xs font-sans uppercase tracking-widest text-navy-700 font-bold">No dispatch selected</p>
                  <p className="text-[10px] max-w-xs text-navy-500 leading-normal font-medium">
                    Click any guest collection row on the left to pull their logs, update processing stages, or view logistics contacts.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
