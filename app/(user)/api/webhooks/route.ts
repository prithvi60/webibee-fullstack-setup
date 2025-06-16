import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/utils/stripe";

interface StripeEvent {
  type: string;
  data: {
    object: any;
  };
}

interface StripeHeaders {
  get(name: string): string | null;
}

export async function POST(req: Request): Promise<Response> {
  let event: StripeEvent;

  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      ((await headers()) as StripeHeaders).get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    const errorMessage = err.message;
    // On error, log and return the error message.
    if (err) console.log(err);
    console.log(`Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  const permittedEvents: string[] = ["checkout.session.completed"];

  if (permittedEvents.includes(event.type)) {
    let data: any;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object;
          // console.log(`CheckoutSession status: ${data.payment_status}`);
          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error: any) {
      console.log(error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 }
      );
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: "Received" }, { status: 200 });
}
