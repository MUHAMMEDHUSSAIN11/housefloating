export enum BookingStatuses {
    Booked = 1,
    Cancelled = 2,
}

export enum Categories {
    Deluxe = 1,
    Premium = 2,
    Luxury = 3,
    All = 4,
}

export enum amount {
    advance = 0.3,
    remaining = 0.7,
    weekendPrice = 2000,
    preChristmas = 1.71,
    christmasSeason = 2.20,
    offerPrice = 1.25,
    summerVaccationPrice = 2500,
    commissionPercentage = 1.15,
    //need to be removed in upcoming sprints
    dayCruiseReduction = 500
}

export enum Telegram {
    botToken = '6317566293:AAFj2P1IlI91Cap6iR8Scy_A4xvFnyJTiws',
    chatId = '6777591451',
}

export enum TravelMode {
    DayCruise = "DayCruise",
    OverNight = "Overnight"
}

export enum BookingType {
    private = 1,
    sharing = 2,
}

export enum BoatCruisesId {
    dayCruise = 1,
    dayNight = 2,
    nightStay = 3,
}

export enum BoatCruises {
    dayCruise = "Day Cruise",
    dayNight = "Day Night",
    nightStay = "Night Stay",
}

export enum PaymentModes {
    UPI = 1,
    Card = 2,
    NetBanking = 3,
}

export enum CheckInOutTimes {
    SharingDayCruiseCheckIn = "1:00 PM",
    SharingDayCruiseCheckOut = "5:00 PM",

    SharingDayNightCheckIn = "1:00 PM",
    SharingDayNightCheckOut = "9:00 AM",

    SharingNightStayCheckIn = "6:00 PM",
    SharingNightStayCheckOut = "9:00 AM",

    PrivateDayCruiseCheckIn = "11:00 AM",
    PrivateDayCruiseCheckOut = "5:00 PM",

    PrivateDayNightCheckIn = "12:00 PM",
    PrivateDayNightCheckOut = "9:00 AM",

    PrivateNightStayCheckIn = "6:00 PM",
    PrivateNightStayCheckOut = "9:00 AM",
}

export const coordinates: [number, number] = [9.5008, 76.3443];