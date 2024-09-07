export default  function isAuthority(uId: string ): boolean {
    const authorizedUserId = process.env.NEXT_PUBLIC_KHALAME;
    // Check if the provided user ID matches the authorized ID
    console.log(uId === authorizedUserId);
    return uId === authorizedUserId;
}
