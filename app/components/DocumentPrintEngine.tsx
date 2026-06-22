"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type PrintAssetProps = {
  type: "ticket" | "invoice" | "receipt";
  booking: {
    id: string | number;
    seats: number;
    createdAt: string;
    ticketType: string;
    format: string;
    eventTitle: string;
    eventPrice: number;
    eventDate: string | null;
    eventLocation: string;
  };
  onClose: () => void;
};

export default function DocumentPrintEngine({
  type,
  booking,
  onClose,
}: PrintAssetProps) {
  const hasCalledPrint = useRef(false);
  const evDate = booking.eventDate ? new Date(booking.eventDate) : new Date();
  const formattedDate = evDate.toLocaleDateString("en-IN", {
    dateStyle: "long",
  });
  const formattedTime = evDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const baseCost = booking.eventPrice;
  const totalCost = baseCost * booking.seats;
  const bookingIdStr = String(booking.id || "").trim();

  useEffect(() => {
    // Synchronous execution listener cleanup fallback pipeline
    const handleAfterPrint = () => {
      onClose();
    };

    window.addEventListener("afterprint", handleAfterPrint);

    if (!hasCalledPrint.current) {
      hasCalledPrint.current = true;
      // Triggers print pipeline instantly now that the component has safely mounted
      window.print();
    }

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [onClose]);

  // Prevent server-side or early hydration mounting errors before document.body exists
  if (typeof window === "undefined" || !document.body) {
    return null;
  }

  return createPortal(
    <div
      id="eventsphere-print-payload"
      className="fixed inset-0 z-9999 bg-white text-black p-12 font-sans overflow-y-auto select-text print:absolute print:inset-0 print:p-0"
    >
      {/* 1. ACCESS CREDENTIAL PASS TICKET */}
      {type === "ticket" && (
        <div className="max-w-2xl mx-auto border-2 border-dashed border-zinc-300 rounded-2xl p-6 bg-zinc-50 relative overflow-hidden">
          <div className="flex justify-between items-start border-b pb-4 mb-6">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-600 uppercase">
                Official Access Credentials
              </span>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900 mt-1">
                {booking.eventTitle}
              </h1>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-zinc-900 tracking-tight">
                EventSphere
              </span>
              <p className="text-[9px] font-mono text-zinc-400 mt-0.5">
                ID: {bookingIdStr.slice(0, 8)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-zinc-600 mb-6">
            <div>
              <p className="font-bold text-zinc-400 uppercase text-[9px] tracking-wider">
                Date & Timing
              </p>
              <p className="font-semibold text-zinc-800 mt-0.5">
                {formattedDate} • {formattedTime} IST
              </p>
            </div>
            <div>
              <p className="font-bold text-zinc-400 uppercase text-[9px] tracking-wider">
                Venue Location
              </p>
              <p className="font-semibold text-zinc-800 mt-0.5 truncate">
                {booking.eventLocation}
              </p>
            </div>
            <div>
              <p className="font-bold text-zinc-400 uppercase text-[9px] tracking-wider">
                Pass Tier Category
              </p>
              <p className="font-semibold text-zinc-800 mt-0.5">
                {booking.ticketType} • {booking.format}
              </p>
            </div>
            <div>
              <p className="font-bold text-zinc-400 uppercase text-[9px] tracking-wider">
                Allocated Capacity
              </p>
              <p className="font-semibold text-zinc-800 mt-0.5">
                {booking.seats} Verified {booking.seats > 1 ? "Seats" : "Seat"}
              </p>
            </div>
          </div>

          <div className="border-t pt-6 flex flex-col items-center justify-center space-y-2">
            <div className="h-12 w-64 bg-zinc-900 rounded bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#000_2px,#000_6px)]" />
            <span className="text-[10px] font-mono text-zinc-400 tracking-[0.3em] uppercase">
              {bookingIdStr}
            </span>
          </div>
        </div>
      )}

      {/* 2. TAX INVOICE */}
      {type === "invoice" && (
        <div className="max-w-3xl mx-auto space-y-8 text-zinc-800">
          <div className="flex justify-between items-start border-b pb-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                TAX INVOICE
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Invoice Ref: INV-{bookingIdStr.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-extrabold text-zinc-900">
                EventSphere Private Ltd.
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Mumbai, MH, India</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-xs">
            <div>
              <p className="font-bold text-zinc-400 uppercase tracking-wide text-[10px]">
                Billed Recipient
              </p>
              <p className="font-bold text-zinc-800 mt-1">
                Registered Platform Attendee
              </p>
              <p className="text-zinc-500 mt-0.5">Account ID: {bookingIdStr}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-zinc-400 uppercase tracking-wide text-[10px]">
                Invoice Meta Data
              </p>
              <p className="mt-1">
                <span className="text-zinc-400">Issue Date:</span>{" "}
                {new Date(booking.createdAt).toLocaleDateString("en-IN")}
              </p>
              <p>
                <span className="text-zinc-400">Payment Channel:</span>{" "}
                Electronic / Razorpay
              </p>
            </div>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-zinc-200 bg-zinc-50 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="py-2.5 px-4">Line Item Description</th>
                <th className="py-2.5 px-4 text-center">Quantity</th>
                <th className="py-2.5 px-4 text-right">Unit Price</th>
                <th className="py-2.5 px-4 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <tr>
                <td className="py-4 px-4 font-semibold text-zinc-900">
                  {booking.eventTitle} ({booking.ticketType})
                </td>
                <td className="py-4 px-4 text-center">{booking.seats}</td>
                <td className="py-4 px-4 text-right">₹{baseCost.toFixed(2)}</td>
                <td className="py-4 px-4 text-right font-semibold text-zinc-900">
                  ₹{totalCost.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="w-64 ml-auto border-t-2 pt-4 space-y-1.5 text-xs text-right">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span>₹{totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Integrated GST (18%)</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between text-base font-black text-zinc-900 border-t pt-2">
              <span>Total Balance Due</span>
              <span>₹{totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. TRANSACTION RECEIPT */}
      {type === "receipt" && (
        <div className="max-w-md mx-auto border border-zinc-200 rounded-2xl bg-white p-6 shadow-xl space-y-6 text-zinc-800">
          <div className="text-center space-y-1">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold text-lg mb-2">
              ✓
            </div>
            <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">
              TRANSACTION RECEIPT
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              Thank you for your instant booking registration.
            </p>
          </div>

          <div className="border-t border-b border-dashed py-3 my-4 space-y-2 text-xs font-medium">
            <div className="flex justify-between">
              <span className="text-zinc-400">Order ID token</span>
              <span className="font-mono select-all text-zinc-800">
                {bookingIdStr}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Payment Status</span>
              <span className="font-bold text-emerald-600 uppercase text-[10px]">
                SUCCESS / CAPTURED
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Execution Date</span>
              <span className="text-zinc-800">
                {new Date(booking.createdAt).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-bold text-zinc-400 uppercase tracking-wide text-[9px]">
              Experience Context
            </p>
            <div className="bg-zinc-50 border rounded-xl p-3 text-xs space-y-1">
              <p className="font-bold text-zinc-800 leading-snug">
                {booking.eventTitle}
              </p>
              <p className="text-zinc-500 text-[11px] mt-0.5">
                {formattedDate} • {booking.eventLocation}
              </p>
              <p className="text-zinc-400 text-[10px] font-medium mt-1">
                Tier: {booking.ticketType} • Allocation: {booking.seats} Passes
              </p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-500">
              <span>Gross Value amount</span>
              <span>₹{totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Processing Fees</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between text-sm font-black text-zinc-900 border-t pt-2.5">
              <span>Amount Paid</span>
              <span>₹{totalCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center pt-2 text-[10px] text-zinc-400 font-medium leading-normal">
            Payment handled securely via EventSphere Escrow Systems. <br />
            For customer ops resolution, reference token vector{" "}
            <span className="font-mono">{bookingIdStr.slice(0, 8)}</span>.
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
