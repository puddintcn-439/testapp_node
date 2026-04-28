export type BookingItem = {
  id?: number;
  booking_id?: number;
  menu_item_id?: number;
  menu_item_name?: string;
  quantity: number;
  price_at_order: number;
};

export type Booking = {
  id: number;
  user_id?: number | null;
  table_id?: number | null;
  party_size: number;
  start_time: string;
  end_time?: string | null;
  status?: string;
  notes?: string | null;
  created_at?: string;
  items?: BookingItem[];
};

export type BookingInput = {
  userId?: number | null;
  tableId: number;
  partySize: number;
  startTime: string; // ISO
  endTime?: string; // ISO
  notes?: string | null;
  items?: Array<{ menu_item_id: number; quantity?: number }>;
};
