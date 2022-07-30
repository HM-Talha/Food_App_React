import React from "react";

const Tabs = ({ children,handleTabClick, activeTabIndex  }) => {
  return (
    <div className="p-tabs">
      <div className="p-tabs__items">
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            onClick: handleTabClick,
            tabIndex: index,
            isActive: index === activeTabIndex,
          });
        })}
      </div>
      <div></div>
    </div>
  );
};

export default Tabs;

export const Tab = (props) => {
  return (
    <li className="tab">
      <a
        className={`tab-link ${props.linkClassName} ${
          props.isActive ? "active" : ""
        }`}
        onClick={(event) => {
          event.preventDefault();
          props.onClick(props.tabIndex);
        }}
      >
        <i className={`tab-icon ${props.iconClassName}`} />
      </a>
    </li>
  );
};
