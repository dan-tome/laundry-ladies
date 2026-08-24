/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceCategory, ServiceItem, TimeSlot, Booking } from './types';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'dry_clean',
    name: 'Artisanal Dry Cleaning',
    description: 'Individual fiber inspection, premium gentle eco-solvents, and custom hand finishing.',
    iconName: 'Sparkles',
  },
  {
    id: 'wash_fold',
    name: 'Elite Wash & Fold',
    description: 'Scented hypoallergenic washes, separated color cycles, hand folded and stacked.',
    iconName: 'Wind',
  },
  {
    id: 'press_only',
    name: 'Signature Press & Steam',
    description: 'Intricate hand pressing and high-pressure steaming for razor-sharp, crease-free wear.',
    iconName: 'Zap',
  },
  {
    id: 'couture_linens',
    name: 'Couture & Fine Linens',
    description: 'Ultra-specialized protection for wedding dresses, cashmere, leather, and heritage linens.',
    iconName: 'Heart',
  },
];

export const SERVICE_ITEMS: ServiceItem[] = [
  // Artisanal Dry Cleaning
  {
    id: 'dc_suit',
    name: '2-Piece Designer Suit',
    category: 'dry_clean',
    price: 24.50,
    description: 'Jacket and trousers delicately cleaned, shaped, and custom pressed on supportive hangers.',
  },
  {
    id: 'dc_dress',
    name: 'Luxury Evening Gown / Silk Dress',
    category: 'dry_clean',
    price: 28.00,
    description: 'Handled by specialists to protect delicate trim, embroidery, and natural silk drape.',
  },
  {
    id: 'dc_coat',
    name: 'Heavy Overcoat / Trench',
    category: 'dry_clean',
    price: 32.50,
    description: 'Deep fiber rejuvenation, weather-proofing option, and professional de-pilling.',
  },
  {
    id: 'dc_shirt',
    name: 'Silk / Satin Blouse',
    category: 'dry_clean',
    price: 11.50,
    description: 'Delicate processing ensuring pristine sleeve cuffs, collars, and color vibrance.',
  },
  {
    id: 'dc_trousers',
    name: 'Tailored Trousers / Skirt',
    category: 'dry_clean',
    price: 13.50,
    description: 'Perfect seam alignment and professional shaping with soft-press finishing.',
  },

  // Elite Wash & Fold
  {
    id: 'wf_bag_small',
    name: 'Luxury Laundry Bag (Up to 8kg)',
    category: 'wash_fold',
    price: 35.00,
    description: 'Perfect for everyday designer garments, sorted, pristine washed, and hand-folded.',
  },
  {
    id: 'wf_bag_large',
    name: 'Luxury Laundry Bag (Up to 15kg)',
    category: 'wash_fold',
    price: 55.00,
    description: 'Ideal for weekly household cycles. Includes premium scent infuser options.',
  },
  {
    id: 'wf_duvet',
    name: 'King Bedding & Linen Suite',
    category: 'wash_fold',
    price: 32.00,
    description: 'King duvet cover, fitted sheet, and four pillows washed, sanitized, and crisp-pressed.',
  },

  // Signature Press & Steam
  {
    id: 'ps_shirt',
    name: 'Business Shirt (Hand Finished)',
    category: 'press_only',
    price: 5.50,
    description: 'Washed and custom hand-pressed, returned crisp on collar and cuffs, on wood hangers.',
  },
  {
    id: 'ps_tuxedo',
    name: 'Tuxedo / Dinner Jacket Press',
    category: 'press_only',
    price: 18.00,
    description: 'High-pressure steam alignment for satins, lapels, and custom velvet trim details.',
  },
  {
    id: 'ps_linen_trouser',
    name: 'Linen Trousers Press',
    category: 'press_only',
    price: 8.50,
    description: 'Crisp layout that restores structural fibers without shining the linen fabric.',
  },

  // Couture & Fine Linens
  {
    id: 'cl_wedding',
    name: 'Bridal Gown Preservation Care',
    category: 'couture_linens',
    price: 165.00,
    description: 'Bespoke museum-grade deep soil treatment, hand pressing, and breathable preservation box.',
  },
  {
    id: 'cl_leather',
    name: 'Designer Suede / Leather Jacket',
    category: 'couture_linens',
    price: 85.00,
    description: 'Specialized natural oils restoration, conditioning, and color-safe dry extraction.',
  },
  {
    id: 'cl_cashmere',
    name: 'Artisanal Cashmere Sweater Care',
    category: 'couture_linens',
    price: 22.00,
    description: 'Gentle flat hand wash, de-pilling, and dynamic soft drying to preserve elasticity.',
  },
];

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: 'slot_morning_vip',
    label: 'Morning VIP Express',
    timeRange: '07:00 AM - 09:30 AM',
    premium: true,
    priceMarkup: 5.00,
  },
  {
    id: 'slot_midday',
    label: 'Midday Elite',
    timeRange: '11:00 AM - 01:30 PM',
    premium: false,
    priceMarkup: 0.00,
  },
  {
    id: 'slot_afternoon',
    label: 'Afternoon Classic',
    timeRange: '02:30 PM - 05:00 PM',
    premium: false,
    priceMarkup: 0.00,
  },
  {
    id: 'slot_evening_vip',
    label: 'Evening VIP Return',
    timeRange: '06:00 PM - 08:30 PM',
    premium: true,
    priceMarkup: 5.00,
  },
];

