"use client";
import { useState } from "react";
import { createPaymentOrder } from "@/app/actions/payment";
import { bookEventAction } from "@/app/actions/booking";

export default function RegisterButton({
  eventId,
  price,
}: {
  eventId: string;
  price: number;
}) {
  async function handlePayment() {
    // 1. Create Order
    const { orderId } = await createPaymentOrder(price);

    // 2. Configure Razorpay Options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: price * 100,
      currency: "INR",
      order_id: orderId,
      handler: async function (response: any) {
        // 3. Payment Success - Now save the booking to your DB!
        // @ts-ignore
        await bookEventAction(eventId);
        alert("Payment successful! You are registered.");
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }

  return (
    <button
      onClick={handlePayment}
      className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
    >
      Pay ₹{price} & Register
    </button>
  );
}
