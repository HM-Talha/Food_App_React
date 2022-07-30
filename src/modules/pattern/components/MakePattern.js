import React from 'react';
import {BackIcon, SearchIcon} from "../../../assets/icons";
import { useHistory} from "react-router-dom";
import "../styles/pattern.scss"
import Button from "../../../components/buttons";
import Tag from "../../../components/tags/Tag";
import { useDispatch } from 'react-redux';
import { setActivePath } from '../../layout/redux/actions';

const MakePattern = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    function goBack() {
        history.goBack()
        dispatch(setActivePath('/explore'))
    }
    function handlePush(){
        history.push("/pattern")
    }
    return (
        <div className="make-pattern">
            <div id="comfort-header" className="make-pattern__header">
                <BackIcon className="make-pattern__header--back" onClick={goBack}/>
                <div className="make-pattern__lower-header">
                    <h2>Pattern Making</h2>
                </div>
            </div>

            <div className="make-pattern__main">

            </div>
            <div className="make-pattern__footer">
                <div className="make-pattern__tags">
                    <Tag
                        name="Aroma"
                        active={false}
                        variant="secondary"
                    />
                    <Tag
                        name="Protein"
                        active={true}
                        variant="secondary"
                    />
                    <Tag
                        name="Texture"
                        active={false}
                        variant="secondary"
                    />
                    <Tag
                        name="Vitamins"
                        active={false}
                        variant="secondary"
                    />
                </div>
                <Button variant="primary" caption="Next" onClick={handlePush}/>
            </div>
        </div>
    );
};

export default MakePattern;
