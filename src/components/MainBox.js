import React from "react";
import { motion } from "framer-motion";

const MainBox = (props) => {
  return (
    <React.Fragment>
      <motion.div
          onClick={props.onClick}
        whileHover={{ scale: 1.01 }}
        className="rounded-xl overflow-hidden border-2 border-black hover:bg-yellow-400 duration-300 cursor-pointer"
      >
        <div className="px-6 md:py-24 py-12">
          <div className="font-semibold text-xl text-center">
            {props.children}
          </div>
        </div>
      </motion.div>
    </React.Fragment>
  );
};
export default MainBox;
