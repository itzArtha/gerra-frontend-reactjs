import { motion } from "framer-motion";
import React from "react";

const RoundedButton = (props) => {
  return (
    <>
      <motion.button
        type={props.type}
        onClick={props.onClick}
        whileHover={{ scale: 1.01 }}
        disabled={props.disabled}
        className={`${props.className} rounded-full font-semibold pl-2 tracking-wide border border-black text-black transition-colors duration-200 transform bg-yellow-400 hover:bg-yellow-300 focus:outline-none`}
      >
        {props.children}
      </motion.button>
    </>
  );
};
export default RoundedButton;
