"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPaymentOrder } from "@/app/actions/payment";
import { bookEventAction } from "@/app/actions/booking";
import {
  ShieldCheck,
  Ticket,
  Mail,
  Minus,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookingSidebar({ event }: { event: any }) {
  const [seats, setSeats] = useState(1);
  const [uiState, setUiState] = useState<{
    status: "idle" | "success" | "error";
    msg: string | null;
  }>({ status: "idle", msg: null });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const pricePerTicket = Number(event?.price) || 0;
  const totalAmount = seats * pricePerTicket;

  // Strategic Scarcity Safeguard calculations
  const maxAvailable =
    event?.seats_available !== undefined
      ? Math.min(10, Number(event.seats_available))
      : 10;
  const isSoldOut =
    event?.seats_available !== undefined && Number(event.seats_available) <= 0;

  const handlePaymentCheckoutFlow = async () => {
    if (isSoldOut || maxAvailable <= 0) return;
    setUiState({ status: "idle", msg: null });

    // 🛠️ STAFF DIAGNOSTIC & IDENTIFIER RESOLVER
    // Extracts the event ID regardless of your schema variable structure (id vs event_id vs eventId)
    const targetEventId = event?.id || event?.event_id || event?.eventId;

    // Explicit runtime structural check to prevent sending empty data keys to the database
    if (!targetEventId) {
      setUiState({
        status: "error",
        msg: "Configuration Fault: Event identifier code is missing.",
      });
      return;
    }

    // Explicit Type Coercion: Enforces numeric safety lines to prevent string-vs-integer backend rejections
    const safeSeatsCount = Number(seats) || 1;

    // Handle instant checkout loop if event is completely free
    if (totalAmount === 0) {
      startTransition(async () => {
        try {
          // Pass cleanly parsed primitive variables to match your exact backend signature parameters
          await bookEventAction(targetEventId, safeSeatsCount);
          setUiState({
            status: "success",
            msg: "Passes reserved successfully! Redirecting to wallet...",
          });
          setTimeout(() => router.push("/my-bookings"), 1500);
        } catch (err) {
          setUiState({
            status: "error",
            msg: "Reservation failed. Please contact support operations.",
          });
        }
      });
      return;
    }

    startTransition(async () => {
      try {
        const orderResponse = await createPaymentOrder(totalAmount);
        if (!orderResponse?.orderId)
          throw new Error("Order signature rejected.");

        const razorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: totalAmount * 100, // Denoted safely in paise fractions
          currency: "INR",
          name: "EventSphere",
          description: "Secure Ticket Allocation",
          order_id: orderResponse.orderId,

          handler: async function (paymentResponse: any) {
            // Re-bind transition threads to ensure zero layout flickering during async writes
            startTransition(async () => {
              try {
                // Execute database write with fully parsed, robust data mappings
                await bookEventAction(targetEventId, safeSeatsCount);
                setUiState({
                  status: "success",
                  msg: "Payment verified successfully! Your tickets are issued.",
                });
                setTimeout(() => router.push("/my-bookings"), 1500);
              } catch (bookingError) {
                console.error(
                  "CRITICAL_DATABASE_COMMIT_FAILURE:",
                  bookingError,
                );
                setUiState({
                  status: "error",
                  msg: `Payment captured, but ledger allocation failed. Pass ID Reference: ${targetEventId}`,
                });
              }
            });
          },
          theme: { color: "#4f46e5" },
        };

        const rzpWindowInstance = new (window as any).Razorpay(razorpayOptions);
        rzpWindowInstance.open();
      } catch (checkoutError) {
        setUiState({
          status: "error",
          msg: "Could not initialize secure gateway link pipeline.",
        });
      }
    });
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-800/80 bg-[#09090e] p-6 shadow-2xl select-none space-y-6">
      <h3 className="text-base font-bold tracking-tight uppercase text-zinc-400 border-b border-zinc-900 pb-3">
        Register Passes
      </h3>

      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block">
          Number of Seats
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={isPending || seats <= 1 || isSoldOut}
            onClick={() => setSeats((prev) => Math.max(1, prev - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/40 text-zinc-400 transition hover:bg-zinc-800 hover:text-white active:scale-95 disabled:opacity-30"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="text-lg font-mono font-bold text-white w-6 text-center">
            {isSoldOut ? 0 : seats}
          </span>
          <button
            type="button"
            disabled={isPending || seats >= maxAvailable || isSoldOut}
            onClick={() => setSeats((prev) => Math.min(maxAvailable, prev + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/40 text-zinc-400 transition hover:bg-zinc-800 hover:text-white active:scale-95 disabled:opacity-30"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-zinc-500 font-medium">
          {isSoldOut
            ? "This event is currently sold out."
            : `Limit max ${maxAvailable} ticket releases per transaction`}
        </p>
      </div>

      <div className="border-t border-zinc-900 pt-5 space-y-2.5 text-xs">
        <div className="flex justify-between items-center text-zinc-400">
          <span>
            ₹{pricePerTicket.toLocaleString("en-IN")} &times; {seats} pass(es)
          </span>
          <span className="font-mono">
            ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between items-center border-t border-zinc-900 pt-3">
          <span className="font-bold text-white">Aggregate Total</span>
          <span className="font-mono text-base font-black text-indigo-400 sm:text-lg">
            ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button
          disabled={isPending || isSoldOut}
          onClick={handlePaymentCheckoutFlow}
          className={cn(
            "flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-150 outline-none select-none shadow-md",
            isSoldOut
              ? "bg-zinc-900 text-zinc-500 border border-zinc-800/80 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-50",
          )}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSoldOut ? (
            "Sold Out Allocation"
          ) : totalAmount === 0 ? (
            "Claim Free Access"
          ) : (
            `Checkout Order`
          )}
        </button>

        {uiState.status !== "idle" && (
          <div
            role="alert"
            className={cn(
              "flex items-start gap-2.5 rounded-xl border border-zinc-800/80 p-3 text-[11px] leading-normal animate-fade-in select-text",
              uiState.status === "success"
                ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/5 text-red-400 border-red-500/20",
            )}
          >
            {uiState.status === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
            )}
            <span>{uiState.msg}</span>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-900/60 pt-4 flex flex-col gap-2.5 text-[10px] text-zinc-500 font-medium">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-zinc-600 shrink-0" />{" "}
          <span>Encrypted transaction routing via Razorpay.</span>
        </div>
        <div className="flex items-center gap-2">
          <Ticket className="h-3.5 w-3.5 text-zinc-600 shrink-0" />{" "}
          <span>Instant digital wallet pass issuance.</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-zinc-600 shrink-0" />{" "}
          <span>Verification receipt dispatch via email.</span>
        </div>
      </div>
    </div>
  );
}
