import React, { useState } from "react";
import useBackdrop from "../customHooks/useBackdrop";
import cx from "classnames";
import PopupTopBar from '../../assets/icons/popupTopBar.svg';
import { Title } from "../Fonts";

export const Popup = ({
    show,
    title,
    onHide,
    height = "70vh",
    children,
    showTopBar = false,
    customContainerClass,
    customTitleContainerStyles,
    customChildrenStyles
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
                        <img className="mb-2" src={PopupTopBar} />
                    </div>
                }
                <Title level={2}>{title}</Title>
                {
                    children
                }
            </div>
            <div className="f_l__footer_wrapper">
            </div>
        </div>
    );
};