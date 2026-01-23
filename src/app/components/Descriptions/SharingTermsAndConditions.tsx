'use client';

const SharingTermsAndConditions = () => {
    return (
        <div className="bg-white p-4 font-sans shadow-sm rounded-sm">
            <h2 className="text-xl font-semibold mb-4">Sharing Boat Terms & Conditions</h2>

            <ul className="list-disc pl-4 marker:text-blue-500">
                <li className="mb-4">
                    <span className="font-semibold">Sharing Booking Policy</span>: This booking is under a sharing category where the houseboat is shared with other passengers, however, each guest will be provided with an individual private bedroom.
                </li>

                <li className="mb-4">
                    <span className="font-semibold">Boat Allocation</span>: In sharing bookings, the allocated houseboat may be changed due to operational, maintenance, or availability reasons. Any replacement will be of a similar category.
                </li>

                <li className="mb-4">
                    <span className="font-semibold">Check-in Time</span>: Guests must report at the boarding point on or before the scheduled check-in time. Houseboats operate on a fixed schedule and will not wait for late arrivals.
                </li>

                <li className="mb-4">
                    <span className="font-semibold">Late Arrival</span>: If the guest does not arrive on time and the houseboat has already started cruising, the guest must join the houseboat en route via speed boat.
                </li>

                <li className="mb-4">
                    <span className="font-semibold">Speed Boat Transfer</span>: A speed boat transfer may be arranged for late arrivals, subject to availability.
                </li>

                <li className="mb-4">
                    <span className="font-semibold">Speed Boat Charges</span>: Speed boat transfer charges are not included in the booking amount and must be paid entirely by the guest.
                </li>
            </ul>
        </div>
    );
};

export default SharingTermsAndConditions;
