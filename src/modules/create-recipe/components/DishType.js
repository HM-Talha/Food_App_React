import React from "react";
import {ReactComponent as Create1} from "../../../assets/images/create-1.svg"
import {ReactComponent as Create2} from "../../../assets/images/create-2.svg"
import {ReactComponent as Create3} from "../../../assets/images/create3.svg"
import {ReactComponent as Create4} from "../../../assets/images/create4.svg"
import {ReactComponent as Create5} from "../../../assets/images/create5.svg"
import {ReactComponent as Create6} from "../../../assets/images/create6.svg"
import {ReactComponent as Create7} from "../../../assets/images/create7.svg"
import {ReactComponent as Create8} from "../../../assets/images/create8.svg"
import {ReactComponent as Create9} from "../../../assets/images/create9.svg"
import {ReactComponent as Create10} from "../../../assets/images/create10.svg"
import {ReactComponent as Create11} from "../../../assets/images/create11.svg"
import {ReactComponent as Create12} from "../../../assets/images/create12.svg"
import {ReactComponent as Create13} from "../../../assets/images/create13.svg"
import {ReactComponent as Create14} from "../../../assets/images/create14.svg"
import {ReactComponent as Create15} from "../../../assets/images/create15.svg"
import {ReactComponent as BackCreate} from "../../../assets/images/backcreate.svg"
import {useHistory} from "react-router-dom";

import Input, {CustomButton, CustomSelect} from "../../../components/formInput/Input";
import {BackCreateBtn} from "./PreparationTime";

export const DishType = ({dishType, setDishType, dishTypesOptions}) => {
    const history = useHistory();
    return (
        <>
            <div className="create-recipe-wrapper step2">
                <div className="item0">
                    <BackCreateBtn/>
                </div>
                <Create1 className="item1"/>
                <Create2 className="item2"/>
                <Create3 className="item3"/>
                <Create4 className="item4"/>
                <Create5 className="item5"/>
                <div className="input flex-column">
                    <b>Meal Course</b>
                    <CustomSelect value={dishType}  onSelect={(e) => {
                        setDishType(e.target.value)
                    }}>
                        {
                            dishTypesOptions.map(o => <option>{o}</option>)
                        }
                    </CustomSelect>
                </div>
                <Create6 className="item6"/>
                <Create7 className="item7"/>
                <Create8 className="item8"/>
                <Create9 className="item9"/>
                <Create10 className="item10"/>
                <Create11 className="item11"/>
                <Create12 className="item12"/>
                <Create13 className="item13"/>
                <Create14 className="item14"/>
                <Create15 className="item15"/>
                <Create1 className="item16"/>
                <Create2 className="item17"/>
                <Create3 className="item18"/>
                <Create4 className="item19"/>
                <Create5 className="item20"/>
                <Create6 className="item21"/>
                <Create7 className="item22"/>
                <Create8 className="item23"/>
                <Create9 className="item24"/>
                <Create10 className="item25"/>
                <Create11 className="item26"/>
                <Create12 className="item27"/>
                <Create13 className="item28"/>
                <Create14 className="item29"/>
                <Create15 className="item30"/>

            </div>
            {dishType !== "" && <CustomButton className="mt-3 create-next-btn" title={"Next"}
                                                onClick={() => {
                                                    history.push("/create/recipe/4")
                                                }}/>}
        </>
    )
};