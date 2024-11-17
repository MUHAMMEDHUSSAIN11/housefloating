import { stripe } from "@/lib/Stripe";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const body = req.body;

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  line_items.push({
    quantity: 1,
    price_data: {
      currency: 'INR',
      product_data: {
        name: body.items[0], 
        images: [body.items[3]], 
      },
      unit_amount: body.items[1] * 100,  
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: 'https://housefloating.vercel.app/cart',
    cancel_url: 'https://housefloating.vercel.app/cart',
    client_reference_id: body.Contactnumber,
    mode: 'payment',
    line_items,
    metadata: body.metadata,
    payment_intent_data: {
      metadata: body.metadata,
  },
  });

  res.status(200).json({ url: session.url });
};