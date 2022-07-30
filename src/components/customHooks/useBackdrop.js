import React, { useEffect } from "react";

const useBackdrop = ({ addBackdrop, onClick=()=>{} }) => {
  useEffect(() => {
    let backdropElement = document.getElementById("backdrop");
    if (addBackdrop) {
      backdropElement.classList.add("body-backdrop");
      backdropElement.onclick = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        onClick()
      };
    }
    return () =>
        backdropElement
        .classList.remove("body-backdrop");
  }, [addBackdrop]);
  return null;
};

export default useBackdrop;
