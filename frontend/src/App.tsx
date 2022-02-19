import React, { useEffect, useState } from 'react';
import Map, {Marker, Popup} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Room} from '@material-ui/icons';

function App() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [showPopup, setShowPopup] = React.useState(true);

  useEffect(()=>{
    const showPosition = (position: { coords: { latitude: number; longitude: number; }; }): void => {
      
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    }

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
      //허용 안할시 기본값 판교
      setLatitude(37.3897);
      setLongitude(127.1017);
    }

    return () => {

    }
  },[]);

  return (
    <div className="App">
      {
        latitude && longitude && 
        <Map
        initialViewState={{
          longitude,
          latitude,
          zoom: 16
        }}
        style={{width: "100vw", height: "100vh"}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      >
        <Marker longitude={longitude} latitude={latitude} anchor="bottom" >
          <Room style={{color: "slateblue"}}></Room>  
          <strong style={{color: "slateblue"}}>I am HERE</strong>
        </Marker>
        {showPopup && (
      <Popup longitude={longitude} latitude={latitude}
        anchor="bottom"
        onClose={() => setShowPopup(false)}>
        You are here
      </Popup>)}
        </Map>
      }
    </div>
  );
} 

export default App;
