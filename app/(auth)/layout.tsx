// app/(auth)/layout.tsx
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
      {/* Minimal Header */}
      <header className="p-8">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          EventSphere
        </Link>
      </header>

      {/* Centered Content Area */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
