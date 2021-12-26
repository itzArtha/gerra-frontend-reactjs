import { motion } from "framer-motion";
import React from "react";

const TransparentButton = (props) => {
  return (
    <>
      <motion.button
        type={props.type}
        onClick={props.onClick}
        whileHover={{ scale: 1.01 }}
        disabled={props.disabled}
        className={`${props.className} border rounded-full px-2 py-1 ml-2 text-sm cursor-pointer`}
      >
        {props.label}
      </motion.button>
    </>
  );
};
export default TransparentButton;
