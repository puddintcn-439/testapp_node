import { useEffect, useState } from "react";
import type { Booking } from "../types/booking";
import * as api from "../api/bookingApi";

type Props = { refreshKey?: number };

export default function BookingList({ refreshKey }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setBookings(await api.fetchBookings());
    } catch (err: any) {
      setError(err?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { if (typeof refreshKey !== 'undefined') load(); }, [refreshKey]);

  async function handleCancel(id: number) {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.cancelBooking(id);
      await load();
    } catch (err: any) {
      alert(err?.message || 'Failed to cancel');
    }
  }

  return (
    <div className="card" style={{marginTop:12}}>
      <div className="card-body">
        <h3>Bookings</h3>
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && bookings.length === 0 && <div>No bookings</div>}
        {bookings.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Table</th>
                <th>Party</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.table_id}</td>
                  <td>{b.party_size}</td>
                  <td>{new Date(b.start_time).toLocaleString()}</td>
                  <td>{b.end_time ? new Date(b.end_time).toLocaleString() : ''}</td>
                  <td>{b.status}</td>
                  <td>
                    <button className="btn btn-ghost" onClick={() => handleCancel(b.id)}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
