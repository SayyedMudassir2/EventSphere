"use client";
import { useState } from "react";
import { cancelBookingAction } from "@/app/actions/booking";

export default function BookingCard({ booking }: { booking: any }) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setLoading(true);
    try {
      await cancelBookingAction(booking.id);
    } catch (err) {
      alert("Error canceling booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold text-white">{booking.events.title}</h2>
        <p className="text-zinc-400 text-sm">Seats: {booking.seats}</p>
      </div>
      <button
        onClick={handleCancel}
        disabled={loading}
        className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors"
      >
        {loading ? "Canceling..." : "Cancel Booking"}
      </button>
    </div>
  );
}
