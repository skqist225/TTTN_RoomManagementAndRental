import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
    amenitySlice,
    authSlice,
    bookingDetailSlice,
    bookingSlice,
    cartSlice,
    categorySlice,
    citySlice,
    countrySlice,
    earningSlice,
    inboxSlice,
    reviewSlice,
    roomSlice,
    stateSlice,
    userSlice,
    ruleSlice,
} from "./features";

const rootReducer = combineReducers({
    room: roomSlice,
    category: categorySlice,
    country: countrySlice,
    state: stateSlice,
    city: citySlice,
    user: userSlice,
    amenity: amenitySlice,
    booking: bookingSlice,
    review: reviewSlice,
    earning: earningSlice,
    inbox: inboxSlice,
    auth: authSlice,
    cart: cartSlice,
    bookingDetail: bookingDetailSlice,
    rule: ruleSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

const localUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;

const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
    preloadedState: {
        user: {
            user: localUser,
            loading: true,
            successMessage: null,
            errorMessage: null,
            wishlistsIDs: [],
            wishlists: [],
            bookedRooms: [],
            update: {
                loading: true,
                successMessage: null,
                errorMessage: null,
            },
            wishlistsIDsFetching: true,
        },
    },
});

export default store;
