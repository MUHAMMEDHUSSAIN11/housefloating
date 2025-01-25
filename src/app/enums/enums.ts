export enum BookingStatus
{
    //when user requests a boat
    Requested = "Requested",

    //when admin approves the request
    Approved  = "Approved",

    //when user pays the advance
    Confirmed = "Confirmed",

    //when user cancels 
    Cancelled = "Cancelled",
}

export enum Categories
{
    Deluxe = 'Deluxe Houseboats',
    Premium  = 'Premium Houseboats',
    Luxury = 'Luxury Houseboats',
}

export enum amount
{
    advance = 0.3,
    remaining = 0.7,
    weekendPrice = 2500,
    preChristmas = 1.71, 
    christmasSeason = 2.20,
}

export enum Telegram
{
    botToken = '6317566293:AAFj2P1IlI91Cap6iR8Scy_A4xvFnyJTiws',
    chatId = '6777591451',
}

export enum TravelMode 
{
    DayCruise = "DayCruise",
    OverNight = "Overnight"
}