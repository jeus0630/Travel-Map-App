import React, { useEffect } from 'react';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  useEffect(()=>{
    return () => {
        
    }
  },[]);
  return (
    <div className="App">
      <Map
      initialViewState={{
        longitude: 127.0403481,
        latitude: 37.7269078,
        zoom: 14
      }}
      style={{width: "100vw", height: "100vh"}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
    />
    </div>
  );
} 

export default App;
