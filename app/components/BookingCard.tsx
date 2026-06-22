"use client";

import { useState, useActionState, startTransition } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-helpers";
import { cancelBookingAction } from "@/app/actions/booking";
import DocumentPrintEngine from "./DocumentPrintEngine";
import {
  Calendar,
  MapPin,
  Users,
  Ticket,
  ChevronDown,
  Download,
  Share2,
  CalendarPlus,
  FileText,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 1. Explicitly typing our booking object layout to ensure safety
interface BookingData {
  id: string | number;
  eventTitle: string;
  eventDate: string | null;
  eventLocation: string;
  eventImage?: string;
  seats: number;
  ticketType: string;
  format: string;
  eventPrice: number;
  createdAt: string;
}

interface BookingCardProps {
  booking: BookingData;
  activeTab: string;
}

export default function BookingCard({ booking, activeTab }: BookingCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [, setShareFormOpen] = useState(false); // Attached state matching your original requirements

  // Track the target print document configuration without triggers overlapping
  const [printConfig, setPrintConfig] = useState<
    "ticket" | "invoice" | "receipt" | null
  >(null);

  const [, formAction, isPending] = useActionState(async () => {
    try {
      await cancelBookingAction(booking.id.toString());
      return { success: true, error: null };
    } catch (err) {
      return {
        success: false,
        error: "Automated cutoff refund window has closed.",
      };
    }
  }, null);

  // Time conversion metrics
  const evDate = booking.eventDate ? new Date(booking.eventDate) : null;

  const formattedDate = evDate
    ? evDate.toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Schedule Pending";

  const formattedTime = evDate
    ? `${evDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} IST`
    : "TBD";

  // 2. Generating valid external calendar links using native URLSearchParams engine mappings
  const compileCalendarUri = (engine: "google" | "outlook"): string => {
    if (!evDate) return "#";

    // Format target times directly to ISO 8601 Basic formatting patterns (YYYYMMDDTHHmmSSZ)
    const startTimeStr = evDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endTimeStr = new Date(evDate.getTime() + 7200000) // Defaulting to a 2-hour duration window
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");

    const detailsString = `PassId: ${booking.id}\nTicket Type: ${booking.ticketType}\nSeats: ${booking.seats}`;

    if (engine === "google") {
      const googleParams = new URLSearchParams({
        action: "TEMPLATE",
        text: booking.eventTitle,
        dates: `${startTimeStr}/${endTimeStr}`,
        details: detailsString,
        location: booking.eventLocation,
      });
      return `https://calendar.google.com/calendar/render?${googleParams.toString()}`;
    } else {
      // Outlook Live Web Calendar structure rules mappings
      const outlookParams = new URLSearchParams({
        rru: "addevent",
        subject: booking.eventTitle,
        startdt: evDate.toISOString(),
        enddt: new Date(evDate.getTime() + 7200000).toISOString(),
        body: detailsString,
        location: booking.eventLocation,
      });
      return `https://outlook.live.com/calendar/0/deeplink/compose?${outlookParams.toString()}`;
    }
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border border-zinc-800/80 bg-[#09090e] p-4 transition-all duration-200 hover:border-zinc-700/60 shadow-lg",
        activeTab !== "upcoming" &&
          "opacity-65 grayscale-20 hover:opacity-100 hover:grayscale-0",
      )}
    >
      {/* INJECT MOUNT ENGINE ON DEMAND */}
      {printConfig && (
        <DocumentPrintEngine
          type={printConfig}
          booking={booking}
          onClose={() => setPrintConfig(null)}
        />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start justify-between w-full">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="relative aspect-video w-24 rounded-lg overflow-hidden bg-zinc-900/60 shrink-0 border border-zinc-800/40">
            {booking.eventImage ? (
              <Image
                src={getImageUrl(booking.eventImage)}
                alt={booking.eventTitle}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-700 bg-zinc-950">
                <Ticket className="h-5 w-5" />
              </div>
            )}
          </div>

          <div className="space-y-2 min-w-0 flex-1">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                ID: {booking.id}
              </span>
              <h2 className="text-base font-bold text-white tracking-tight truncate group-hover:text-indigo-400 transition-colors">
                {booking.eventTitle}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5 min-w-0">
                <Calendar className="h-3.5 w-3.5 text-indigo-500 shrink-0" />{" "}
                <span className="truncate">
                  {formattedDate} • {formattedTime}
                </span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />{" "}
                <span className="truncate">{booking.eventLocation}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-end gap-2 shrink-0 border-t border-zinc-800/40 pt-3 sm:border-t-0 sm:pt-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors outline-none"
          >
            Manage Booking{" "}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-150",
                menuOpen && "rotate-180",
              )}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-56 rounded-xl border border-zinc-800 bg-[#0c0c14] p-1.5 shadow-2xl animate-fade-in select-none">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setPrintConfig("ticket");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
              >
                <Download className="h-3.5 w-3.5 text-zinc-500" /> Download Pass
                PDF
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setPrintConfig("invoice");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
              >
                <FileText className="h-3.5 w-3.5 text-zinc-500" /> Download
                Invoice
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setPrintConfig("receipt");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-zinc-500" /> Download
                Receipt
              </button>

              {activeTab === "upcoming" && (
                <>
                  <div className="my-1 border-t border-zinc-900" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShareFormOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  >
                    <Share2 className="h-3.5 w-3.5 text-indigo-400" /> Secure
                    Ticket Share
                  </button>
                  <a
                    href={compileCalendarUri("google")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  >
                    <CalendarPlus className="h-3.5 w-3.5 text-emerald-400" />{" "}
                    Sync Google Calendar
                  </a>
                  <a
                    href={compileCalendarUri("outlook")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  >
                    <Globe className="h-3.5 w-3.5 text-sky-400" /> Sync Outlook
                    Calendar
                  </a>
                  <div className="my-1 border-t border-zinc-900" />
                  <button
                    disabled={isPending}
                    onClick={() => {
                      if (
                        confirm(
                          "Request automated cancellation refund transaction?",
                        )
                      ) {
                        startTransition(() => formAction());
                      }
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-bold text-red-400 hover:bg-red-950/20 hover:text-red-300 disabled:opacity-40"
                  >
                    Cancel Booking / Refund
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-900/60 pt-3 select-none text-[11px] font-medium text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded bg-zinc-900 border border-zinc-800 px-1.5 py-0.5">
            <Users className="h-3 w-3 text-zinc-500" /> Seats: {booking.seats}
          </span>
          <span className="inline-block rounded bg-indigo-950/40 border border-indigo-900/40 px-1.5 py-0.5 font-semibold text-indigo-400">
            {booking.ticketType}
          </span>
          <span className="inline-block rounded bg-zinc-900 border border-zinc-800 px-1.5 py-0.5">
            {booking.format}
          </span>
        </div>
        <div className="font-mono text-white font-semibold">
          {booking.eventPrice === 0
            ? "FREE ACCESS"
            : `₹${booking.eventPrice.toFixed(2)}`}
        </div>
      </div>
    </div>
  );
}
