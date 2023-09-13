//This Store is used to manage the mode chosen by the user , i.e , DayCruise or Overnight.
import {create} from 'zustand';

interface travelModeStore {
    travelMode : string,
    setTravelMode : (Mode : string) => void
}

const useTravelModeStore =  create<travelModeStore>((set) => ({
    travelMode : 'Overnight',
    setTravelMode : (Mode) => set({travelMode : Mode })
}));

export default useTravelModeStore;