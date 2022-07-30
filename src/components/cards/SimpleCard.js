import React, {PureComponent, useEffect, useState} from "react";
import {HeartIcon, ShareIcon, VMoreWhiteIcon} from "../../assets/icons";
import "./styles/simpleCard.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal} from "react-bootstrap";
import {vibrate} from "../../modules/onboarding/components/FoodtypeSelector";
import {getCompressedImgUrl} from "../../config/utils";
import { Title } from "../Fonts";
import CircularChart from "../Chart/CircularChart";

const SimpleCard = ({
                        img, footerText, onClick, probabilityScore = "", probabilityDetails = {
        x: [],
        y: []
    }, recipeDetails = {}, showBookmark = () => {
    }, showMoreBtn = undefined, onProbabilityIconClick = () => {
    }
                    }) => {
    const [show, setShow] = useState(false);
    const startAnimation = (entries, observer) => {
        entries.forEach(entry => {
          setTimeout(() => {
            entry.target.classList.toggle("text-animation", entry.isIntersecting);
          }, 1000)
        });
      };
      
      const observer = new IntersectionObserver(startAnimation);
      const options = { root: null, rootMargin: '0px', threshold: 1 }; 
      
      const elements = document.querySelectorAll('.text');
      elements.forEach(el => {
        observer.observe(el, options);
      });
    return (
        <>
            <a className="simple-card" onClick={onClick}>

                <div className="simple-card__header">
                    {
                        probabilityScore !== "" &&
                        <div
                            style={{ width: 32, height: 32, position: 'absolute', top: 0, left: 16 }}
                            onClick={(evt) => {
                            evt.preventDefault();
                            evt.stopPropagation();
                            setShow(true);
                            onProbabilityIconClick()
                        }}
                        >
                            <CircularChart value={probabilityScore} />
                        </div>
                    }
                    {!showMoreBtn && <div className={"simple-card__header--icon"}>
                        <HeartIcon onClick={(evt) => {
                            evt.preventDefault();
                            evt.stopPropagation();
                            showBookmark(evt)
                        }}/>
                    </div>}
                    {showMoreBtn && <div className={"simple-card__header--icon"}>
                        <VMoreWhiteIcon onClick={(evt) => {
                            evt.preventDefault();
                            evt.stopPropagation();
                            showMoreBtn(evt)
                        }}/>
                    </div>}
                </div>
                <img src={getCompressedImgUrl(img)}/>
                <Title level={'headLine'}>
                    {
                        footerText?.length > 23 ?  
                        <div className="simple-card__footer" style={{padding: '16px 0px'}}>
                            <div className="text">{footerText?.toLowerCase()}</div>
                        </div> :
                        <div className="simple-card__footer">
                            <Title level={'headLine'}><div style={{color: '#FFFFFF'}}>{footerText?.toLowerCase()}</div></Title>
                        </div>
                    }
                </Title>
            </a>
            {show && "nutritionalValue" in probabilityDetails &&
            <PopupModal show={show} setShow={setShow} title={footerText} probabilityDetails={probabilityDetails}
                        recipeDetails={recipeDetails}/>}
        </>
    );
};

export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export function getDistance(x1, y1, x2, y2) {
    const a = x1 - x2;
    const b = y1 - y2;
    return Math.hypot(a, b);
}

const CirclePaths = () => {
    let circlesData = [];
    const totalCircles = 10;
    let counter = 0;
    while (circlesData.length < totalCircles) {
        for (let i = 0; i < totalCircles; i++) {
            const radius = getRandomArbitrary(30, 60);
            const x = getRandomArbitrary(radius, 300 - radius);
            const y = getRandomArbitrary(radius, 300 - radius);
            if (circlesData.filter(c => getDistance(c.x, c.y, x, y) < c.radius + radius).length === 0) {
                circlesData.push({
                    x,
                    y,
                    radius
                })
            }

        }
        if (counter > 100) {
            break;
        }
        counter++;
    }
    circlesData = circlesData.sort((a, b) => {
        if (a.radius < b.radius) {
            return -1;
        }
        if (a.radius > b.radius) {
            return 1;
        }
        return 0;
    })
    return {
        get: () => {
            console.log("fetching circles")
            return circlesData;
        }
    }
};


let circles;

