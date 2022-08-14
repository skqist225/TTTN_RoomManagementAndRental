import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";

export const fetchBookingDetails = createAsyncThunk(
    "bookingDetail/fetchBookingDetails",
    async (page, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: { bookingDetails, totalElements, totalPages },
            } = await api.get(`/admin/bookingDetails?page=${page}`);

            return { bookingDetails, totalElements, totalPages };
        } catch (error) {}
    }
);

export const makeReview = createAsyncThunk(
    "booking/makeReview",
    async (
        {
            bookingId,
            cleanlinessRating,
            contactRating,
            checkinRating,
            accuracyRating,
            locationRating,
            valueRating,
            ratingComment,
        },
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const data = await api.post(`/booking/${bookingId}/create-review`, {
                cleanlinessRating,
                contactRating,
                checkinRating,
                accuracyRating,
                locationRating,
                valueRating,
                ratingComment,
            });
            return { data };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

const initialState = {
    listing: {
        loading: true,
        bookingDetails: [],
        totalPages: 0,
        totalElements: 0,
    },
};

const bookingDetailSlice = createSlice({
    name: "bookingDetail",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchBookingDetails.pending, (state, { payload }) => {
                state.listing.loading = false;
                state.listing.bookingDetails = [];
                state.listing.totalElements = 0;
                state.listing.totalPages = 0;
            })
            .addCase(fetchBookingDetails.fulfilled, (state, { payload }) => {
                state.listing.loading = false;
                state.listing.bookingDetails = payload.bookingDetails;
                state.listing.totalElements = payload.totalElements;
                state.listing.totalPages = payload.totalPages;
            });
    },
});

export const {} = bookingDetailSlice.actions;
export const bookingDetailsState = state => state.bookingDetail;
export default bookingDetailSlice.reducer;
