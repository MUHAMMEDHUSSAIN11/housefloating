import { amount } from "../enums/enums";

export type AdvanceDetails =
{
    AdvanceAmount : number
    RemainingAmount : number
}

export default function calculateAdvance(Price: number ): AdvanceDetails {
    const advanceAmount = Price * amount.advance;
    const remainingAmount = Price * amount.remaining;

    return {
        AdvanceAmount: advanceAmount,
        RemainingAmount: remainingAmount
    };
}
