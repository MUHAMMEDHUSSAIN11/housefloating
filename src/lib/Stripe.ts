import Stripe from "stripe";

export const stripe = new Stripe(process.env.Strip_FB_SKEY!,{
    apiVersion:"2023-10-16",
    typescript: true,
});