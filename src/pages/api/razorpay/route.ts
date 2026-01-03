import { razorpay } from "@/lib/Razorpay";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { amount, metadata } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: metadata.reservationId,
            notes: metadata,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json(order);
    } catch (error: any) {
        console.error("Razorpay Order Creation Error:", error);
        res.status(500).json({ error: "Failed to create Razorpay Order" });
    }
}
