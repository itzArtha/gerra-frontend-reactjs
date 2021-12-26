import { motion } from "framer-motion";
import React from "react";

const MainButton = (props) => {
  return (
    <>
      <motion.button
        type={props.type}
        onClick={props.onClick}
        whileHover={{ scale: 1.01 }}
        disabled={props.disabled}
        className={`${props.className} font-semibold px-4 py-2 tracking-wide border border-black text-black transition-colors duration-200 transform bg-yellow-400 rounded-md hover:bg-yellow-300 focus:outline-none`}
      >
        {props.label}
      </motion.button>
    </>
  );
};
export default MainButton;
