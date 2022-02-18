import {AnimatePresence, motion} from "framer-motion";
import MainBackdrop from "../backdrop/MainBackdrop";
import MainButton from "../MainButton";
import SecButton from "../SecondaryButton";

const dropIn = {
    hidden: {
        y: "-100vh", opacity: 0,
    }, visible: {
        y: "0", opacity: 1, // transition: {
        //   duration: 0.1,
        //   type: "spring",
        //   damping: 50,
        //   stiffness: 500,
        // },
    }, exit: {
        y: "-100vh", opacity: 0,
    },
};

const LoginModal = ({
                        showModal, handleClose, text, title, onClick, children, buttonLabel, buttons = true,
                    }) => {
    return (<AnimatePresence>
        {showModal && (<MainBackdrop>
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className="modal"
                initial={"hidden"}
                animate={"visible"}
                exit={"exit"}
                variants={dropIn}
            >
                <div
                    className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div
                        className="flex items-start justify-between rounded-t">
                        <h4 className="text-2xl font-semibold">{title}</h4>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={handleClose}
                        >
                  <span
                      className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    {/*  */}
                  </span>
                        </button>
                    </div>
                    {/*body*/}
                    <div className="relative p-6 flex-auto">{children}</div>
                    {/*footer*/}

                    <div className="w-full text-center p-6 border-t border-solid">
                        <MainButton
                            type="button"
                            className="w-full md:w-1/2"
                            disabled={false}
                            onClick={handleClose}
                            label={"Gajadi"}
                        />
                    </div>
                </div>
            </motion.div>
        </MainBackdrop>)}
    </AnimatePresence>);
};
export default LoginModal;
