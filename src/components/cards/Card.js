import React, {useEffect, useState} from "react";
import { ShareIcon, HeartIcon } from "../../assets/icons";
import "./styles/card.scss";
import {getCompressedImgUrl} from "../../config/utils";
import { Title } from "../Fonts";

const Card = ({ img, children, tagNames }) => {
    const [tagIndex, setTagIndex ] = useState(0);
    useEffect(() => {
        if (tagNames.length > 1) {
            const timeoutIdx = setInterval(() => {
                setTagIndex(idx => ((idx + 1) % tagNames.length))
            }, 3000);
            return () => {
                clearInterval(timeoutIdx)
            }
        }
    }, [tagNames])
  return (
    <a className="p-card">
      <div className="p-card__header">
          <Title level={'subHeading'}>{!tagNames ? <span/> :  <div className="p-card__header--tag">
              {tagNames[tagIndex]}
          </div>}</Title>
        <div className="p-card__header--icons">
            {/* <div  className="p-card__header--icon">
                <ShareIcon />
            </div> */}
            <div  className={"p-card__header--icon"}>
                <HeartIcon />
            </div>
        </div>
      </div>
      <img src={getCompressedImgUrl(img)} />
      {children}
    </a>
  );
};

const CardFooter = ({ children }) => {
  return <div className="p-card__footer">{children}</div>;
};

export { CardFooter, Card };
