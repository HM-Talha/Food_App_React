import { useLayoutEffect } from "react";

export const useStickyHeader = ({ id, stickyClassname, offset=0 }) => {
  useLayoutEffect(() => {
    window.addEventListener("scroll", function () {
      let headerLayout = document.getElementById(id);
      if (!headerLayout) return;
      if (window.pageYOffset > offset) {
        headerLayout.classList.add(stickyClassname);
      } else {
        headerLayout.classList.remove(stickyClassname);
      }
    });
  });
  return null;
};
