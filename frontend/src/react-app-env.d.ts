/// <reference types="react-scripts" />
export type pinType = {
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
  
export type stateType = {
    latitude: number;
    longitude: number;
    showPopupId: string;
    showLogin: boolean;
    showRegister: boolean;
    pins: pinType;
    user: string;
    newPlace: {
        latitude: number;
        longitude: number;
    };
    focusPlace: {
        latitude: number;
        longitude: number;
    };
    addPlace: {
        title: string;
        desc: string;
        rating: number;
    }
};
  
export type ActionType =
    | { type: "latitude"; payload: number }
    | { type: "longitude"; payload: number }
    | { type: "popup"; payload: string }
    | { type: "pins"; payload: pinType }
    | { type: "user"; payload: string }
    | { type: "newPlace"; payload: { latitude: number; longitude: number } }
    | { type: "focusPlace"; payload: { latitude: number; longitude: number } }
    | { type: "addPlace"; payload: { title: string; desc: string; rating: number } }
    | { type: "resetPlace"; payload: { title: string; desc: string; rating: number } }
    | { type: "showLogin"; payload: boolean }
    | { type: "showRegister"; payload: boolean };
    
export type reducerType = (state: stateType, action: ActionType) => stateType;