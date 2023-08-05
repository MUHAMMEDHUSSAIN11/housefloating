'use client';

import React from 'react'
import 'react-day-picker/dist/style.css';
import { DayPicker } from 'react-day-picker';


interface DaySelectorProps {
  value: Date,
  onChange: (value: any) => void,
  disabledDates: Date[],
}

const Dayselector: React.FC<DaySelectorProps> = ({ value, onChange, disabledDates }) => {
  return (
    <DayPicker
      fromDate={new Date()}
      mode="single"
      selected={value}
      onSelect={onChange}
      disabled={disabledDates}
      styles={{
        head_cell: {
          width: "60px",
        },
        table: {
          maxWidth: "none",
        },
        day: {
          margin: "auto",
        },
      }}
    />
  );
}

export default Dayselector

