"use server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createPaymentOrder(amount: number) {
  const options = {
    amount: amount * 100, // Razorpay takes amount in paise
    currency: "INR",
    receipt: "order_rcptid_" + Date.now(),
  };

  try {
    const order = await razorpay.orders.create(options);
    return { orderId: order.id };
  } catch (err) {
    throw new Error("Failed to create order");
  }
}
