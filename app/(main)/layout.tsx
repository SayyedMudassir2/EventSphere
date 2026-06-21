// app/(main)/layout.tsx
import Navbar from "@/app/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* This Navbar will now appear on all pages inside (main) */}
      <Navbar />

      <main>{children}</main>
    </div>
  );
}
