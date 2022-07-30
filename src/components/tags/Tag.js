import React from "react";
import cx from "classnames";
import "./styles.scss";

const Tag = ({ name, active, onChange, variant }) => {
  return (
    <div
      className={cx("p-tag", { "p-tag--active": active }, { [`p-tag--active-${variant}`]: active })}
      onClick={onChange}
    >
      {name}
    </div>
  );
};

export default Tag;
