/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Wind, 
  Zap, 
  Heart, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  ChevronRight,
  TrendingUp,
  Info
} from 'lucide-react';
import { SERVICE_CATEGORIES, SERVICE_ITEMS, TIME_SLOTS } from '../data';
import { ServiceItem } from '../types';

interface PricingCalculatorProps {
  onProceedToBooking: (selectedQuantities: { [itemId: string]: number }, preferredTimeSlotId: string) => void;
  initialQuantities?: { [itemId: string]: number };
}

export default function PricingCalculator({ onProceedToBooking, initialQuantities = {} }: PricingCalculatorProps) {
  const [activeCategory, setActiveCategory] = useState<string>('dry_clean');
  const [quantities, setQuantities] = useState<{ [itemId: string]: number }>(initialQuantities);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot_midday');

  // Handle item quantity change
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

  // Clear all selections
  const handleClearAll = () => {
    setQuantities({});
  };

  // Filter items by active category
  const filteredItems = useMemo(() => {
    return SERVICE_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  // Selected items with complete details and calculated cost
  const basketItems = useMemo(() => {
    return Object.entries(quantities).map(([itemId, quantity]) => {
      const item = SERVICE_ITEMS.find(i => i.id === itemId);
      return {
        item: item as ServiceItem,
        quantity,
        totalItemPrice: item ? item.price * Number(quantity) : 0,
      };
    }).filter(b => b.item !== undefined);
  }, [quantities]);

  // Pricing calculations
  const subtotal = useMemo(() => {
    return basketItems.reduce((acc, current) => acc + current.totalItemPrice, 0);
  }, [basketItems]);

  const selectedSlot = useMemo(() => {
    return TIME_SLOTS.find(slot => slot.id === selectedSlotId);
  }, [selectedSlotId]);

  const serviceFee = subtotal > 0 ? (selectedSlot?.priceMarkup || 0) : 0;
  
  // Luxury offer: free delivery for orders over £60
  const deliveryFee = subtotal === 0 ? 0 : (subtotal >= 60 ? 0 : 7.50);
  const totalAmount = subtotal === 0 ? 0 : subtotal + serviceFee + deliveryFee;

  // Render Category Icons Dynamically
  const renderCategoryIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Wind': return <Wind className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Heart': return <Heart className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const handleBookNowClick = () => {
    if (basketItems.length === 0) return;
    onProceedToBooking(quantities, selectedSlotId);
  };

  return (
    <div id="pricing-calculator" className="bg-surface-raised border border-navy-200 p-8 md:p-12 max-w-6xl mx-auto">
      <div className="text-center mb-10 space-y-3">
        <span className="text-navy-700 uppercase tracking-[0.4em] text-[11px] font-bold block">Estimate Your Collection</span>
        <h2 className="font-serif text-3xl md:text-5xl font-light text-navy-900 tracking-wide">
          Interactive <span className="italic text-navy-700">Care & Cost</span> Planner
        </h2>
        <p className="text-navy-600 text-sm max-w-xl mx-auto leading-relaxed">
          Select the items you require cared for, choose a doorstep slot, and receive an instant transparent quotation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Hand: Category & Item Selection (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Category Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-mint-200 border border-navy-200">
            {SERVICE_CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex flex-col items-center justify-center py-4 px-2 text-center transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-navy-700 text-white font-bold'
                      : 'text-navy-600 bg-surface-raised hover:text-coral-700 hover:bg-navy-50'
                  }`}
                >
                  {renderCategoryIcon(cat.iconName, `w-4 h-4 mb-2 ${isActive ? 'text-white' : 'text-navy-700'}`)}
                  <span className="text-[10px] tracking-widest leading-tight font-semibold uppercase">{cat.name.split(' ')[1] || cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Items List */}
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scroll">
            <p className="text-[11px] tracking-wider text-navy-700 uppercase font-medium flex items-center gap-2 border border-navy-200 bg-surface py-2.5 px-4">
              <Info className="w-3.5 h-3.5 text-navy-700 flex-shrink-0" />
              {SERVICE_CATEGORIES.find(c => c.id === activeCategory)?.description}
            </p>

            {filteredItems.map(item => {
              const qty = quantities[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 border transition-all duration-300 ${
                    qty > 0
                      ? 'bg-mint-50 border-navy-300'
                      : 'bg-surface-raised border-navy-100 hover:border-coral-300'
                  }`}
                >
                  <div className="flex-1 pr-4 mb-3 sm:mb-0">
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-serif text-lg font-light text-navy-900 tracking-wide">{item.name}</h4>
                      <span className="text-navy-700 font-mono text-sm font-medium">£{item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-navy-500 text-xs mt-1 leading-relaxed font-sans">{item.description}</p>
                  </div>

                  {/* Qty Controls */}
                  <div className="flex items-center gap-3 justify-end">
                    {qty > 0 ? (
                      <>
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-8 h-8 border border-navy-300 flex items-center justify-center text-navy-700 hover:bg-navy-800 hover:text-white transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-navy-900 text-base font-semibold w-6 text-center">{qty}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-8 h-8 border border-navy-300 flex items-center justify-center text-navy-700 hover:bg-navy-800 hover:text-white transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="px-5 py-2 border border-navy-200 text-navy-700 text-[10px] tracking-widest uppercase font-bold hover:border-coral-400 hover:bg-navy-800 hover:text-white transition-all duration-300 cursor-pointer"
                      >
                        Add to Care
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Hand: Invoice Summary Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-surface border border-navy-200 p-6 md:p-8 flex flex-col h-full justify-between relative overflow-hidden">
            {/* Subtle diagonal background shine */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-mint-200/70 blur-[80px] rounded-none pointer-events-none" />

            <div>
              <div className="flex items-center justify-between border-b border-navy-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-navy-700" />
                  <span className="font-serif text-lg font-light text-navy-900 tracking-wide">Care Estimate</span>
                </div>
                {basketItems.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-navy-500 hover:text-red-700 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              {/* Basket Items List */}
              {basketItems.length === 0 ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 border border-navy-200 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-5 h-5 text-navy-400" />
                  </div>
                  <p className="text-navy-600 text-sm font-sans">Your estimation bag is empty.</p>
                  <p className="text-navy-500 text-xs font-sans">Add luxury garments from the left to start planning your pickup.</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[180px] overflow-y-auto pr-1">
                  {basketItems.map(({ item, quantity, totalItemPrice }) => (
                    <div key={item.id} className="flex justify-between items-center text-sm font-sans">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 border border-navy-200 text-navy-700 text-xs font-semibold flex items-center justify-center font-mono">
                          {quantity}x
                        </span>
                        <span className="text-navy-700 font-light truncate max-w-[150px] sm:max-w-[180px]">{item.name}</span>
                      </div>
                      <span className="text-navy-600 font-mono">£{totalItemPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Doorstep Valet Slot Configuration */}
              {basketItems.length > 0 && (
                <div className="border-t border-navy-100 pt-4 mt-4 space-y-3">
                  <label className="text-[10px] tracking-widest text-navy-700 font-bold uppercase block">
                    Preferred Collection Window
                  </label>
                  <div className="space-y-2">
                    {TIME_SLOTS.map(slot => (
                      <label
                        key={slot.id}
                        className={`flex items-center justify-between p-3 border text-xs cursor-pointer transition-all duration-300 ${
                          selectedSlotId === slot.id
                            ? 'bg-mint-100 border-navy-300 text-navy-900'
                            : 'bg-surface-raised border-navy-100 text-navy-600 hover:border-coral-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="calculator_slot"
                            value={slot.id}
                            checked={selectedSlotId === slot.id}
                            onChange={() => setSelectedSlotId(slot.id)}
                            className="text-navy-700 focus:ring-navy-500/30 border-navy-300 bg-surface cursor-pointer"
                          />
                          <div>
                            <span className="font-semibold block">{slot.label}</span>
                            <span className="block text-[10px] text-navy-500 mt-0.5">{slot.timeRange}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          {slot.premium ? (
                            <>
                              <span className="text-navy-700 font-medium">+£{slot.priceMarkup.toFixed(2)}</span>
                              <span className="bg-mint-100 text-navy-700 px-1.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider">VIP</span>
                            </>
                          ) : (
                            <span className="text-green-700 font-medium">Free</span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            {basketItems.length > 0 && (
              <div className="border-t border-navy-100 pt-4 mt-6 space-y-2">
                <div className="flex justify-between text-xs text-navy-600 font-sans">
                  <span>Garment Subtotal</span>
                  <span className="font-mono">£{subtotal.toFixed(2)}</span>
                </div>
                {serviceFee > 0 && (
                  <div className="flex justify-between text-xs text-navy-600 font-sans">
                    <span>VIP Time Window Fee</span>
                    <span className="font-mono text-navy-700">+£{serviceFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-navy-600 font-sans">
                  <span className="flex items-center gap-1">
                    Doorstep Transport Fee
                    {subtotal >= 60 && (
                      <span className="bg-green-50 text-green-700 px-1.5 py-0.5 text-[9px] font-bold uppercase">FREE OVER £60</span>
                    )}
                  </span>
                  <span className="font-mono">
                    {deliveryFee === 0 ? <span className="text-green-700 font-medium">FREE</span> : `£${deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="border-t border-navy-100 pt-4 mt-4 flex justify-between items-baseline">
                  <span className="font-serif text-base font-light text-navy-900 tracking-wide">Grand Estimate</span>
                  <div className="text-right">
                    <span className="font-mono text-2xl font-bold text-navy-700">
                      £{totalAmount.toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-navy-500 mt-0.5 uppercase tracking-wide font-medium">VAT included</span>
                  </div>
                </div>

                <button
                  onClick={handleBookNowClick}
                  disabled={basketItems.length === 0}
                  className="w-full mt-6 bg-navy-700 text-white font-bold text-xs py-4 uppercase tracking-widest transition-colors duration-300 flex items-center justify-center gap-2 font-sans group disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  Confirm and Book Pickup
                  <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <p className="text-[10px] uppercase tracking-wider text-navy-500 text-center mt-4">
                  🛡️ Complete peace of mind. Payment is processed only post-care.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
