import { amount } from "../enums/enums";

export type AdvanceDetails =
{
    AdvanceAmount : number
    RemainingAmount : number
}

export default function calculateAdvance(Price: number): AdvanceDetails {
    const advanceAmount = Math.round((Price * amount.advance) * 100) / 100;
    const remainingAmount = Math.round((Price * amount.remaining) * 100) / 100;

    return {
        AdvanceAmount: advanceAmount,
        RemainingAmount: remainingAmount
    };
}