export const SEED_BOOKINGS: Booking[] = [
  {
    id: 'LL-2026-X8B9',
    customerName: 'Victoria Sterling',
    customerEmail: 'v.sterling@mayfair-estates.com',
    customerPhone: '+44 7700 900077',
    address: 'Flat 4B, 12 Belgrave Square, Belgravia, London, SW1X 8PH',
    pickupDate: '2026-07-03',
    timeSlotId: 'slot_morning_vip',
    items: [
      { itemId: 'dc_suit', quantity: 2 },
      { itemId: 'dc_dress', quantity: 1 },
      { itemId: 'cl_cashmere', quantity: 1 }
    ],
    notes: 'Please treat the silk dress with extreme care, it has fine hand-sewn lace on the bodice. Leave with concierge if I am not in.',
    status: 'Pending Collection',
    totalAmount: 104.00, // (2*24.50) + 28.00 + 22.00 + 5.00 markup
    createdAt: '2026-07-02T10:15:30.000Z'
  },
  {
    id: 'LL-2026-M2K4',
    customerName: 'Sir Reginald Thorne',
    customerEmail: 'reginald.thorne@parliament.uk',
    customerPhone: '+44 7700 900122',
    address: 'Thorne House, 18 Cheyne Walk, Chelsea, London, SW3 5TP',
    pickupDate: '2026-07-03',
    timeSlotId: 'slot_evening_vip',
    items: [
      { itemId: 'ps_tuxedo', quantity: 1 },
      { itemId: 'ps_shirt', quantity: 4 },
      { itemId: 'dc_coat', quantity: 1 }
    ],
    notes: 'Preparing for Saturday charity gala. Need deep collar clean on shirts.',
    status: 'In Care',
    totalAmount: 77.50, // 18.00 + (4*5.50) + 32.50 + 5.00 markup
    createdAt: '2026-07-02T08:30:12.000Z'
  },
  {
    id: 'LL-2026-A1D8',
    customerName: 'Alistair Montgomery',
    customerEmail: 'alistair@montgomery-advisors.co.uk',
    customerPhone: '+44 7700 900543',
    address: '7 Kensington Palace Gardens, Kensington, London, W8 4QQ',
    pickupDate: '2026-07-02',
    timeSlotId: 'slot_midday',
    items: [
      { itemId: 'dc_suit', quantity: 4 },
      { itemId: 'wf_bag_large', quantity: 1 }
    ],
    notes: 'Please separate dark colors from the wool items. Trousers crease must be razor-sharp.',
    status: 'Ready for Delivery',
    totalAmount: 153.00, // (4*24.50) + 55.00
    createdAt: '2026-07-01T15:22:45.000Z'
  }
];
