import { stripe } from "@/utils/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse the request body to get the priceValue
    const { amount, currency, redirectUrl, productName } = await request.json();

    // Validate required fields
    if (!amount || !currency || !redirectUrl || !productName) {
      throw new Error("Missing required fields in request body");
    }

    // Convert amount to the smallest currency unit (e.g., paise for INR)
    const unitAmount = amount * 100;

    // Create Checkout Session using the dynamically created Price Object
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: productName,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${redirectUrl}?paymentStatus=success`,
      cancel_url: `${redirectUrl}?paymentStatus=canceled`,
    });

    // Return the session URL as JSON
    return NextResponse.json({ sessionId: session.id });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
