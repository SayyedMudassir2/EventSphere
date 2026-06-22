import QRCode from "qrcode";

/**
 * Generates a high-fidelity, production-hardened verification QR Code Data URL.
 * Optimized with explicit error correction and custom palette mappings for elite scan velocity.
 *
 * @param bookingId - Unique database identifier token vector string
 * @returns Base64 image/png Data URL stream string
 */
export async function generateTicketQR(bookingId: string): Promise<string> {
  const secureBookingId = String(bookingId || "").trim();
  if (!secureBookingId) {
    throw new Error(
      "QR Generation Aborted: Missing distinct booking token descriptor.",
    );
  }

  try {
    const ticketUrl = `https://event-sphere-project.vercel.app/admin/verify/${secureBookingId}`;

    return await QRCode.toDataURL(ticketUrl, {
      type: "image/png",
      width: 250,
      margin: 1,
      errorCorrectionLevel: "H",
      color: {
        dark: "#09090e",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error(
      "QR_PIPELINE_VECTOR_GENERATION_FAULT:",
      err instanceof Error ? err.message : err,
    );
    throw new Error(
      "Could not parse entry check-in token vector data maps safely.",
    );
  }
}
