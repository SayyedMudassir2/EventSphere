"use server";
import { Resend } from "resend";
import BookingConfirmation from "@/emails/BookingConfirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingEmail(userEmail: string, eventTitle: string) {
  try {
    await resend.emails.send({
      from: "your-domain@resend.dev",
      to: userEmail,
      subject: "Booking Confirmation",
      react: <BookingConfirmation eventTitle={eventTitle} />,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send confirmation email.");
  }
}
