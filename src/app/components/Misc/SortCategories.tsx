'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { IoBoat ,IoDiamond ,IoBoatSharp } from "react-icons/io5";
import { IoIosBoat } from "react-icons/io";
import CategoryBox from "../Misc/CategoryBox";
import { Categories } from '@/app/enums/enums';


interface SortCategoriesProps {
  Setsort: (label:string) => void;
}

export const categories = [
  {
    label: Categories.Deluxe,
    icon:  IoIosBoat , 
    description: 'This property is close to the beach!',
  },
  {
    label: Categories.Premium,
    icon: IoBoat,
    description: 'This property is has windmills!',
  },
  {
    label: Categories.Luxury,
    icon: IoBoatSharp,
    description: 'This property is modern!'
  }
]

const Sortcategories:React.FC<SortCategoriesProps> = ({Setsort}) => {
  const params = useSearchParams();
  const category = params?.get('category');
  const pathname = usePathname();
  const isMainPage = pathname === '/boats';

  if (!isMainPage) {
    return null;
  }

  return (
      <div
        className="pt-8 flex flex-row items-center justify-center ">
        {categories.map((item) => (
          <CategoryBox 
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={category === item.label}
            setSort = {Setsort}
          />
        ))}
      </div>
  );
}
 
export default Sortcategories;