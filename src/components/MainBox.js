import React from "react";
import { motion } from "framer-motion";

const MainBox = (props) => {
  return (
    <React.Fragment>
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="rounded-xl overflow-hidden border-2 border-black hover:bg-yellow-400 duration-300 cursor-pointer"
      >
        <div className="px-6 py-24">
          <div className="font-semibold text-xl text-center">
            {props.children}
          </div>
        </div>
      </motion.div>
    </React.Fragment>
  );
};
export default MainBox;
