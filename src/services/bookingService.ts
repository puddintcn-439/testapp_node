import { dbQuery } from '../config/db';

type BookingItemInput = {
  menu_item_id: number;
  quantity?: number;
};

type CreateBookingInput = {
  userId?: number | null;
  tableId: number;
  partySize: number;
  startTime: string; // ISO
  endTime: string; // ISO
  notes?: string | null;
  items?: BookingItemInput[];
};

export async function createBooking(input: CreateBookingInput) {
  const { userId = null, tableId, partySize, startTime, endTime, notes = null, items = [] } = input;

  if (!tableId || !startTime || !partySize) {
    throw new Error('Missing required booking fields');
  }

  // 1) Verify table exists and capacity
  const tbl = await dbQuery('SELECT capacity FROM restaurant_tables WHERE id = $1', [tableId]);
  if (!tbl || tbl.length === 0) throw new Error('Table not found');
  const capacity = Number(tbl[0].capacity || 0);
  if (partySize > capacity) throw new Error('Party size exceeds table capacity');

  // 2) Check availability (overlapping bookings)
  // overlap if NOT (existing.end_time <= requested.start OR existing.start_time >= requested.end)
  const conflicts = await dbQuery(
    `SELECT id FROM bookings WHERE table_id = $1 AND status != $4 AND NOT (end_time <= $2 OR start_time >= $3)`,
    [tableId, startTime, endTime, 'cancelled'],
  );
  if (conflicts && conflicts.length > 0) {
    throw new Error('Table not available at requested time');
  }

  // 3) Insert booking
  // NOTE: Uses Postgres RETURNING; DB_TYPE is usually 'pg' by default in this project.
  const inserted = await dbQuery(
    `INSERT INTO bookings (user_id, table_id, party_size, start_time, end_time, status, notes, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING id, user_id, table_id, party_size, start_time, end_time, status, notes, created_at`,
    [userId, tableId, partySize, startTime, endTime, 'confirmed', notes],
  );
  const booking = inserted[0];

  // 4) Insert booking items (if any)
  for (const it of items) {
    const menu = await dbQuery('SELECT price FROM menu_items WHERE id = $1', [it.menu_item_id]);
    if (!menu || menu.length === 0) throw new Error(`Menu item ${it.menu_item_id} not found`);
    const price = menu[0].price;
    await dbQuery(
      'INSERT INTO booking_items (booking_id, menu_item_id, quantity, price_at_order) VALUES ($1,$2,$3,$4)',
      [booking.id, it.menu_item_id, it.quantity || 1, price],
    );
  }

  return getBooking(booking.id);
}

export async function getBooking(id: number) {
  const rows = await dbQuery('SELECT * FROM bookings WHERE id = $1', [id]);
  if (!rows || rows.length === 0) throw new Error('Booking not found');
  const booking = rows[0];
  const items = await dbQuery(
    `SELECT bi.id, bi.quantity, bi.price_at_order, mi.id as menu_item_id, mi.name as menu_item_name
     FROM booking_items bi
     LEFT JOIN menu_items mi ON mi.id = bi.menu_item_id
     WHERE bi.booking_id = $1`,
    [id],
  );
  return { ...booking, items };
}

export async function listBookings(filters: { userId?: number; tableId?: number } = {}) {
  const params: unknown[] = [];
  let sql = 'SELECT * FROM bookings WHERE 1=1';
  if (filters.userId) {
    params.push(filters.userId);
    sql += ` AND user_id = $${params.length}`;
  }
  if (filters.tableId) {
    params.push(filters.tableId);
    sql += ` AND table_id = $${params.length}`;
  }
  sql += ' ORDER BY start_time DESC';
  const rows = await dbQuery(sql, params);
  return rows;
}

export async function cancelBooking(id: number) {
  // Mark booking as cancelled
  await dbQuery('UPDATE bookings SET status = $1 WHERE id = $2', ['cancelled', id]);
  return { ok: true };
}

export async function updateBooking(
  id: number,
  changes: Partial<{ start_time: string; end_time: string; party_size: number }>,
) {
  // Basic updater: supports changing start_time, end_time and party_size with simple validation
  const fields: string[] = [];
  const params: unknown[] = [];
  if (changes.start_time) {
    params.push(changes.start_time);
    fields.push(`start_time = $${params.length}`);
  }
  if (changes.end_time) {
    params.push(changes.end_time);
    fields.push(`end_time = $${params.length}`);
  }
  if (typeof changes.party_size === 'number') {
    params.push(changes.party_size);
    fields.push(`party_size = $${params.length}`);
  }
  if (fields.length === 0) throw new Error('No changes provided');
  params.push(id);
  const sql = `UPDATE bookings SET ${fields.join(', ')} WHERE id = $${params.length}`;
  await dbQuery(sql, params);
  return getBooking(id);
}

export default {
  createBooking,
  getBooking,
  listBookings,
  cancelBooking,
  updateBooking,
};
