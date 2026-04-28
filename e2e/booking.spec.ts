import { test, expect } from '@playwright/test';

function inOneHourIso() {
  const now = new Date();
  now.setMinutes(0,0,0);
  const start = new Date(now.getTime() + 24 * 60 * 60 * 1000); // tomorrow same hour
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return { start: start.toISOString(), end: end.toISOString() };
}

test.describe('booking e2e', () => {
  test('create -> get -> cancel booking via API', async ({ request }) => {
    const base = process.env.E2E_BASE_URL || 'http://localhost:3000';
    // Ensure we talk to the right base
    const { start, end } = inOneHourIso();

    // Create booking using seeded table_id = 1 and menu_item_id = 1
    const createRes = await request.post(`${base}/api/bookings`, {
      data: {
        tableId: 1,
        partySize: 2,
        startTime: start,
        endTime: end,
        notes: 'E2E test booking',
        items: [{ menu_item_id: 1, quantity: 1 }],
      },
    });
    expect(createRes.status()).toBe(201);
    const body = await createRes.json();
    expect(body).toHaveProperty('id');
    const id = body.id;

    // Fetch booking
    const getRes = await request.get(`${base}/api/bookings/${id}`);
    expect(getRes.status()).toBe(200);
    const booking = await getRes.json();
    expect(booking).toHaveProperty('id', id);
    expect(booking).toHaveProperty('items');

    // Cancel booking
    const delRes = await request.delete(`${base}/api/bookings/${id}`);
    expect(delRes.status()).toBe(200);
    const after = await request.get(`${base}/api/bookings/${id}`);
    // cancelled bookings may still return 200 but status should be 'cancelled'
    if (after.status() === 200) {
      const b2 = await after.json();
      expect(b2.status === 'cancelled' || b2.status === 'canceled' || b2.status === 'cancelled' ).toBeTruthy();
    }
  });
});
