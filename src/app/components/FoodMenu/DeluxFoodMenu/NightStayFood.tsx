interface NightStayProps {
    isVeg: boolean;
}

const NightStayFood:React.FC<NightStayProps> = ({ isVeg }) => {
    return (
        <div className="w-1/2 pl-4"> {/* Right Side */}
            {isVeg ? (
                <>
                    <h2 className='font-2xl font-semibold font-sans pt-4'>Dinner</h2>
                    <ul className='pl-5 marker:text-blue-500' >
                        <li className='list-disc'>Chappati</li>
                        <li className='list-disc'>Dal Curry</li>
                        <li className='list-disc'>Aloo Gobi</li>
                        <li className='list-disc'>Cabbage White Thoran</li>
                        <li className='list-disc'>Vegetable Salad</li>
                        <li className='list-disc'>Vendakka Mezhukupurathy</li>
                    </ul>
                    <h2 className='font-2xl font-semibold font-sans pt-4'>Breakfast (Only One Combination)</h2>
                    <ul className='pl-5 marker:text-blue-500' >
                        <li className='list-disc'>Tea / Coffee</li>
                        <li className='list-disc'>Bread, Jam, Butter OR</li>
                        <li className='list-disc'>Iddly, Sambar (By default) OR</li>
                        <li className='list-disc'>Dosa, Sambar OR</li>
                        <li className='list-disc'>Poori Masala OR</li>
                        <li className='list-disc'>Appam and Vegetable Curry OR</li>
                        <li className='list-disc'>Puttu and Kadala Curry</li>
                    </ul>
                </>
            ) : (
                <>
                    <h2 className='font-2xl font-semibold font-sans pt-4'>Dinner</h2>
                    <ul className='pl-5 marker:text-blue-500'>
                        <li className='list-disc'>Chappati</li>
                        <li className='list-disc'>Dal Curry</li>
                        <li className='list-disc'>Chicken Roast</li>
                        <li className='list-disc'>Vendakka Mezhukupurathy</li>
                        <li className='list-disc'>Salad</li>
                    </ul>
                    <h2 className='font-2xl font-semibold font-sans pt-4'>Breakfast (Only One Combination)</h2>
                    <ul className='pl-5 marker:text-blue-500'>
                        <li className='list-disc'>Tea / Coffee</li>
                        <li className='list-disc'>Bread, Jam, Butter, Omlette OR</li>
                        <li className='list-disc'>Iddly, Sambar. (By default) OR</li>
                        <li className='list-disc'>Dosa, Sambar OR</li>
                        <li className='list-disc'>Poori Masala OR</li>
                        <li className='list-disc'>Appam and Vegetable Curry / Egg Roast OR</li>
                        <li className='list-disc'>Puttu and Kadala Curry</li>
                    </ul>
                </>
            )}
        </div>
    )
}

export default NightStayFood;