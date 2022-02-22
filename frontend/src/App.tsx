import React, {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  useEffect,
  useReducer,
} from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Room, Star } from "@material-ui/icons";
import "./App.scss";
import { format } from "timeago.js";
import * as type from "./react-app-env";

const reducer: type.reducerType = (state, action) => {
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
        showPopupId: action.payload,
      };
    case "pins":
      return {
        ...state,
        pins: action.payload,
      };
    case "user":
      return {
        ...state,
        user: action.payload,
      };
    case "newPlace":
      return {
        ...state,
        newPlace: action.payload,
      };
    case "focusPlace":
      return {
        ...state,
        focusPlace: action.payload,
      };
    case "addPlace":
      return {
        ...state,
        addPlace: action.payload,
      };
    default:
      return initialState;
  }
};

const initialState = {
  latitude: 0,
  longitude: 0,
  showPopupId: "",
  pins: [
    {
      _id: "",
      username: "",
      title: "",
      desc: "",
      rating: 0,
      updatedAt: "",
      latitude: 0,
      longitude: 0,
      createdAt: "",
    },
  ],
  user: "",
  newPlace: {
    latitude: 0,
    longitude: 0,
  },
  focusPlace: {
    latitude: 0,
    longitude: 0,
  },
  addPlace: {
    title: "",
    desc: "",
    rating: 0,
  },
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    latitude,
    longitude,
    showPopupId,
    pins,
    user,
    newPlace,
    focusPlace,
    addPlace,
  } = state;

  useEffect(() => {
    const pins = async () => {
      try {
        const res = await fetch("/pins");
        const data = await res.json();
        dispatch({ type: "pins", payload: data });
      } catch (err) {
        console.log(err);
      }
    };

    const showPosition = (position: {
      coords: { latitude: number; longitude: number };
    }): void => {
      dispatch({ type: "latitude", payload: position.coords.latitude });
      dispatch({ type: "longitude", payload: position.coords.longitude });
      dispatch({
        type: "focusPlace",
        payload: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      });
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

    return () => {};
  }, []);

  const handleAddClick = (e: mapboxgl.MapMouseEvent) => {
    dispatch({
      type: "newPlace",
      payload: { latitude: e.lngLat.lat, longitude: e.lngLat.lng },
    });
  };

  const addPlaceHandler = (e: ChangeEvent) => {
    let { name, value } = e.target as HTMLInputElement | HTMLSelectElement;

    // if (typeof value === "string") value = parseInt(value, 10);

    const payload: {
      [key: string]: string | number;
      title: string;
      desc: string;
      rating: number;
    } = {
      title: "",
      desc: "",
      rating: 0,
    };

    payload[name] = value;

    dispatch({ type: "addPlace", payload });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newPin = {
      username: user,
      title: addPlace.title,
      desc: addPlace.desc,
      rating: addPlace.rating,
      latitude: newPlace.latitude,
      longitude: newPlace.longitude,
    };
  };

  if (latitude && longitude && focusPlace.longitude && focusPlace.latitude) {
    return (
      <div className="App">
        <Map
          initialViewState={{
            longitude: focusPlace.longitude,
            latitude: focusPlace.latitude,
            zoom: 16,
          }}
          style={{ width: "100vw", height: "100vh" }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={process.env.REACT_APP_MAPBOX}
          onDblClick={handleAddClick}
          doubleClickZoom={false}
        >
          <Marker longitude={longitude} latitude={latitude} anchor="bottom">
            <Room style={{ color: "slateblue" }}></Room>
            <strong style={{ color: "slateblue" }}>I am HERE</strong>
          </Marker>
          {pins.map((pin) => (
            <>
              <Marker
                longitude={pin.longitude}
                latitude={pin.latitude}
                anchor="bottom"
              >
                <Room
                  style={{
                    color: pin.username === user ? "purple" : "tomato",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: "popup", payload: pin._id });
                    dispatch({
                      type: "focusPlace",
                      payload: {
                        latitude: pin.latitude,
                        longitude: pin.longitude,
                      },
                    });
                  }}
                ></Room>
              </Marker>
              {pin._id === showPopupId && (
                <Popup
                  longitude={pin.longitude}
                  latitude={pin.latitude}
                  anchor="left"
                  onClose={(e) => {
                    dispatch({ type: "popup", payload: "" });
                  }}
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
              )}
            </>
          ))}
          {newPlace.latitude && newPlace.longitude && (
            <Popup
              longitude={newPlace.longitude}
              latitude={newPlace.latitude}
              anchor="left"
              closeOnClick={false}
              onClose={() => {
                dispatch({
                  type: "newPlace",
                  payload: { latitude: 0, longitude: 0 },
                });
              }}
            >
              <div className="form-wrap">
                <form onSubmit={handleSubmit}>
                  <div className="input-wrap">
                    <label htmlFor="input-box">Title</label>
                    <input
                      type="text"
                      placeholder="Enter a title"
                      id="input-box"
                      name="title"
                      onChange={addPlaceHandler}
                    />
                  </div>
                  <div className="review-wrap">
                    <label htmlFor="review-box">Review</label>
                    <textarea
                      id="review-box"
                      placeholder="How's this place?"
                      name="desc"
                      onChange={addPlaceHandler}
                    ></textarea>
                  </div>
                  <div className="select-wrap">
                    <label htmlFor="select-box">rating</label>
                    <select
                      id="select-box"
                      name="rating"
                      onChange={addPlaceHandler}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                  <div className="submit-box">
                    <input type="submit" value={"Add a pin"} />
                  </div>
                </form>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    );
  }

  return <div className="App">Loading...</div>;
}

export default App;
