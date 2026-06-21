import React from "react";

interface CategoryChipProps {
  icon: React.ElementType;
  label: string;
}

const CategoryChip = ({
  icon: Icon,
  label,
}: CategoryChipProps) => {
  return (
    <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-all">
      <Icon size={16} />
      <span className="text-sm">{label}</span>
    </button>
  );
};

export default CategoryChip;