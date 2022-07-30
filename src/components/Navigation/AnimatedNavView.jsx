import React, { useState, useEffect, useRef } from "react";
import './Style.scss'

/**
 * Animated nav view
 */
const AnimatedNavView = ({ children, activeMenu, menuList }) => {
  const [bubblePosState, setBubblePosState] = useState(0)
  const [navBarHeight, setNavBarHeight] = useState(0)
  const bubblePos = useRef(0)

  
  useEffect(() => {
    const menus = document.querySelectorAll('[data-menu-item="true"]')
    const sections = document.querySelectorAll('[data-menu-interactive-section="true"]')
    
    const scrollListener = () => {
      sections.forEach(s => {
        const top = window.scrollY
        const offset = s.offsetTop
        const height = s.offsetHeight
        const id = s.dataset.menuInteractiveSectionId

        
        if (top > offset - (navBarHeight + navBarHeight) && top < offset + height - 400) {
          menus.forEach(m => {
            m.classList.remove('nav-active')

            document.querySelector(`[data-menu-item-id="${id}"]`).classList.add('nav-active')
          })
        }
        
      })

      const clientRect = document.querySelector('.nav-active')?.getBoundingClientRect()
      const navActiveIndicator = document.getElementById('active-menu-indicator')
      
      const leftPos = (clientRect?.left + clientRect?.width) - 20
      if (navActiveIndicator) {
        navActiveIndicator.style.left = `${leftPos}px`
      }

      bubblePos.current = leftPos
      setBubblePosState(leftPos)
    }

    window.onscroll = scrollListener

    scrollListener()

    return () => {
      scrollListener()
    }
  }, [menuList])


  useEffect(() => {
    const navActiveIndicator = document.getElementById('active-menu-indicator')
   
    // navActiveIndicator.classList.add('active-anim')
    
    // setTimeout(() => {
    //   navActiveIndicator.classList.remove('active-anim')
    // }, 600)


    return () => {
      navActiveIndicator.classList.remove('active-anim')
    }
  }, [bubblePos.current, bubblePosState])


  
  // Handle scroll on menu click
  useEffect(() => {
    const element = document.getElementById(activeMenu);
    const topPos = element?.getBoundingClientRect().top + window.scrollY;

    // Get nav height
    const navHeight = document.getElementById('animated-nav-view').clientHeight
    setNavBarHeight(navHeight)

    window.scrollTo({ top: topPos - navHeight + 5, behavior: "smooth" });
  }, [activeMenu]);

  return (
    <>
      {children && children}
    </>
  );
};

export default AnimatedNavView;