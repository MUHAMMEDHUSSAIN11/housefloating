import { razorpay } from "@/lib/Razorpay";
import { NextApiRequest, NextApiResponse } from "next";
import { PaymentModes } from "@/app/enums/enums";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { paymentId } = req.body;

        if (!paymentId) {
            return res.status(400).json({ error: "Payment ID is required" });
        }

        // Fetch payment details from Razorpay
        const payment = await razorpay.payments.fetch(paymentId);

        // Map Razorpay method to our PaymentModes enum
        let paymentModeId = PaymentModes.UPI; // Default to UPI
        if (payment.method === 'upi') {
            paymentModeId = PaymentModes.UPI;
        } else if (payment.method === 'card') {
            paymentModeId = PaymentModes.Card;
        } else if (payment.method === 'netbanking') {
            paymentModeId = PaymentModes.NetBanking;
        }

        res.status(200).json({ paymentModeId });
    } catch (error: any) {
        console.error("Razorpay Verification Error:", error);
        res.status(500).json({ error: "Failed to verify payment with Razorpay" });
    }
}
