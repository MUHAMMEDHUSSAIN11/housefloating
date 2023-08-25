import { Twilio } from "twilio";

export default function handler(req:any,res:any){
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }
    const { phoneNumber } = req.body;
    const {code} = req.body;

    //remove this after use
    console.log(code);
    console.log(phoneNumber);
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    try{
        const client = require('twilio')(accountSid, authToken);
        client.verify.v2.services('VAa3973a4d1086b619bcf81ef342722773')
        .verificationChecks
        .create({to:`${phoneNumber}`, code: `${code}`})
        .then((verification_Check:any) => {
            res.json({ verification_Check_status: verification_Check.status });
        });   
    }
    catch(error){
        console.error('Error creating verification:', error);
        res.status(500).json({ error: 'An error occurred' });
    }


}

