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
    pins: pinType;
    user: string;
};
  
export type ActionType =
    | { type: "latitude"; payload: number }
    | { type: "longitude"; payload: number }
    | { type: "popup"; payload: string }
    | { type: "pins"; payload: pinType }
    | { type: "user"; payload: string }
  
export type reducerType = (state: stateType, action: ActionType) => stateType;