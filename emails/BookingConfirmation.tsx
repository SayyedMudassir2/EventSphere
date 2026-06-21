import { Html, Body, Head, Heading, Text } from "@react-email/components";
import * as React from "react";

export default function BookingConfirmation({
  eventTitle,
}: {
  eventTitle: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif" }}>
        <Heading>Booking Confirmed!</Heading>
        <Text>
          Thank you for booking your spot for <strong>{eventTitle}</strong>.
        </Text>
        <Text>We look forward to seeing you there!</Text>
      </Body>
    </Html>
  );
}
