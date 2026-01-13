const CheckIsDateOver = (date: Date): boolean => {
    const today = new Date();

    // Standardize both to UTC midnight for comparison
    const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const dateUtc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

    return dateUtc >= todayUtc;
};

export default CheckIsDateOver;