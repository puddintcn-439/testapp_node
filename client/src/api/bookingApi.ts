import type { Booking, BookingInput } from "../types/booking";

const API_URL = import.meta.env.VITE_API_URL ?? "";
const BASE = `${API_URL}/api/bookings`;

function authHeaders() {
  try {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (err) {
    return {};
  }
}

export async function fetchBookings(): Promise<Booking[]> {
  const res = await fetch(BASE, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json() as Promise<Booking[]>;
}

export async function getBooking(id: number): Promise<Booking> {
  const res = await fetch(`${BASE}/${id}`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("Failed to fetch booking");
  return res.json() as Promise<Booking>;
}

export async function createBooking(input: BookingInput): Promise<Booking> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create booking");
  return res.json() as Promise<Booking>;
}

export async function updateBooking(id: number, changes: Partial<BookingInput>): Promise<Booking> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error("Failed to update booking");
  return res.json() as Promise<Booking>;
}

export async function cancelBooking(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE", headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("Failed to cancel booking");
}
