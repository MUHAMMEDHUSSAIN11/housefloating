import React from 'react';
import Aboutimage from '../components/Descriptions/AboutImage';
import Footer from '../components/Hero/Footer';
import Updated from '../components/Hero/Updated';

const Contact = () => {
    return (
      <>
      <Aboutimage/>
      <div className="font-sans max-w-5xl mx-auto pt-10 p-2">
            <h1 className="text-3xl font-semibold text-center mb-8">Contact Us</h1>
            <div className="grid grid-cols-1 justify-items-center">
                <div className="bg-white rounded-lg md:px-10 shadow-md">
                    <h2 className="text-2xl font-semibold">BaytCode Technologies Pvt Ltd</h2>
                    <p className='text-lg'>Alappuzha, Kerala, India</p>
                    <p className="text-blue-600"><a href="mailto: housefloatingonline@gmail.com">housefloatingonline@gmail.com</a></p>
                    <p className="text-blue-600"><a href="tel: +919207777911">+91 9207777911</a></p>
                    <br/>
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
