import React, {useEffect, useState} from 'react';
import "./style.scss"

const Carousel = (props) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const target = React.createRef();
    const {  children } = props;
    const scrollListener = () => {
        if (!target.current) {
            return;
        }

        const element = target.current;
        const windowScroll = element.scrollLeft; // Distance of the scrollbar from the leftmost point
        const totalWidth = element.scrollWidth - element.clientWidth; // Total width the scrollbar can traverse
        if (windowScroll === 0) {
            return setScrollProgress(0);
        }

        if (windowScroll > totalWidth) {
            return setScrollProgress(100);
        }

        setScrollProgress((windowScroll / totalWidth) * 100);
    }

    useEffect(() => {
        target.current.addEventListener('touchmove', scrollListener);
        return () => target.current && target.current.removeEventListener('touchmove', scrollListener);
    });
    return (
        <div className="main-carousel-container">
            <div className="carousel-container" ref={target}>
                {children}
            </div>
        </div>
    );
};

export default Carousel;
