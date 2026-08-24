/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BookingStatus = 
  | 'Pending Collection' 
  | 'In Care' 
  | 'Ready for Delivery' 
  | 'Delivered' 
  | 'Cancelled';

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface TimeSlot {
  id: string;
  label: string;
  timeRange: string;
  premium: boolean;
  priceMarkup: number;
}

export interface BookingItemSelection {
  itemId: string;
  quantity: number;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  pickupDate: string;
  timeSlotId: string;
  items: BookingItemSelection[];
  notes: string;
  status: BookingStatus;
  totalAmount: number;
  createdAt: string;
}
