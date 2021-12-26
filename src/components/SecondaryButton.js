import React from "react";
import { motion } from "framer-motion";

const SecondaryButton = (props) => {
  return (
    <React.Fragment>
      <motion.button
        type={props.type}
        onClick={props.onClick}
        whileHover={{ scale: 1.01 }}
        disabled={props.disabled}
        className={`${props.className} font-semibold px-4 py-2 tracking-wide border border-black text-black transition-colors duration-200 transform rounded-md hover:bg-yellow-400 focus:outline-none`}
      >
        {props.label}
      </motion.button>
    </React.Fragment>
  );
};
export default SecondaryButton;