const PopupModal = ({show, setShow, title, probabilityDetails}) => {
    useEffect(() => {
        circles = CirclePaths().get();
    }, []);
    function svgCircleClick(e) {
        vibrate();
        const svgEle = document.getElementById("canvas-svg");
        svgEle.childNodes.forEach(chi => {
            chi.childNodes?.[0]?.setAttribute('stroke-width', 0);
        })
        let circleEle = e.target;
        if (e.target.tagName === "text") {
            circleEle = e.target.parentElement.childNodes[0]
        }
        circleEle.setAttribute('stroke', "#DBEF06");
        circleEle.setAttribute('stroke-width', 4);
        let x = parseFloat(circleEle.getAttribute("cx")) + parseFloat(circleEle.getAttribute("r")) - 10;
        const y = circleEle.getAttribute("cy") - 15;
        console.log(x,y)

        let gEle = document.getElementById("pathEle");
        if (gEle) {
            gEle.remove()
        }
        const svgns = "http://www.w3.org/2000/svg";
        const g = document.createElementNS(svgns, 'g');
        g.setAttribute("id", 'pathEle');
        const path = document.createElementNS(svgns, 'path');
        path.setAttribute("d", "M12 11L1 17L12 23.5V32H91V1H12V11Z");
        path.setAttribute("fill", "#DBEF06");
        path.setAttribute("stroke", '#DBEF06');
        path.setAttribute("stroke-width", '0.5');
        const text = document.createElementNS(svgns, 'text');
        if (x > parseFloat(svgEle.getAttribute("width").replace("px","")) - 90) {
            x = x - parseFloat(circleEle.getAttribute("r")) - parseFloat(circleEle.getAttribute("r")) + 15
            path.setAttribute("transform", 'translate(' + x + ',' + (y) + ') , scale(-1, 1)');
            text.setAttribute('x', x - 45);
        } else {
            text.setAttribute('x', x + 45);
            path.setAttribute("transform", 'translate(' + x + ',' + (y) + ')');
        }

        text.setAttribute('y', circleEle.getAttribute("cy"));
        text.setAttribute('text-anchor', "middle");
        text.setAttribute('fill', "black");
        text.setAttribute('dy', ".3em");
        text.setAttribute('font-size', "10px");
        let textNode = e.target.parentElement.children[1].innerHTML;
        text.innerHTML = Math.round((probabilityDetails.nutritionalValue[textNode].value + Number.EPSILON) * 100) / 100 + " " + probabilityDetails.nutritionalValue[textNode].unit;


        g.appendChild(path)
        g.appendChild(text)
        svgEle.appendChild(g)
    }

    function drawCircles() {
        const values = Object.keys(probabilityDetails.nutritionalValue).map(k => (
            {
                ...probabilityDetails.nutritionalValue[k],
                name: k
            }
        ));
        const nutritionals = values.sort((a, b) => {
            if (a.value < b.value) {
                return -1;
            }
            if (a.value > b.value) {
                return 1;
            }
            return 0;
        });
        const colors = ["#ABD9D6", "#748000", "#F6BF50", "#C89FEB", "#FC7647"]
        const svgCanvas = document.getElementById("canvas-svg");
        svgCanvas.innerHTML = "";
        const svgns = "http://www.w3.org/2000/svg";
        circles.slice(0, nutritionals.length).forEach((c, index) => {
            const g = document.createElementNS(svgns, 'g');
            const cir = document.createElementNS(svgns, 'circle');
            cir.setAttribute('cx', c.x);
            cir.setAttribute('cy', c.y);
            cir.setAttribute('r', c.radius);
            cir.setAttribute('fill', colors[index % colors.length]);


            const text = document.createElementNS(svgns, 'text');
            text.setAttribute('x', c.x);
            text.setAttribute('y', c.y);
            text.setAttribute('text-anchor', "middle");
            text.setAttribute('fill', "white");
            text.setAttribute('dy', ".3em");
            text.setAttribute('font-size', "10px");
            text.innerHTML = nutritionals[index].name;

            g.addEventListener('click', svgCircleClick);

            g.appendChild(cir)
            g.appendChild(text)
            svgCanvas.appendChild(g)
        });

    }

    useEffect(() => {
        if ("nutritionalValue" in probabilityDetails) {
            drawCircles();
        }
    }, [probabilityDetails])

    return (
        <Modal
            show={show}
            onHide={() => {
                setShow(false)
            }}
            centered
            keyboard={false}
            className="probability-wrapper"
        >

            <Modal.Body>
                <div className="d-flex align-items-center justify-content-between fw-bolder">
                    <span className="text-capitalize">{title}</span>
                    <span onClick={() => {
                        setShow(false)
                    }}>-</span>
                </div>
                <div className="probability-chart">
                    <svg height="300px" width="300px" id={"canvas-svg"} >
                        <path d="M12 11L1 17L12 23.5V32H91V1H12V11Z" fill="#DBEF06" stroke="#DBEF06" strokeWidth="0.5"/>
                    </svg>
                </div>
            </Modal.Body>
        </Modal>
    )
}


class CustomizedAxisTick extends PureComponent {
    render() {
        const {x, y, stroke, payload} = this.props;

        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)" fontSize={"10px"}>
                    {payload.value}
                </text>
            </g>
        );
    }
}

export default SimpleCard;


const getPath = (x, y, width, height) => `M${x},${y + height}
          C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
          C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
          Z`;

const TriangleBar = (props) => {
    const {fill, x, y, width, height} = props;

    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill}/>;
};