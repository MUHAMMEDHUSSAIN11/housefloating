'use client';
import React, { useState } from "react";
import AccordionItem from "./AccordionItem";

const Accordion = () => {
  return (
    <section className="relative z-20 overflow-hidden bg-white pt-20 pb-12 lg:pt-[120 lg:pb-[90">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60 max-w-[520 text-center lg:mb-20">
              <span className="mb-2 block text-lg font-semibold text-primary">
                FAQ
              </span>
              <h2 className="mb-4 text-3xl font-bold text-dark sm:text-4xl md:text-[40">
                Any Questions? Look Here
              </h2>
            </div>
          </div>
        </div>
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              header=" What is the cost of renting a houseboat in Alleppey?"
              text="The cost of renting a houseboat in Alleppey, also known as Alappuzha, can vary depending on several factors, including the type of houseboat, its size, the season, and the amenities it offers.
              For a basic houseboat for a one-night stay, expect to pay around INR 8,000 to INR 15,000 (approximately USD 90 to USD 160) for two people. If you're interested in more luxurious options with extra amenities, they may cost more. Keep in mind that prices can be higher during peak seasons, weekends, holidays, and festivals. "
            />
            <AccordionItem
              header="What does the package offers?"
              text="When you book a houseboat with us, you're not just reserving a place to stay; you're embarking on a memorable journey. Your package encompasses cozy accommodation, delectable meals, and the dedicated service of our skilled crew. You'll be treated to a delightful welcome drink upon boarding, followed by a mouthwatering spread that includes lunch, evening snacks, dinner, and a hearty breakfast. Our captain, cook, and attentive attendants ensure your comfort and safety throughout the trip."
            />

            <AccordionItem
              header="What are the specified check-in and check-out timings for the houseboat?"
              text=" The timings can vary depending on the type of package you select. Typically, for Overnight stays, check-in is scheduled around 12:00 PM (noon), with check-out at 9:00 AM the following day. For Day Cruise packages, you'll usually check in at 11:00 AM and check out at 5:00 PM.It's important to note that late check-in doesn't come with an extension." />
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              header="Are houseboat trips safe for families and children?"
              text="Yes, houseboat trips are safe for families and children. Our experienced crew ensures the safety and comfort of all passengers. Life jackets and other safety measures are provided onboard."
            />
            <AccordionItem
              header="What are the most favorable seasons for experiencing houseboats in Alleppey?"
              text="The best time to visit Alleppey for a houseboat experience is during the winter months, from October to March, when the weather is pleasant. Monsoon season (June to September) is also an option for those who enjoy the lush green landscape, but it can be quite rainy."
            />
            <AccordionItem
              header="What is the cancellation policy for houseboat bookings?"
              text="Our cancellation policy varies depending on the package and the time of cancellation. We recommend reviewing our cancellation policy on our website or contacting our team for specific details."
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 z-[-1]">
        <svg
          width="1440"
          height="886"
          viewBox="0 0 1440 886"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.5"
            d="M193.307 -273.321L1480.87 1014.24L1121.85 1373.26C1121.85 1373.26 731.745 983.231 478.513 729.927C225.976 477.317 -165.714 85.6993 -165.714 85.6993L193.307 -273.321Z"
            fill="url(#paint0_linear)"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="1308.65"
              y1="1142.58"
              x2="602.827"
              y2="-418.681"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F0F0F0" stopOpacity="0.8" />
              <stop offset="1" stopColor="#0077B6" stopOpacity="0" />
              <stop offset="1" stopColor="#0077B6" stopOpacity="0.2" />
            </linearGradient>


          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Accordion;
