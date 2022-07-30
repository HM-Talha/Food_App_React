import GoogleMap, { Marker } from "google-map-react";
import { geocodeByLatLng } from "react-google-places-autocomplete";
import "./style.scss";
import { MapMarkerIcon } from "../../assets/icons";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setLocation } from "../../modules/location/redux/actions";

const LocationMarker = ({ text, X }) => {
  console.log("X VALUE-->", X);
  return (
    <div className="marker__wrapper" style={{ marginTop: "-60px" }}>
      <MapMarkerIcon />
    </div>
  );
};

const MapComponent = ({ location: { location } }) => {
  const dispatch = useDispatch();

  const [markerData, setMarkerData] = useState({
    Latty: "",
    Longy: "",
  });

  const [isTrue, SetIsTrue] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (!location) history.replace("/home");
  }, []);

  useEffect(() => {
    geocodeByLatLng({ lat: markerData.Latty, lng: markerData.Longy })
      .then((results) => {
        dispatch(
          setLocation({
            ...results[0],
            label: results[0].formatted_address,
            value: {
              description: results[0].formatted_address,
              structured_formatting: {
                main_text: results[0].formatted_address.split(",")[0],
              },
            },
            markerData
          })
        );

        history.push("/location");
        // console.log("Working")
      })
      .catch((error) => console.error(error));
  }, [markerData]);

  console.log("location", location);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <GoogleMap
        bootstrapURLKeys={{ key: "AIzaSyCnJymfyIpprLsoWSONduHQ6_RBtSPn82g" }}
        center={{
          lat: location?.latitude,
          lng: location?.longitude,
        }}
        zoom={13}
        options={{
          minZoom: 10,
          maxZoom: 20,
          minZoomOverride: false,
        }}
        onClick={(e) => {
          setMarkerData({
            Latty: e.lat,
            Longy: e.lng,
          });
          SetIsTrue(true);
        }}
      >
        <LocationMarker
          lat={isTrue ? markerData.Latty : location?.latitude}
          lng={isTrue ? markerData.Longy : location?.longitude}
          X={markerData}
        />

        {console.log("LOCATION-->", location)}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
