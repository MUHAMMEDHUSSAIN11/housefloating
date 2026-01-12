const FormatToLocalDateTime = (date: Date) => {
    const d = new Date(date);
    // Create a new Date object at UTC midnight using the local year, month, and day
    const utcDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    return utcDate.toISOString();
}

export default FormatToLocalDateTime