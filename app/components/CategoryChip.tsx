import type { ComponentType } from "react";

interface CategoryChipProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
}

export default function CategoryChip({ icon: Icon, label }: CategoryChipProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-[#09090e]/60 px-4 py-2 text-xs font-semibold tracking-wide text-zinc-300 backdrop-blur-sm transition-all duration-150 group-hover:border-indigo-500/40 group-hover:bg-indigo-600/10 group-hover:text-indigo-400 group-focus-visible:border-indigo-500/50 group-focus-visible:ring-1 group-focus-visible:ring-indigo-500/30 will-change-[background-color,color,border-color]">
      <Icon className="h-3.5 w-3.5 shrink-0 stroke-[1.8]" />
      <span>{label}</span>
    </div>
  );
}
