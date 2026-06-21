import Link from "next/link";

export default function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-20">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-orange-500 p-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-size-[24px_24px]" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Host Your Own Event
          </h2>

          <p className="mb-8 max-w-lg text-lg text-white/90">
            Reach thousands of attendees. Our platform makes it easy to create,
            promote, and manage your events.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-xl bg-white px-8 py-3 font-semibold text-blue-700 shadow-lg transition-colors hover:bg-white/90 text-center"
            >
              Start as Organizer
            </Link>

            <Link
              href="/events"
              className="rounded-xl border border-white/20 bg-black/20 px-8 py-3 font-semibold text-white transition-all hover:bg-black/30 text-center"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
