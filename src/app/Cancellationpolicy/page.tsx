import React from 'react';
import Updated from '../components/Hero/Updated';
import Footer from '../components/Hero/Footer';

const Page = () => {
    return (
        <div className="pt-24 font-sans">
            <div className="max-w-screen-lg mx-auto p-2">
                <div className="flex flex-col gap-6">
                    <h2 className="text-3xl text-center font-semibold mb-5">Cancellation Policies</h2>
                    <ol className="pl-6">
                        <li className="mb-4">
                            <p className="text-gray-800">
                                To cancel your booking, simply visit our carts page. Our refund policy will go into effect immediately upon receiving your cancellation request. We aim to process all refunds within two weeks of receiving your cancellation email.
                            </p>
                        </li>
                        <li className="mb-4">
                            <p className="text-gray-800">
                                Please note that refunds will only be issued to the same payment method used for the original booking. Credit/debit card refunds will typically take up to 14-28 business days to process, while refunds for other payment methods may vary depending on the specific method used.
                            </p>
                        </li>
                        <li className="mb-4">
                            <p className="text-gray-800 font-semibold">
                                Cancellation Charges:
                            </p>
                            <ul className="list-disc pl-8">
                                <li className="mb-2">
                                    <span className="text-red-600 font-bold">90% refund</span> for cancellation <span className="font-semibold">15 days</span> prior to travel.
                                </li>
                                <li className="mb-2">
                                    <span className="text-red-600 font-bold">50% refund</span> for cancellation <span className="font-semibold">7 days</span> prior to travel.
                                </li>
                                <li className="mb-2">
                                    <span className="text-red-600 font-bold">No refund</span> for cancellation <span className="font-semibold">0-6 Days</span> prior to travel.
                                </li>
                            </ul>
                        </li>

                        <li className="mb-4">
                            <p className="text-gray-800">
                                <span className="font-bold">Special Cases:</span>
                            </p>
                            <ul className="list-disc pl-8">
                                <li className="mb-2">
                                    <span className="font-semibold">Strike:  </span>
                                    <br />
                                    If a labor strike or owner strike occurs and our operators are unable to process your booking on the scheduled date, we offer the flexibility to reschedule your booking for any other available date that suits your convenience. Alternatively, we also offer a full refund of the amount paid by the customer. At our company, we prioritize customer satisfaction and strive to provide the best possible solutions for any unforeseen circumstances that may arise.
                                </li>
                                <li className="mb-2">
                                    <span className="font-semibold">Natural Calamities:</span>
                                    <br />
                                    In the unfortunate event of natural calamities, bookings can be rescheduled to any other available date that suits your convenience. However, if rescheduling is not possible, we will gladly provide a full refund of the paid advance amount.
                                    Cancellations must be intimated through email a minimum of 3 days prior to the check-in date. Refunds will be processed within 21 working/business days.
                                </li>
                                <li className="mb-2">
                                    <span className="font-semibold">Unavailability of Houseboat Due to Manual/Technical Issues:</span>
                                    <br />
                                    In the event of unforeseen circumstances like manual or technical issues that prevent us from providing the booked houseboat, we will strive to arrange an alternative houseboat of the same category or a similar type for your booking. This arrangement will be applicable for normal days, excluding peak holidays such as Pooja Holiday [Navaratri], Diwali, and Christmas & New Year.
                                    If we are unable to arrange any alternative houseboat options, even during peak holidays, we will issue a full refund of your advance payment. However, we will not be liable for any additional expenses or compensation beyond the refunded advance amount.
                                </li>
                            </ul>
                        </li>

                        <li className="mb-4">
                            <p className="text-gray-800">
                                <span className="font-bold">Modify Your Reservation:</span>
                            </p>
                            <p className="text-gray-800 pl-8">
                                Please give us at least 10 days' notice if you decide to change the dates before check-in. No changes can be made in the six days leading up to check-in. If a day cruise houseboat is scheduled for you, the boat's cruise capacity will determine how many people can be accommodated.
                            </p>
                            <p className="text-gray-800 pl-8">
                                By paying additional fees, the number of passengers on a day cruise can be increased up to the boat's maximum cruise capacity. However, the cost may go up if you change the houseboat, and that depends on availability and date.
                            </p>
                            <p className="text-gray-800 pl-8">
                                Modifications are subject to the cost and the houseboat's availability. If the same houseboat or rate is not available, amendments cannot be made. We suggest that you book a new reservation in this case.                            </p>
                        </li>
                        <li className="mb-8">
                            <p className="text-lg font-semibold mb-2">
                                Please Note: No Cancellation Refunds or Amendments are allowed for bookings during the following periods:
                            </p>
                            <ul className="list-disc pl-8">
                                <li className="text-red-600 text-md mb-2">
                                    Navaratri Days [Pooja Holidays] Bookings
                                </li>
                                <li className="text-red-600 text-md mb-2">
                                    Diwali Days Bookings
                                </li>
                                <li className="text-red-600 text-md mb-2">
                                    Bookings from 20th December to 10th January
                                </li>
                            </ul>
                        </li>
                        <li className="mb-8">
                            <p className=" text-md font-semibold mb-2">
                                Once a booking is rescheduled, no further amendments or reschedules are allowed.
                                The full advance amount will be considered as cancellation fees with no refund provided.
                            </p>
                        </li>
                    </ol>
                </div>
            </div>
            <Updated />
            <hr />
            <Footer />
        </div>
    );
};

export default Page;
