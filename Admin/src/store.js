import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
    amenitySlice,
    authSlice,
    bookingSlice,
    bookingDetailSlice,
    categorySlice,
    citySlice,
    countrySlice,
    currencySlice,
    privacySlice,
    ruleSlice,
    roomSlice,
    userSlice,
    stateSlice,
    dashboardSlice,
    // reviewSlice,
    // earningSlice,
    // inboxSlice,
} from "./features";

const rootReducer = combineReducers({
    amenity: amenitySlice,
    auth: authSlice,
    booking: bookingSlice,
    bookingDetail: bookingDetailSlice,
    category: categorySlice,
    city: citySlice,
    country: countrySlice,
    currency: currencySlice,
    // earning: earningSlice,
    // inbox: inboxSlice,
    privacy: privacySlice,
    rule: ruleSlice,
    room: roomSlice,
    // review: reviewSlice,
    user: userSlice,
    state: stateSlice,
    dashboard: dashboardSlice,
});

const localUser = localStorage.getItem("admin-user")
    ? JSON.parse(localStorage.getItem("admin-user"))
    : null;

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
            listing: {
                users: [],
                loading: true,
                totalElements: 0,
                totalPages: 0,
            },
            get: {
                loading: true,
                user: {},
            },
            addUserAction: {
                loading: true,
                successMessage: "",
                errorMessage: "",
            },
            deleteUserAction: {
                loading: true,
                successMessage: null,
                errorMessage: null,
            },
            updateUserAction: {
                loading: true,
                successMessage: null,
                errorMessage: null,
            },
            fetchRolesAction: {
                roles: [],
            },
        },
    },
});

export default store;
