interface DayCruiseProps {
    isVeg: boolean;
}

const DayCruise:React.FC<DayCruiseProps> = ({ isVeg }) => {
    return (
        <div className="w-1/2 pr-4"> {/* Left Side */}
            {isVeg ? (
                // Content for Veg Menu (breakfast to evening)
                <>
                    <h2 className='font-2xl font-semibold font-sans pt-4'>Welcome drink</h2>
                    <ul className='pl-5 marker:text-blue-500'>
                        <li className='list-disc'>Fresh Juice or Tender Coconut</li>
                    </ul>
                    <h2 className='font-2xl font-semibold font-sans pt-4'>Lunch</h2>
                    <ul className='pl-5 marker:text-blue-500'>
                        <li className='list-disc'>Rice &amp; Chapathi</li>
                        <li className='list-disc'>Sambar</li>
                        <li className='list-disc'>Mixed Vegetables Thoran (Carrot, Cabbage, Beans)</li>
                        <li className='list-disc'>Mezhukupurathy (Long Beans)</li>
                        <li className='list-disc'>Bitter Guard Fry</li>
                        <li className='list-disc'>Banana Kalan</li>
                        <li className='list-disc'>Pappadam</li>
                        <li className='list-disc'>Paneer Masala</li>
                        <li className='list-disc'>Salad</li>
                        <li className='list-disc'>Pickle</li>
                        <li className='list-disc'>Payasam-Vermicelli</li>
                        <li className='list-disc'>Tropical seasonal fruit</li>
                    </ul>
                    <h2 className='font-2xl font-semibold font-sans pt-4'>Evening</h2>
                    <ul className='pl-5 marker:text-blue-500'>
                        <li className='list-disc'>Tea / Coffee</li>
                        <li className='list-disc'>Banana Fritters</li>
                    </ul>
                </>
            ) : (
                // Content for Non-Veg Menu (breakfast to evening)
                <>
                    <h2 className='font-2xl font-semibold font-sans pt-4'>Welcome drink</h2>
                    <ul className='pl-5 marker:text-blue-500'>
                        <li className='list-disc'>Fresh Juice or Tender Coconut</li>
                    </ul>
                    <h2 className='font-2xl font-semibold font-sans pt-4'>Lunch</h2>
                    <ul className='pl-5 marker:text-blue-500'>
                        <li className='list-disc'>Rice</li>
                        <li className='list-disc'>Sambar</li>
                        <li className='list-disc'>Mixed Vegetables Thoran (Carrot, Cabbage, Beans)</li>
                        <li className='list-disc'>Mezhukupurathy (Long Beans)</li>
                        <li className='list-disc'>Bitter Guard Fry</li>
                        <li className='list-disc'>Fish Fry (Pearl Spot / Seer Fish)</li>
                        <li className='list-disc'>Chicken Roast</li>
                        <li className='list-disc'>Banana Kalan</li>
                        <li className='list-disc'>Pappadam</li>
                        <li className='list-disc'>Salad</li>
                        <li className='list-disc'>Pickle</li>
                        <li className='list-disc'>Tropical seasonal fruit</li>
                    </ul>
                    <h2 className='font-2xl font-semibold font-sans pt-4'>Evening</h2>
                    <ul className='pl-5 marker:text-blue-500'>
                        <li className='list-disc'>Tea / Coffee</li>
                        <li className='list-disc'>Banana Fritters</li>
                    </ul>
                </>
            )}
        </div>
    );
}

export default DayCruise;