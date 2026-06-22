"use server";

import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import BookingConfirmation from "@/emails/BookingConfirmation";
import React from "react";
import { generateTicketQR } from "@/lib/qr-code";

export async function sendBookingEmail(
  userEmail: string,
  eventTitle: string,
  bookingId: string,
) {
  // 1. Staff Engineering Fix: Enforce rigid variable configuration fallbacks to insulate against blank string crashes
  const senderEmail = process.env.EMAIL_USER;
  const appPassword = process.env.EMAIL_PASS;

  if (!senderEmail || !appPassword) {
    console.error(
      "EMAIL_PIPELINE_ERROR: Environment variables EMAIL_USER or EMAIL_PASS are missing.",
    );
    throw new Error("Failed to send email due to server configuration issues.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "://gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: senderEmail,
      pass: appPassword, // MUST be a 16-character Google App Password, not a standard account password
    },
  });

  try {
    // 2. Generate high-fidelity base64 data URL for offline image embedding support
    const qrCodeDataUrl = await generateTicketQR(bookingId);

    // Clean out the raw data protocol header to transform strings into a pure binary stream buffer array
    const base64RawData = qrCodeDataUrl.split(";base64,").pop();

    // 3. Render the standard component satisfying its contract properties perfectly
    const emailHtml = await render(
      React.createElement(BookingConfirmation, {
        eventTitle,
        bookingId, // Passes bookingId directly as required by the template contract
      }),
    );

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"EventSphere Team" <${senderEmail}>`,
      to: userEmail,
      subject: `Booking Confirmed: ${eventTitle} | Pass ID ${bookingId.slice(0, 8).toUpperCase()}`,
      html: emailHtml,
    };

    // 4. Advanced Deliverability Strategy: Attach the QR code as an inline graphic block if the base64 conversion is sound
    if (base64RawData) {
      mailOptions.attachments = [
        {
          filename: `EventSphere_Pass_${bookingId.slice(0, 8)}.png`,
          content: base64RawData,
          encoding: "base64",
          cid: "gate_pass_qr_code", // Allows email layout sheets to display this image inline offline
        },
      ];
    }

    await transporter.sendMail(mailOptions);
    console.log(
      "Email pipeline executed successfully to recipient transaction:",
      userEmail,
    );
  } catch (error) {
    console.error("EMAIL_PIPELINE_EXECUTION_FAULT:", error);
    throw new Error("Failed to send email");
  }
}
