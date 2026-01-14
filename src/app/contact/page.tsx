import React from 'react';
import Aboutimage from '../components/Descriptions/AboutImage';
import Footer from '../components/Hero/Footer';
import Updated from '../components/Hero/Updated';

const Contact = () => {
    return (
      <>
      <Aboutimage/>
      <div className="font-sans max-w-5xl mx-auto pt-20 p-2">
            <h1 className="text-3xl font-semibold text-center mb-8">Contact Us</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">New Reservation?</h2>
                    <p className="text-blue-600"><a href="tel: +918714038424">+91 8714038424</a></p>
                    <p className="text-blue-600"><a href="mailto: housefloatingonline@gmail.com">housefloatingonline@gmail.com</a></p>
                    <br/>
                    <p>Contact these numbers for booking inquiries and quotations. If the number is not reachable, please drop a WhatsApp message. All numbers are WhatsApp enabled.</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-md">
                    <h2 className="text-2xl font-semibold  mb-4">Confirmed Bookings(Advance paid)</h2>
                    <p className="text-blue-600"><a href="tel: +1-800-987-6543">+91 9497252368</a></p>
                    <br/> 
                    <p className="mb-2">Have an existing booking with us (Advance paid one)? Feel free to use this number for boarding points, rescheduling, cancellations, refunds, and more! </p>
                </div>
            </div>
        </div>
        <br/>
        <hr/>
        <Updated/>
        <hr/>
        <Footer/>
        </>
    );
};

export default Contact;
