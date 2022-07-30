import React from "react";
import cx from "classnames";
import {getSelectedText} from "../../onboarding/components/UserFoodAllergic";
import "../styles/coursesCategory.scss";
import useBackdrop from "../../../components/customHooks/useBackdrop";
import { Caption, Title } from "../../../components/Fonts";

export const CoursesCategory = ({
                                    show,
                                    title,
                                    onSelectItem,
                                    selectedItem,
                                    showCategoryDropDown,
                                    
    categories = []
                                }) => {
    const backdrop = useBackdrop({addBackdrop: show});
    const timings = {
        "breakfast": "",
        "brunch":"",
        "lunch":"",
        "dinner": ""
    }
    return (
        <div className={cx("f-l", {"f-l--active": show})}>
            <div className="f-l__wrapper">
                <div onClick={() => showCategoryDropDown(false)} className="tab-popup-btn"></div>
                <Title level={2}><div style={{marginBottom: 0}}>{title}</div></Title>
                <Title level={'subHeading'}><div className="sub-grey-text">Menus</div></Title>
                <div className="f-l__list">
                    {
                        categories.map(item => (
                            <div
                                className={cx("mt-1 f-l__list--item", {
                                    "f-l__list--item-active": item === selectedItem,
                                })}
                                onClick={() => onSelectItem(item)}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-start",
                                    alignItems: "flex-start",
                                    textTransform: "capitalize"
                                }}
                            >
                                <Title level={'subHeading'}>{getSelectedText({parentAllergy: item}, item === selectedItem)}</Title>
                                <Caption><div className="sub-grey-text"
                                      style={{color: "#8A8A87", fontSize: "12px"}}>{timings[item]}</div></Caption>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};