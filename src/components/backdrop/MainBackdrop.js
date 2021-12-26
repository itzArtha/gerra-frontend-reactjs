import { motion } from "framer-motion";

const MainBackrop = ({ children, onClick }) => {
  return (
    <motion.div
      className="fixed w-full h-full top-0 left-0 bg-gray-400 flex justify-center items-center bg-opacity-60 z-50"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};
export default MainBackrop;
