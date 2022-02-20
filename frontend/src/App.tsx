import React, { useEffect, useReducer } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Room, Star } from "@material-ui/icons";
import "./App.scss";

type stateType = {
  latitude: number;
  longitude: number;
  showPopup: boolean;
};

type ActionType =
  | { type: "latitude"; payload: number }
  | { type: "longitude"; payload: number }
  | { type: "popup"; payload: boolean };

type reducerType = (state: stateType, action: ActionType) => stateType;

const reducer: reducerType = (state: stateType, action: ActionType) => {
  switch (action.type) {
    case "latitude":
      return {
        ...state,
        latitude: action.payload,
      };
    case "longitude":
      return {
        ...state,
        longitude: action.payload,
      };
    case "popup":
      return {
        ...state,
        showPopup: action.payload,
      };
    default:
      return initialState;
  }
};

const initialState = {
  latitude: 0,
  longitude: 0,
  showPopup: true,
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { latitude, longitude, showPopup } = state;
  useEffect(() => {
    const showPosition = (position: {
      coords: { latitude: number; longitude: number };
    }): void => {
      dispatch({ type: "latitude", payload: position.coords.latitude });
      dispatch({ type: "longitude", payload: position.coords.longitude });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      //허용 안할시 기본값 판교
      dispatch({ type: "latitude", payload: 37.3897 });
      dispatch({ type: "longitude", payload: 127.1017 });
    }

    return () => { };
  }, []);

  if (latitude && longitude) {
    return (
      <div className="App">
        {latitude && longitude && (
          <Map
            initialViewState={{
              longitude,
              latitude,
              zoom: 16,
            }}
            style={{ width: "100vw", height: "100vh" }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={process.env.REACT_APP_MAPBOX}
          >
            <Marker longitude={longitude} latitude={latitude} anchor="bottom">
              <Room style={{ color: "slateblue" }}></Room>
              <strong style={{ color: "slateblue" }}>I am HERE</strong>
            </Marker>
            {showPopup && (
              <Popup
                longitude={longitude}
                latitude={latitude}
                anchor="left"
                onClose={() => dispatch({ type: "popup", payload: false })}
              >
                <ul className="card">
                  <li>
                    <em>Place</em>
                    <p className="place">My house</p>
                  </li>
                  <li>
                    <em>Review</em>
                    <p>Beautiful Place I like it</p>
                  </li>
                  <li>
                    <em>Rating</em>
                    <div className="stars">
                      <Star></Star>
                      <Star></Star>
                      <Star></Star>
                      <Star></Star>
                      <Star></Star>
                    </div>
                  </li>
                  <li>
                    <em>Information</em>
                    <span className="username">
                      Created by <b>Jewoo</b>
                    </span>
                    <span className="date">1 hour ago</span>
                  </li>
                </ul>
              </Popup>
            )}
          </Map>
        )}
      </div>
    );
  }

  return (
    <div className="App">
      Loading...
    </div>
  )
}

export default App;
