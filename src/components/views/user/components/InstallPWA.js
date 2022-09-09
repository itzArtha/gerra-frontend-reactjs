import React, { useEffect, useState } from "react";
import MainModal from "../../../modals/MainModal";

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [showInstall, setShowInstall] = useState(true);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);

  const onClick = (evt) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }

    promptInstall.prompt();
  };
  if (!supportsPWA) {
    return null;
  }
  return (
    <MainModal
      showModal={showInstall}
      handleClose={() => {
        setShowInstall(false);
      }}
      onClick={onClick}
      buttonLabel={"Install"}
      title="Install App Tokoevent Biar Lebih Mudah"
    >
      Kamu cukup Install App Tokoevent, maka harimu akan lebih berwarna :*
    </MainModal>
  );
};

export default InstallPWA;
