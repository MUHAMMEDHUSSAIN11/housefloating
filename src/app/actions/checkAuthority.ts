export default function isAuthority(uId: string): boolean
 {
    const authorizedUserId = process.env.NEXT_PUBLIC_KHALAME;
    const authorizedADM = process.env.NEXT_PUBLIC_ADMFIR;
    // Check if the provided user ID matches the authorized ID
    return uId === authorizedUserId || uId === authorizedADM;
}
