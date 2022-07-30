import React from "react";
import { Title } from "../Fonts";
import "./styles.scss";

const Button = ({ icon, caption, onClick, variant, disabled=false, style, level='headLine', ...rest }) => {
  return (
    <button disabled={disabled}
    style={style}
    className={"p-button p-button--" + variant} onClick={onClick} {...rest}>
      {icon && <span className="p-button__icon">{icon}</span>}
      <Title level={level}>
      {caption}
      </Title>
    </button>
  );
};

export default Button;
