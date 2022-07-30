import React from "react";
import cx from "classnames";
import "./styles.scss";
import { Title } from "../Fonts";

const Input = ({className, onChange , label, name, isError, errorMessage, containerStyle, height = '48px', ...rest}) => {
    const isErrorStyle = isError && {borderColor: 'red', borderWidth:  1}
    return (
        <div style={containerStyle} className="p-input-wrapper">
            {label && <label className="sub-heading mb-0" htmlFor={name}>{label}</label>}
            <input style={{...isErrorStyle, height}} onChange={onChange} name={name} className={cx("mt-8px body-text", className,)} {...rest} />
           {isError && <p className="error__message">
                {errorMessage}
            </p>}
        </div>
    );
};

export default Input;


export const CustomButton = ({title, onClick, disabled, className=""}) => {
    return (
        <button style={{height: 48}} className={`p-btn-wrapper head-line ${className}`} onClick={onClick} disabled={disabled}>{title}</button>
    )
}

export const CustomSelect = ({title, onSelect, value, children, className=""}) => {
    return (
        <select className={`p-btn-wrapper ${className}`} onChange={onSelect}  >
            <option value=''></option>
            {children}
        </select>
    )
}