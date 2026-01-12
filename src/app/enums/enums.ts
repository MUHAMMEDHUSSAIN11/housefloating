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
    Deluxe = 1,
    Premium = 2,
    Luxury = 3,
    All = 4,
}

export enum amount
{
    advance = 0.3,
    remaining = 0.7,
    weekendPrice = 2000,
    preChristmas = 1.71, 
    christmasSeason = 2.20,
    offerPrice = 1.1,
    summerVaccationPrice = 2500,

    //need to be removed in upcoming sprints
    dayCruiseReduction = 500
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

export enum BookingType {
    private = 1,
    sharing = 2,
}

export enum BoatCruisesId {
    dayCruise = 1,
    overNightCruise = 2,
    nightStay = 3,
}

export enum BoatCruises {
    dayCruise = "Day Cruise",
    overNightCruise = "Overnight Cruise",
    nightStay = "Night Stay",
}

export enum PaymentModes {
    UPI = 1,
    Card = 2,
    NetBanking = 3
}

export const coordinates: [number, number] = [9.5008, 76.3443];