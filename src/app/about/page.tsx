import React from "react";
import AboutImage from "../components/Descriptions/AboutImage";
import Footer from "../components/Hero/Footer";
import Updated from "../components/Hero/Updated";

const About = () => {
  return (
    <>
      <AboutImage />
      <div className="font-sans max-w-screen-lg mx-auto pt-28 p-2">
        <h2 className="text-3xl text-center font-semibold mb-5">What we are</h2>
        <p className="text-lg font-medium">
          At Housefloating, we're your trusted partner for houseboat bookings in Alleppey. Our mission is simple: to make your houseboat adventure a breeze. We offer a handpicked selection of houseboats, catering to every budget and preference.

          With easy online booking, a passion for the backwaters of Alleppey, and a commitment to responsible tourism, we're here to help you discover the beauty of this serene destination. Your dream houseboat vacation is just a click away.
          <br />
          Welcome to Housefloating, where simplicity meets adventure.
        </p>
      </div>

      <div className="font-sans max-w-screen-lg mx-auto p-2">
        <h2 className="text-3xl text-center font-semibold mb-5">How we function</h2>
        <p className="text-lg font-medium">
          At Housefloating, we are dedicated to continually enhancing your houseboat booking experience, always striving to offer you the best deals. Our team aims to reduce the brokerage cost for the guests, and we consistently introduce new features to elevate your user experience, ensuring that your journey in the world of houseboat booking is exceptional.
        </p>
      </div>

      <br/>
      <hr/>
      <Updated/>
      <hr/>
      <Footer/>
    </>
  );
};

export default About;
