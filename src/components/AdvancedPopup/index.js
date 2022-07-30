import React, { useState } from "react";
import useBackdrop from "../customHooks/useBackdrop";
import cx from "classnames";
import PopupTopBar from '../../assets/icons/popupTopBar.svg';

// This is a more advanced version of the popup that supports more extensive custom styling.

export const AdvancedPopup = ({
    show,
    title,
    onHide,
    height = "70vh",
    children,
    showTopBar = false,
    customContainerClass,
    customTitleContainerStyles,
    customTitleStyles,
    customChildrenStyles,
    subTitle,
    subTitleStyles
}) => {
    const backdrop = useBackdrop({
        addBackdrop: show, onClick: () => {
            onHide()
        }
    });

    return (
        <div className={cx("f-l", { "f-l--active": show })} onClick={(evt) => {
            evt.stopPropagation();
            evt.preventDefault();
        }} style={{ height: show ? height : "0" }}>
            <div className={customContainerClass ? customContainerClass : 'f-l__wrapper'}>
                {
                    showTopBar
                    && 
                    <div className="d-flex justify-content-center w-100">
                        <img src={PopupTopBar} />
                    </div>
                }
                <div className={customTitleContainerStyles ? customTitleContainerStyles : ''}>
                    <h4 className={customTitleStyles ? customTitleStyles : ''}>{title}</h4>
                    {subTitle && subTitleStyles ? <p className={subTitleStyles}>{subTitle}</p> : null}
                </div>
                <div className={customChildrenStyles ? customChildrenStyles : ''}>
                {
                    children
                }
                </div>
            </div>
            <div className="f_l__footer_wrapper">
            </div>
        </div>
    );
};