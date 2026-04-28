import { Router } from 'express';
import bookingService from '../services/bookingService';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};
    const created = await bookingService.createBooking({
      userId: payload.userId || null,
      tableId: Number(payload.tableId),
      partySize: Number(payload.partySize),
      startTime: payload.startTime,
      endTime: payload.endTime,
      notes: payload.notes,
      items: payload.items,
    });
    res.status(201).json(created);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: msg });
  }
});

router.get('/', async (req, res) => {
  try {
    const q: { userId?: number; tableId?: number } = {};
    if (req.query.userId) q.userId = Number(req.query.userId);
    if (req.query.tableId) q.tableId = Number(req.query.tableId);
    const rows = await bookingService.listBookings(q);
    res.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const booking = await bookingService.getBooking(id);
    res.json(booking);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(404).json({ error: msg });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const changes = req.body || {};
    const updated = await bookingService.updateBooking(id, changes);
    res.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: msg });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await bookingService.cancelBooking(id);
    res.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: msg });
  }
});

export default router;
