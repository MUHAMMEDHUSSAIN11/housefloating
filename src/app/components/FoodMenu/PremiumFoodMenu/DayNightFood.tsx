interface DayNightFoodProps {
    isVeg: boolean;
}

const DayNightFood:React.FC<DayNightFoodProps> = ({ isVeg }) => {
    return (
         <div className="w-full flex pr-4">
            {isVeg ? (
                 <>
                <div className="w-1/2">
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
                </div>
                <div className="w-1/2">
                    <h2 className='font-2xl font-semibold font-sans pt-4'>Dinner</h2>
                    <ul className='pl-5 marker:text-blue-500' >
                        <li className='list-disc'>Chappati</li>
                        <li className='list-disc'>Dal Curry</li>
                        <li className='list-disc'>Aloo Matter</li>
                        <li className='list-disc'>Gobi</li>
                        <li className='list-disc'>Cabbage White Thoran</li>
                        <li className='list-disc'>Vegetable Salad</li>
                        <li className='list-disc'>Vendakka Mezhukupurathy</li>
                    </ul>
                    <h2 className='font-2xl font-semibold font-sans pt-4'>Breakfast (Only One Combination)</h2>
                    <ul className='pl-5 marker:text-blue-500' >
                        <li className='list-disc'>Tea /Coffee</li>
                        <li className='list-disc'>Bread, Jam, Butter, Omlette OR</li>
                        <li className='list-disc'>Iddly, Sambar(By default) OR</li>
                        <li className='list-disc'>Dosa, Sambar OR</li>
                        <li className='list-disc'>Poori Masala OR</li>
                        <li className='list-disc'>Appam and Vegetable Curry / Egg Roast OR</li>
                        <li className='list-disc'>Puttu and Kadala Curry</li>
                    </ul>
                </div>
                </>
            ) : (
                 <>
                <div className="w-1/2">
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
                </div>
                <div className="w-1/2">
                    <h2 className='font-2xl font-semibold font-sans pt-4'>Dinner</h2>
                    <ul className='pl-5 marker:text-blue-500'>
                        <li className='list-disc'>Chappati</li>
                        <li className='list-disc'>Dal Curry</li>
                        <li className='list-disc'>Chicken Fry</li>
                        <li className='list-disc'>Fish curry</li>
                        <li className='list-disc'>Vendakka Mezhukupurathy</li>
                        <li className='list-disc'>Salad</li>
                    </ul>
                    <h2 className='font-2xl font-semibold font-sans pt-4'>Breakfast (Only One Combination)</h2>
                    <ul className='pl-5 marker:text-blue-500'>
                        <li className='list-disc'>Tea /Coffee</li>
                        <li className='list-disc'>Bread, Jam, Butter, Omlette OR</li>
                        <li className='list-disc'>Iddly, Sambar. (By default) OR</li>
                        <li className='list-disc'>Dosa, Sambar OR</li>
                        <li className='list-disc'>Poori Masala OR</li>
                        <li className='list-disc'>Appam and Vegetable Curry / Egg Roast OR</li>
                        <li className='list-disc'>Puttu and Kadala Curry</li>
                    </ul>
                </div>
                </>
            )}
        </div>
    )
}

export default DayNightFood;