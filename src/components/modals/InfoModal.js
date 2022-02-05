import { AnimatePresence, motion } from "framer-motion";
import MainBackdrop from "../backdrop/MainBackdrop";
import MainButton from "../MainButton";

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    // transition: {
    //   duration: 0.1,
    //   type: "spring",
    //   damping: 50,
    //   stiffness: 500,
    // },
  },
  exit: {
    y: "-100vh",
    opacity: 0,
  },
};

const InfoModal = ({
  showModal,
  handleClose,
  text,
  title,
  onClick,
  children,
  buttonLabel,
  buttons = true,
}) => {
  return (
    <AnimatePresence>
      {showModal && (
        <MainBackdrop onClick={handleClose}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="modal"
            initial={"hidden"}
            animate={"visible"}
            exit={"exit"}
            variants={dropIn}
          >
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col md:w-5/6 w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="p-5 border-b border-solid rounded-t">
                <h4 className="text-2xl font-semibold text-center">{title}</h4>
              </div>
              {/*body*/}
              <div className="relative p-6 flex-auto">{children}</div>
              {/*footer*/}
              <div className="flex items-center justify-end p-6 rounded-b gap-2">
                <MainButton
                  type="button"
                  className="w-full"
                  disabled={false}
                  label="Kembali"
                  onClick={handleClose}
                />
              </div>
            </div>
          </motion.div>
        </MainBackdrop>
      )}
    </AnimatePresence>
  );
};
export default InfoModal;
