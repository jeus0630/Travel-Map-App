import React, { useEffect, useReducer } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Room, Star } from "@material-ui/icons";
import "./App.scss";
import { NumberLiteralType } from "typescript";
import { format } from "timeago.js"

type pinType = {
  _id: string;
  username: string;
  title: string;
  desc: string;
  rating: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}[];

type stateType = {
  latitude: number;
  longitude: number;
  showPopupId: string;
  pins: pinType;
};

type ActionType =
  | { type: "latitude"; payload: number }
  | { type: "longitude"; payload: number }
  | { type: "popup"; payload: string }
  | { type: "pins"; payload: pinType }

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
      console.log(action.payload);
      return {
        ...state,
        showPopupId: action.payload,
      };
    case "pins":
      return {
        ...state,
        pins: action.payload
      };
    default:
      return initialState;
  }
};

const initialState = {
  latitude: 0,
  longitude: 0,
  showPopupId: '',
  pins: [
    {
      _id: '',
      username: '',
      title: '',
      desc: '',
      rating: 0,
      updatedAt: '',
      latitude: 0,
      longitude: 0,
      createdAt: ''
    }
  ]
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { latitude, longitude, showPopupId, pins } = state;

  useEffect(() => {
    const pins = async () => {
      try {
        const res = await fetch('/pins');
        const data = await res.json();
        dispatch({ type: 'pins', payload: data });
      } catch (err) {
        console.log(err);
      }
    }

    const showPosition = (position: {
      coords: { latitude: number; longitude: number };
    }): void => {
      dispatch({ type: "latitude", payload: position.coords.latitude });
      dispatch({ type: "longitude", payload: position.coords.longitude });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
      pins();
    } else {
      //허용 안할시 기본값 판교
      dispatch({ type: "latitude", payload: 37.3897 });
      dispatch({ type: "longitude", payload: 127.1017 });
      pins();
    }

    return () => { };
  }, []);

  if (latitude && longitude) {

    return (
      <div className="App">
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
          {
            pins.map(pin => (
              <>
                <Marker longitude={pin.longitude} latitude={pin.latitude} anchor="bottom">
                  <Room style={{ color: "slateblue", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); dispatch({ type: 'popup', payload: pin._id }) }}></Room>
                </Marker>
                {
                  pin._id === showPopupId && <Popup
                    longitude={pin.longitude}
                    latitude={pin.latitude}
                    anchor="left"
                    onClose={(e) => { dispatch({ type: 'popup', payload: '' }) }}
                  >
                    <ul className="card">
                      <li>
                        <em>Place</em>
                        <p className="place">{pin.title}</p>
                      </li>
                      <li>
                        <em>Review</em>
                        <p>{pin.desc}</p>
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
                          Created by <b>{pin.username}</b>
                        </span>
                        <span className="date">{format(pin.createdAt)}</span>
                      </li>
                    </ul>
                  </Popup>
                }
              </>
            ))
          }

          {showPopupId && (
            <></>
          )}
        </Map>
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
