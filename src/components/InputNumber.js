import React, { useState } from 'react';
import MainButton from './MainButton';

const CustomInput = (props) => {
  const [value, setValue] = useState(props.value || 0);

  const handleIncrement = () => {
    if (props.max && value >= props.max) return;
    setValue(prevValue => prevValue + 1);
    if (props.onChange) props.onChange(value + 1);
  };

  const handleDecrement = () => {
    if (props.min && value <= props.min) return;
    setValue(prevValue => prevValue - 1);
    if (props.onChange) props.onChange(value - 1);
  };

  const handleChange = (e) => {
    let newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) {
      newValue = 0;
    }
    if ((props.min && newValue < props.min) || (props.max && newValue > props.max)) {
      return;
    }
    setValue(newValue);
    if (props.onChange) props.onChange(newValue);
  };

  return (
    <React.Fragment>
      <div className="flex items-center space-x-2">
        <MainButton label="-" onClick={handleDecrement} />
        <input
          className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-yellow-500 dark:focus:border-blue-500 focus:outline-none"
          type="number"
          name={props.name}
          maxLength={props.maxLength}
          value={value}
          onChange={handleChange}
          onKeyDown={props.onKeyPress}
          placeholder={props.placeholder}
          disabled={props.disabled}
          min={props.min}
        />
        <MainButton label="+" onClick={handleIncrement} />
      </div>
    </React.Fragment>
  );
};

export default CustomInput;
