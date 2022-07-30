import React from 'react';
import { Caption } from '../Fonts';
import "./styles.scss"

const SimpleTag = ({name, className }) => {
    return (
        <div className={`simple-tag ${className}`}>
           <Caption>{name}</Caption>
        </div>
    );
};



export default SimpleTag;
