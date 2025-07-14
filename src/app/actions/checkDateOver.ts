const CheckIsDateOver = (date: Date): boolean => {
    const today = new Date();
    // Reset time part for accurate date comparison
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    // Return true if booking date is today or in the future
    return date >= today;
};

export default CheckIsDateOver;