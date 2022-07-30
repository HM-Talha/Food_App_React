import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import "../styles/restaurantGallery.scss";
import axios from "axios";
import { baseUrl } from "../../../config/api-config";
import { BackIconVariant } from "../../../assets/icons";
import backIconVariant from "../../../assets/icons/back-variant.svg";
import Loader from "../../../components/loader/Loader";
import { lockBodyScroll, unlockBodyScroll, getCompressedImgUrl } from "../../../config/utils";
import Masonry from '@mui/lab/Masonry';

export const RestaurantGallery = (props) => {
    const [restaurant, setRestaurant] = useState('');
    const [selectedMenu, setSelectedMenu] = useState('Ambience');
    const [navMenus, setNavMenus] = useState(['Ambience', 'Menu']);
    const [navMenuImages, setNavMenuImages] = useState([]);
    const [ambienceImages, setambienceImages] = useState([]);
    const [menuImages, setMenuImages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalRender, setModalRender] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const [loader, setLoader] = useState(true);

    const history = useHistory();

    useEffect(() => {
        axios.get(`${baseUrl}/restaurant/get-restaurant-id?id=${props.match.params.id}`)
            .then(res => {
                setRestaurant(res.data.data);
                setambienceImages(res.data.data?.image);
                setMenuImages((res.data.data?.restaurant_menu).map(menuImage => menuImage.image[0]));
                setNavMenuImages([(res.data.data?.image[0] ?? ''), (res.data.data?.restaurant_menu[0]?.image[0] ?? '')])
                setLoader(false);
            })
    }, []);

    useEffect(() => {
        if (!loader) {
            setambienceImages(ambienceImages.filter(image => image));
            setMenuImages(menuImages.filter(image => image));
            if (ambienceImages.length === 0 || !ambienceImages) {
                setNavMenus(['Menu']);
                setNavMenuImages([navMenuImages[1]]);
                setSelectedMenu('Menu');
            } else if (menuImages.length === 0 || !menuImages) {
                setNavMenus(['Ambience']);
                setNavMenuImages([navMenuImages[0]]);
                setSelectedMenu('Ambience');
            }

            /* 
                The purpose of the code below is to make the ambience images and/or menu images even in number.
                The reason it needs to be even is so that the masonry layout is maintained properly.
            */

            if (ambienceImages.length > 0 && ambienceImages.length % 2 !== 0) {
                let filledEvenArray = ambienceImages;
                let lastImage = filledEvenArray.pop();
                filledEvenArray.push("");
                filledEvenArray.push(lastImage);
                setambienceImages(filledEvenArray);
            }

            if (menuImages.length > 0 && menuImages.length % 2 !== 0) {
                let filledEvenArray = menuImages;
                let lastImage = filledEvenArray.pop();
                filledEvenArray.push("");
                filledEvenArray.push(lastImage);
                setmenuImages(filledEvenArray);
            }
        }
    }, [loader])

    useEffect(() => {
        if (showModal) {
            lockBodyScroll();
            setTimeout(() => {
                setModalRender(true);
            }, 1);
        } else {
            setModalRender(false);
            unlockBodyScroll();
        }
    }, [showModal]);

    function hideModal() {
        setModalRender(false);
        setTimeout(() => {
            setShowModal(false);
        }, 200);
    }

    return (
        <>
            {
                showModal &&
                <div className={modalRender ? "galleryModal" : "renderGalleryModal"} onClick={() => { hideModal }}>
                    <div className="backIconContainer" onClick={hideModal}>
                        <img src={backIconVariant} className="filter-white" />
                    </div>
                    <img className="modalImage" src={getCompressedImgUrl(modalImage, 1000, 1000)} onClick={(e) => { e.stopPropagation() }} />
                </div>
            }
            {
                loader
                    ? <Loader loading={loader} isComponent />
                    : <div className="mainGalleryContainer">
                        <div className="galleryHeader">
                            <svg onClick={() => { history.goBack(); }} className="gallery-back-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p className="level-2 restaurant-gallery-page-title">{restaurant?.restaurantName}</p>
                        </div>
                        <div className="gallerySelectionMenu">
                            {
                                navMenus.map((menu, index) => (
                                    <div className={selectedMenu === menu ? 'selectedMenu' : 'unselectedMenu'} onClick={() => setSelectedMenu(menu)} key={index}>
                                        <img src={getCompressedImgUrl(navMenuImages[index])} />
                                        <p className="sub-heading">{menu}</p>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="masonaryContainer">
                            <Masonry columns={2} spacing={1.5} className="galleryImagesContainer">
                                {
                                    selectedMenu === 'Ambience'
                                    && ambienceImages.map((image, index) => (
                                        <img src={getCompressedImgUrl(image)} key={index} alt="" onClick={() => { if (image) { setModalImage(image); setShowModal(true); } }} />
                                    ))
                                }
                                {
                                    selectedMenu === 'Menu'
                                    && menuImages.map((image, index) => (
                                        <img src={getCompressedImgUrl(image)} key={index} alt="" onClick={() => { if (image) { setModalImage(image); setShowModal(true); } }} />
                                    ))
                                }
                            </Masonry>
                        </div>
                    </div>
            }
        </>
    )
} 