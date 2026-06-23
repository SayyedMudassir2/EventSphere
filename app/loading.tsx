// C:\Users\Alpha\event-sphere\app\(main)\loading.tsx
import { Loader2 } from "lucide-react";

// This MUST be the default export
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
        <span className="text-xs text-zinc-600 font-medium tracking-widest uppercase">
          Initializing
        </span>
      </div>
    </div>
  );
}
