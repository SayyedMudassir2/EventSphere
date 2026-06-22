"use client";

import { useState, useTransition } from "react";
import { Search, Download, SearchX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LogRecord = {
  id: string;
  scanned: boolean;
  timestamp: string;
  eventTitle: string;
  eventPrice: number;
  attendeeName: string;
  attendeeEmail: string;
};

export function TransactionTableLog({
  initialData,
}: {
  initialData: LogRecord[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Optimized runtime substring evaluation
  const filteredRecords = initialData.filter((record) => {
    const normalizeQuery = searchQuery.toLowerCase().trim();
    return (
      record.attendeeEmail.toLowerCase().includes(normalizeQuery) ||
      record.attendeeName.toLowerCase().includes(normalizeQuery) ||
      record.eventTitle.toLowerCase().includes(normalizeQuery)
    );
  });

  // Zero-dependency, stream-allocated CSV generation engine
  const handleCSVExport = () => {
    startTransition(() => {
      const csvHeaders = [
        "Transaction ID",
        "Timestamp",
        "Event Name",
        "Attendee Name",
        "Attendee Email",
        "Price (INR)",
        "Status\n",
      ];
      const csvRows = filteredRecords.map(
        (r) =>
          `"${r.id}","${new Date(r.timestamp).toISOString()}","${r.eventTitle.replace(/"/g, '""')}","${r.attendeeName.replace(/"/g, '""')}","${r.attendeeEmail.replace(/"/g, '""')}","₹${r.eventPrice.toFixed(2)}","${r.scanned ? "Verified Access" : "Pending Gate"}"`,
      );

      const csvContent =
        "data:text/csv;charset=utf-8," +
        csvHeaders.join(",") +
        csvRows.join("\n");
      const encodedUri = encodeURI(csvContent);

      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", encodedUri);
      downloadAnchor.setAttribute(
        "download",
        `EventSphere_AuditLog_${new Date().toISOString().slice(0, 10)}.csv`,
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-[#09090e] shadow-2xl space-y-4 p-5">
      {/* Search Input and Export Toolbar Context */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Filter transactions by email, name, or event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/40 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={handleCSVExport}
          disabled={isPending || filteredRecords.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-white active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          Export CSV Registry ({filteredRecords.length})
        </button>
      </div>

      {/* Data Layout Viewport Window */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-300 border-collapse">
          <thead className="text-xs font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-900/20">
            <tr>
              <th className="px-4 py-3">Event Asset</th>
              <th className="px-4 py-3">Attendee Profile</th>
              <th className="px-4 py-3">Financial Payload</th>
              <th className="px-4 py-3 text-right">Gate Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {filteredRecords.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-16 text-center text-zinc-500 font-medium"
                >
                  <div className="flex flex-col items-center justify-center gap-2 max-w-xs mx-auto">
                    <SearchX className="h-8 w-8 text-zinc-600 stroke-[1.5]" />
                    <p className="text-xs">
                      No matching transaction records match your parameters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="transition-colors hover:bg-zinc-900/20 group text-xs"
                >
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {record.eventTitle}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="font-medium text-zinc-200">
                      {record.attendeeName}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      {record.attendeeEmail}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-mono font-semibold text-zinc-300">
                    {record.eventPrice === 0 ? (
                      <span className="text-emerald-400 font-sans uppercase text-[10px] font-bold">
                        Free Entry
                      </span>
                    ) : (
                      `₹${record.eventPrice.toFixed(2)}`
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset",
                        record.scanned
                          ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 ring-amber-500/20",
                      )}
                    >
                      {record.scanned ? "Verified Access" : "Pending Gate"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
