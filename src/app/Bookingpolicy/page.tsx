import React from 'react'
import Updated from '../components/Hero/Updated'
import Footer from '../components/Hero/Footer';


const page = () => {
  return (
    <div className='pt-28 font-sans'>
      <div className='max-w-screen-lg mx-auto'>
        <div className='flex flex-col gap-6 pl-1'>
          <h2 className="text-3xl text-center font-semibold mb-5">Booking Policies</h2>
          <h3 className='text-left text-xl font-semibold mb-1 pl-2'>Bookings</h3>
          <ol className="list-decimal pl-6">
            <li className="mb-4">
              <p className="text-black">The person making the booking must be 18 years of age or older.</p>
            </li>
            <li className="mb-4">
              <p className="text-black">
                If your preferred boat is unavailable, we will do our best to find you a similar boat. However, it's important to note that during peak holiday periods such as Pooja holidays,Christmas,New year and Diwali alternative arrangements may not be feasible due to increased demand and limited availability.
              </p>
            </li>
            <li className="mb-4">
              <p className="text-black">
                If we can't arrange a boat as stated in the above condition, we will refund your advance payment in full.
              </p>
            </li>
            <li className="mb-4">
              <p className="text-black">
                Please ensure you have collected all your belongings before disembarking. Lost and found claims will not be accepted after departure.
              </p>
            </li>
            <li className="mb-4">
              <p className="text-black">
                Please be aware that visitors will not have access to the kitchen facilities and that self-cooking is not allowed. If a guest requests that additional food of their choosing be prepared, there will be additional fees and charges for this service. Before disembarking, we respectfully request that visitors settle these fees immediately with the boat crew.
              </p>
            </li>
            <li className="mb-4">
              <p className="text-black">
                Respectful behavior is expected from all guests. Any disruptive or inappropriate conduct will be reported to the authorities without prior notice.</p>
            </li>
            <li className="mb-4">
              <p className="text-black">
                Guests are responsible for any damage caused to the houseboat resulting from the carelessness of themselves, their children, or wards. Such damages must be compensated directly to the houseboat owner before disembarkation.
              </p>
            </li>
            <li className="mb-4">
              <p className="text-black">For safety reasons, guests must follow the instructions of crew members during check-in, check-out, cruising, anchoring, and docking procedures.</p>
            </li>
            <li className="mb-4">
              <p className="text-black">Any additional costs not included in the booking confirmation that come up while the guest is visiting are their responsibility.</p>
            </li>
            <li className="mb-4">
              <p className="text-black">Please note that we are solely an online platform for booking houseboats. We do not take any responsibility for managing your personal belongings, travel documents, or any other personal affairs during your stay.</p>
            </li>
            <li className="mb-4">
              <p className="text-black">Housefloating assumes no responsibility for the standard of any service, and all bookings are made subject to the terms and conditions set forth by the respective service providers.</p>
            </li>
            <li className="mb-4">
              <p className="text-black">Housefloating is not liable for any loss, injury, or damage to person or property arising from unforeseen circumstances or events beyond our control.</p>
            </li>
            <li className="mb-4">
              <p className="text-black">Housefloating is not covered by any insurance policies. It is the guest's responsibility to ensure they have adequate personal insurance coverage. Guests are solely responsible for the safety of their luggage and personal belongings at all times.</p>
            </li>
            <li className="mb-4">
              <p className="text-black">While we strive to provide accurate information, we cannot guarantee the exactness of any service or experience, including the appearance of houseboat rooms or the specific nature of backwater tours. Your individual experience may vary.</p>
            </li>
            <li className="mb-4">
              <p className="text-black">Houseboat bookings are subject to availability and may be confirmed upon operator verification. In the event of a booking conflict, any payments made will be promptly refunded.</p>
            </li>
          </ol>


          <h3 className='text-left text-xl font-semibold mb-1 pl-2'>Houseboat Stay</h3>
          <ol className="list-decimal pl-6">
            <li className="mb-4">
              <p className="text-black">Houseboat reservations spanning 21 hours adhere to a check-in time of 12 PM and a check-out time of 9 AM. It's important to note that late check-ins or early check-outs won't be reimbursed. Our meals come from a delightful set menu, inclusive of all applicable taxes. The air conditioning operates from 9 PM to 6 AM, unless otherwise specified. Due to government regulations, the houseboat will be anchored from 5:00 PM to 6:00 AM, respecting the prohibition of usage during this period.</p>
            </li>
            <li className="mb-4">
              <p className="text-black">For hygiene and safety reasons, guests are kindly requested to consume meals only in the designated dining area. Eating in bedrooms or other areas of the houseboat is strictly prohibited.</p>
            </li>
            <li className="mb-4">
              <p className="text-black">In the event of an unexpected technical issue causing the air conditioning to malfunction, the houseboat stay will continue without air conditioning. As compensation, guests will receive a reimbursement of up to INR 1000.</p>
            </li>
            <li className="mb-4">
              <p className="text-black">Parents are solely responsible for the supervision and safety of their children during their stay on the houseboat.</p>
            </li>
            <li className="mb-4">
              <p className="text-black">For safety reasons, guests are not allowed to stay or sleep outside their rooms after 10:00 PM.</p>
            </li>
            <li className="mb-4">
              <p className="text-black">For the safety of guests and the houseboat, staff members will be present on the houseboat (front area/upper deck area) during nighttime.</p>
            </li>
            <li className="mb-4">
              <p className="text-black">Cruise hours are 8 a.m. to 9 a.m. (check out after) and 12 p.m. to 5 p.m., with a one-hour lunch break. There are only set day cruises, and they depend on the weather.</p>
            </li>
          </ol>

          <h3 className='text-left text-xl font-semibold mb-1 pl-2'>Accommodation Details</h3>
          <ol className="list-decimal pl-6">
            <h5 className='text-left text-md font-semibold pl-2'>Little Explorers (Below 5 years)</h5>
            <li className="mb-4">
              <p className="text-black">Enjoy a complimentary stay for children under 5 when they are the only child in the family. Your little one will share meals with you, and no extra arrangements will be provided. Please note that only one child under 5 is allowed per room.</p>
            </li>
            <h5 className='text-left text-md font-semibold pl-2'>Young Travelers (6 - 12 years)</h5>
            <li className="mb-4">
              <p className="text-black">For children aged 6 to 12, an additional charge (Rs 500 to Rs 2,000) applies, varying based on the boat. Your child will share the bed space with you, and the fee covers accommodation and associated amenities.</p>
            </li>
            <h5 className='text-left text-md font-semibold pl-2'>Teens and Adults (Above 12 years)</h5>
            <li className="mb-4">
              <p className="text-black">Teens aged 12 and above are considered adults and will incur an extra person fee, covering an additional mattress and food. The fee ranges from Rs. 500 to Rs. 3,500 based on the houseboat.</p>
            </li>
          </ol>
        </div>
      </div>
      <Updated />
      <hr />
      <Footer />
    </div>
  )
}

export default page
