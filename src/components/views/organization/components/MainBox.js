import { motion } from "framer-motion";
import Skeleton from "../../../Skeleton";

const MainBox = (props) => {
  return (
    <>
      {props.loading ? (
        <Skeleton className="w-full h-40 rounded" count="1" />
      ) : (
        <motion.div
          onClick={props.onClick}
          whileHover={{ scale: 1.01 }}
          className={`${props.className} font-semibold px-4 py-4 tracking-wide border border-black text-black transition-colors duration-200 transform rounded-md focus:outline-none`}
        >
          {props.children}
        </motion.div>
      )}
    </>
  );
};
export default MainBox;
