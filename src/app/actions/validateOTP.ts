export default async function validateOTP(phonenumber: string, otp: string) {
    try {
        //API call to verify the otp
        const response = await fetch('/api/twilio/VerifyOTP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                phoneNumber: phonenumber, 
                code: otp,
            }),
        });
        return response;
    } catch (error) {
        console.error('API error:', error);
        return null;
    }

}