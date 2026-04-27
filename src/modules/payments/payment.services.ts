import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckoutSession = async (bookingId: string, studentEmail: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tutor: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  const tutorName = booking.tutor.user.name;
  const pricePerHour = booking.tutor.pricePerHour;

  // Calculate duration in hours
  const toMinutes = (time: string): number => {
    time = time.trim();
    // 24-hour format HH:MM
    const match24 = time.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
    if (match24) {
      const h = Number(match24[1]);
      const m = Number(match24[2]);
      return h * 60 + m;
    }

    // 12-hour format HH:MM AM/PM
    const match12 = time.match(/^(\d{1,2}):([0-5]\d)\s?(AM|PM)$/i);
    if (match12 && match12[1] && match12[2] && match12[3]) {
      const h = Number(match12[1]);
      const m = Number(match12[2]);
      const period = match12[3].toUpperCase();
      let hours = h === 12 ? 0 : h;
      if (period === "PM") hours += 12;
      return hours * 60 + m;
    }
    throw new Error(`Invalid time format: ${time}`);
  };

  const startMin = toMinutes(booking.startTime);
  const endMin = toMinutes(booking.endTime);
  const durationHours = (endMin - startMin) / 60;
  console.log("DEBUG: Initializing checkout", { pricePerHour, startMin, endMin, durationHours });
  
  const totalAmount = Math.round(pricePerHour * durationHours * 100); // in cents
  
  if (isNaN(totalAmount) || totalAmount < 50) {
    throw new Error(`Invalid payment amount: $${(totalAmount / 100).toFixed(2)}. Minimum allowed is $0.50.`);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Tutoring Session with ${tutorName}`,
            description: `Session on ${booking.date.toDateString()} from ${booking.startTime} to ${booking.endTime}`,
          },
          unit_amount: totalAmount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}&bookingId=${bookingId}`,
    cancel_url: `${process.env.APP_URL}/dashboard?cancelled=true`,
    customer_email: studentEmail,
    metadata: {
      bookingId,
    },
  });

  // Create or update payment record
  try {
    await prisma.payment.upsert({
      where: { bookingId: bookingId },
      update: {
        stripeSessionId: session.id,
        amount: pricePerHour * durationHours,
        status: "PENDING",
      },
      create: {
        bookingId: bookingId,
        amount: pricePerHour * durationHours,
        currency: "usd",
        status: "PENDING",
        stripeSessionId: session.id,
      },
    });
  } catch (dbError: any) {
    console.error("Payment Record DB Error:", dbError);
    throw new Error(`Could not save payment record: ${dbError.message}`);
  }

  return { url: session.url };
};

const handleWebhook = async (sig: string, payload: Buffer) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const bookingId = session.metadata.bookingId;

    await prisma.$transaction([
      prisma.payment.update({
        where: { bookingId },
        data: {
          status: "SUCCESS",
          stripePaymentId: session.payment_intent as string,
        },
      }),
      prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "CONFIRMED",
        },
      }),
    ]);
  }

  return { received: true };
};

const verifyPayment = async (sessionId: string, bookingId: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      await prisma.payment.upsert({
        where: { bookingId: bookingId },
        update: {
          status: "SUCCESS",
          stripePaymentId: session.payment_intent as string,
        },
        create: {
          bookingId,
          amount: (session.amount_total || 0) / 100,
          currency: "usd",
          status: "SUCCESS",
          stripeSessionId: sessionId,
          stripePaymentId: session.payment_intent as string,
        },
      });

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "CONFIRMED",
        },
      });

      return { success: true, message: "Payment verified and updated" };
    }
    return { success: false, message: "Payment not completed yet" };
  } catch (error: any) {
    throw new Error(`Verify Error: ${error.message}`);
  }
};

export const paymentServices = {
  createCheckoutSession,
  handleWebhook,
  verifyPayment,
};

