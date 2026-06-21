// app/components/BookingSidebar.tsx
"use client";

import { useState } from "react";
import { createPaymentOrder } from "@/app/actions/payment";
import { bookEventAction } from "@/app/actions/booking"; // adjust path if needed
import { useRouter } from "next/navigation";

export default function BookingSidebar({ event }: { event: any }) {
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);

  const pricePerTicket = Number(event.price) || 0;
  const total = seats * pricePerTicket;

  const router = useRouter();

  async function handlePayment() {
    setLoading(true);

    try {
      // Create Razorpay order on the server
      const { orderId } = await createPaymentOrder(total);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: total * 100, // amount in paise
        currency: "INR",
        order_id: orderId,

        handler: async function (response: any) {
          try {
            console.log("Payment Success:", response);

            // Save booking after successful payment
            await bookEventAction(event.id, seats);

            alert("Payment successful! Your tickets are booked.");

            // Optional redirect
            // router.push("/profile");
          } catch (error) {
            console.error("Booking creation failed:", error);
            alert(
              "Payment succeeded, but booking creation failed. Please contact support.",
            );
          }
        },

        prefill: {
          // name: user?.name,
          // email: user?.email,
        },

        theme: {
          color: "#4F46E5",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Something went wrong with the payment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#0a0a0f] border border-zinc-800 p-8 rounded-3xl sticky top-8">
      <h3 className="text-xl font-bold text-white mb-6">Book Tickets</h3>

      {/* Seat Counter */}
      <div className="mb-6">
        <label className="text-sm text-zinc-400 mb-2 block">
          Number of Seats
        </label>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setSeats(Math.max(1, seats - 1))}
            className="w-10 h-10 rounded-full border border-zinc-700 text-white hover:bg-zinc-800"
          >
            -
          </button>

          <span className="text-xl font-bold text-white w-8 text-center">
            {seats}
          </span>

          <button
            onClick={() => setSeats(Math.min(10, seats + 1))}
            className="w-10 h-10 rounded-full border border-zinc-700 text-white hover:bg-zinc-800"
          >
            +
          </button>
        </div>

        <p className="text-xs text-zinc-500 mt-2">Max 10 per booking</p>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-zinc-800 pt-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-zinc-400">
            ₹{pricePerTicket.toLocaleString()} × {seats} seat(s)
          </span>

          <span className="text-white">₹{total.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold text-white">Total</span>

          <span className="font-bold text-indigo-400 text-xl">
            ₹{total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Payment Button */}
      <button
        disabled={loading}
        onClick={handlePayment}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all mb-4"
      >
        {loading ? "Processing..." : `Pay ₹${total.toLocaleString()}`}
      </button>

      <div className="text-center text-xs text-zinc-500 space-y-2">
        <p>🔒 Secure payment via Razorpay</p>
        <p>🎟️ Instant e-ticket with QR code</p>
        <p>📧 Confirmation via email</p>
      </div>
    </div>
  );
}
