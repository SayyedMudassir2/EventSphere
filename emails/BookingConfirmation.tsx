import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
  Link,
} from "@react-email/components";
import * as React from "react";

export interface BookingConfirmationProps {
  eventTitle: string;
  bookingId: string;
  qrCode?: string;
}

export default function BookingConfirmation({
  eventTitle,
  bookingId,
  qrCode,
}: BookingConfirmationProps) {
  const verifyUrl = `https://event-sphere-project.vercel.app/admin/verify/${bookingId}`;

  // Robust URL formatting checks for both inline CID streaming attachments and verified API endpoints
  const finalQrSource =
    qrCode && qrCode.includes(";base64,")
      ? "cid:gate_pass_qr_code"
      : qrCode || `https://qrserver.com{encodeURIComponent(verifyUrl)}`;

  return (
    <Html lang="en">
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brandBg: "#040407",
                cardBg: "#09090e",
                indigoAccent: "#4f46e5",
              },
            },
          },
        }}
      >
        <Head />
        <Preview>Your entry pass for {eventTitle} is ready!</Preview>

        <Body className="bg-brandBg text-white font-sans m-0 px-4 py-10">
          {/* Universal table element width constraints applied via pure pixel maps */}
          <Container className="bg-cardBg rounded-2xl p-6 sm:p-10 border border-zinc-800/80 max-w-125 mx-auto">
            {/* Header Identity Section */}
            <Section className="pb-5 border-b border-zinc-900">
              <Text className="text-[10px] font-mono font-bold tracking-widest text-indigoAccent uppercase m-0">
                Official Access Pass
              </Text>
              <Heading className="text-xl font-black text-white tracking-tight mt-1 mb-0 leading-tight">
                Booking Confirmed
              </Heading>
            </Section>

            {/* Notification Copywriting Body */}
            <Section className="pt-5">
              <Text className="text-sm leading-relaxed text-zinc-300 m-0">
                You are officially registered for{" "}
                <strong className="text-white font-bold">{eventTitle}</strong>.
                Your secure entry credential has been allocated successfully to
                your wallet ledger.
              </Text>
            </Section>

            {/* Email Client-Resilient Centered QR Section */}
            <Section className="my-6" align="center">
              <div className="inline-block p-4 bg-white rounded-2xl border border-zinc-200 shadow-xl">
                <Img
                  src={finalQrSource}
                  width="200"
                  height="200"
                  alt="Gate Pass QR Verification Code"
                  className="block select-none"
                />
              </div>
              <Text className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] uppercase mt-3 mb-0">
                ID: {String(bookingId).slice(0, 8).toUpperCase()}
              </Text>
            </Section>

            {/* CTA Verification Fallback Button */}
            <Section className="pb-6 border-b border-zinc-900" align="center">
              <Link
                href={verifyUrl}
                className="inline-block rounded-xl bg-indigoAccent px-6 py-3 text-xs font-bold uppercase tracking-wider text-white no-underline transition-all duration-150"
              >
                View Pass In Wallet
              </Link>
            </Section>

            {/* Operational Instructions Footer */}
            <Section className="pt-5">
              <div className="rounded-xl bg-black/40 border border-zinc-900 p-4 text-center">
                <Text className="text-[11px] font-semibold text-zinc-400 m-0 leading-normal">
                  Please present this digital pass at the venue entrance gate.{" "}
                  <br />
                  <span className="text-zinc-500 font-medium mt-0.5 inline-block">
                    Our operators will scan your QR token vector to verify entry
                    access.
                  </span>
                </Text>
              </div>
              <Text className="text-[10px] text-zinc-600 text-center mt-5 mb-0 font-medium">
                &copy; {new Date().getFullYear()} EventSphere Inc. Mumbai, MH,
                India.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
