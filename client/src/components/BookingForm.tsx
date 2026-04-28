import { useState } from "react";
import type { BookingInput } from "../types/booking";
import * as api from "../api/bookingApi";

type Props = { onSaved?: () => void };

export default function BookingForm({ onSaved }: Props) {
  const [tableId, setTableId] = useState<number | ''>('');
  const [partySize, setPartySize] = useState<number>(1);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toIsoLocal(v: string) {
    if (!v) return '';
    // input is like 2026-04-28T15:00
    const d = new Date(v);
    return d.toISOString();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (tableId === '') return setError('Table id is required');
    if (!startTime) return setError('Start time required');
    setLoading(true);
    const payload: BookingInput = {
      tableId: Number(tableId),
      partySize: Number(partySize),
      startTime: toIsoLocal(startTime),
      endTime: endTime ? toIsoLocal(endTime) : undefined,
      notes: notes || undefined,
    };
    try {
      await api.createBooking(payload);
      setTableId('');
      setPartySize(1);
      setStartTime('');
      setEndTime('');
      setNotes('');
      if (onSaved) onSaved();
    } catch (err: any) {
      setError(err?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{marginTop:12}}>
      <div className="card-body">
        <h3>New Booking</h3>
        {error && <div className="error"><span>{error}</span></div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Table ID</label>
            <input value={tableId as any} onChange={e => setTableId(e.target.value ? Number(e.target.value) : '')} type="number" />
          </div>
          <div className="form-row">
            <label>Party size</label>
            <input value={partySize} onChange={e => setPartySize(Number(e.target.value))} type="number" min={1} />
          </div>
          <div className="form-row">
            <label>Start (local)</label>
            <input value={startTime} onChange={e => setStartTime(e.target.value)} type="datetime-local" />
          </div>
          <div className="form-row">
            <label>End (optional)</label>
            <input value={endTime} onChange={e => setEndTime(e.target.value)} type="datetime-local" />
          </div>
          <div className="form-row">
            <label>Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div style={{marginTop:8}}>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Booking'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
