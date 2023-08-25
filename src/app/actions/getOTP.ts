

export default async function sendotp(phonenumber:string) {
    try {
        //some error in api fetching not in regular intervals
        // Make API call using fetch to your custom API route
        const response = await fetch('/api/twilio/SendOTP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                phoneNumber: phonenumber, 
            }),
        });
        return response;
    } catch (error) {
        console.error('API error:', error);
        return null;
    }
    
}