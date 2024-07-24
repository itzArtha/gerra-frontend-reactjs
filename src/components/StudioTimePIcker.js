import React, { useState } from 'react';
import TimePicker from 'react-time-picker';
import MainButton from './MainButton';
import moment from 'moment';
import MainInput from "./MainInput";

function StudioTimePicker({ value, onChange }) {
  const [time, setTime] = useState('10:00');

  const handleChange = (newValue) => {
    setTime(newValue);
  };

  const addTime = () => {
    if (time) {
     /*  const formattedTime = moment(time, 'HH:mm').format('HH:mm'); */
      onChange([...value, time]);
    }
  };

  const removeTime = (indexToRemove) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-col justify-between">
      <div className="flex justify-between mb-4">
   {/*      <TimePicker
          onChange={handleChange}
          value={time}
          disableClock={true} // Disable the clock
          format="HH:mm" // Format to show only hours and minutes
          className="block mr-2 w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-yellow-500 dark:focus:border-blue-500 focus:outline-none"
          clearIcon={null} // Remove the clear icon
        /> */}
        <MainInput
                  min={moment().format("h:mm")}
                  type="time"
                  name="time"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value)
                  }}
                />
               
        <MainButton label="Tambah" onClick={addTime} className=' ml-3'/>
      </div>
      <div>
        {value.length > 0 && (
          <ul className="flex flex-wrap max-h-48 overflow-auto">
            {value.map((t, index) => (
              <li key={index}>
                <div className="w-fit mt-2 mr-2 font-semibold px-4 pr-2 py-2 tracking-wide border border-black text-black transition-colors duration-200 transform rounded-md focus:outline-none">
                  {t} <span className="shadow-sm cursor-pointer ml-1 text-red-500" onClick={() => removeTime(index)}>x</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

StudioTimePicker.defaultProps = {
  value: [],
  onChange: () => null,
};

export default StudioTimePicker;
