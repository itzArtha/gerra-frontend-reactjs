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
  },
  exit: {
    y: "-100vh",
    opacity: 0,
  },
};

const AlertModal = ({ showModal, handleClose, text, image, button }) => {
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
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*body*/}
              <div className="relative p-6 flex-auto text-center">
                <img className="w-36 h-36 m-auto" src={image} alt="Icon" />
                <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                  {text}
                </p>
                {button && (
                  <div className="mt-8 w-full text-center">
                    <MainButton
                      type="button"
                      className="w-1/2"
                      disabled={false}
                      onClick={handleClose}
                      label={"Yaudah si"}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </MainBackdrop>
      )}
    </AnimatePresence>
  );
};
export default AlertModal;
