import React, {useState} from "react";
import cx from "classnames";
import { useHistory } from "react-router-dom";
import {
  DisabledNextStepIcon,
  NextStepIcon,
  SearchIcon,
} from "../../assets/icons";
import BackIcon from '../../assets/icons/back.svg'
import "./onboardingLayout.scss";
import Loader from "../loader/Loader";
import {vibrate} from "../../modules/onboarding/components/FoodtypeSelector";
import {getCompressedImgUrl} from "../../config/utils";
import { Footnote, Text, Title } from "../Fonts";

const OnboardingLayout = ({
  children,
  title,
  subTitle,
  disableNext,
  onNextClick,
  onBackClick = null,
  onSearchText = ()=>{},
  onSearchSelected = ()=>{},
  hideNext,
  hideSearch = false,
  className = "",
  showTopNavBar=true
}) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const history = useHistory();
  function goBack() {
    vibrate()
    if (!!onBackClick) return onBackClick();
    history.goBack();
  }

  function onBackBTNClick(){
    setSearchOpen(false)
  }
  return (
    <div className="o-layout">
      {showTopNavBar&&<div className="o-layout__header">
        <div>
          <img onClick={goBack} width={'24px'} height={'24px'} src={BackIcon} />
        </div>
        {
          subTitle ?  <div className='d-flex flex-column text-center title-wrapper mt-16px'>
            <Title level={2} className='mt-4px'>{title}</Title>
            {
                subTitle && <Footnote className={'mt-4px'} >{subTitle}</Footnote>
            }
          </div> :  <Title level={2} className={'w-100 text-center'}>{title}</Title>
        }

        <div>
          {!hideSearch && <SearchIcon onClick={()=>{
            vibrate()
            setSearchOpen(true)
          }}/>}
        </div>

      </div>}
      <div className={`o-layout__main ${className}`} id={"scroll-viewer"}>{children}</div>
      {!hideNext && (
        <div
          className={cx("o-layout__footer", {
            "o-layout__footer--disable": disableNext,
          })}
        >
          {disableNext ? (
            <DisabledNextStepIcon />
          ) : (
            <NextStepIcon onClick={(e) => {
              vibrate()
              onNextClick(e)
            }} />
          )}
        </div>
      )}

      {searchOpen && <div>
        <SearchComponent onBackClick={onBackBTNClick} onSearchText={onSearchText} onSearchSelected={(e) => {
          onSearchSelected(e)
          setSearchOpen(false)
        }}/>
      </div>}
    </div>
  );
};

export const SearchComponent = ({onBackClick, onSearchText, onSearchSelected, tabs=<div/>})=>{
  const [search, setSearch] = useState("")
  const [loader, setLoader] = useState(false);
  const [results, setResults] = useState([]);
  function handleInput(e){
    setResults([])
    setLoader(true)
    setSearch(e.target.value);
    localStorage.setItem('search', e.target.value)
    setTimeout(async ()=>{
      if (e.target.value.length > 0) {
        const res = await onSearchText(e.target.value);
        setResults(res);
      }
      setLoader(false)
    },500)
  }
  return <div className="search d-flex flex-column">
    <div>
    <div className="search__header pt-40px pb-40px pl-24px pr-24px">
      <img onClick={onBackClick} width={'24px'} height={'24px'} src={BackIcon} />
    </div>
    <div className="pl-24px pr-24px">
    <input className="search__input level-2" onChange={handleInput} autoFocus placeholder="Start Typing..." defaultValue={localStorage?.getItem('search')}/>
    </div>
    <div className="mt-24px">
    {
      tabs
    }
    </div>
    </div>

    <div className="">
    <div className="search__results">
      {
        results.map(r => (
            <div style={{marginTop: "1rem", display: "flex", alignItems: "center"}} onClick={() => {onSearchSelected(r); vibrate()}}>
              <img src={getCompressedImgUrl(r.image)} style={{width: "25px", height: "25px", borderRadius: "5px"}}/>
              <Text className={'pl-16px'}>
                {r.name}
              </Text>
            </div>
        ))
      }
    </div>

    <div className="w-100 mt-5">
      <Loader loading={loader} isComponent/>
    </div>
    </div>
  </div>
}

export default OnboardingLayout;
