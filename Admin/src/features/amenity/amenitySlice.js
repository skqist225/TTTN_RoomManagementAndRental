import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";

export const fetchAmenities = createAsyncThunk(
    "amenity/fetchAmenities",
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/amenities`);
            return { data };
        } catch (error) {}
    }
);

const initialState = {
    listing: {
        loading: false,
        amenities: [],
        totalElements: 0,
    },
};

const amenitySlice = createSlice({
    name: "amenity",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchAmenities.fulfilled, (state, { payload }) => {
                state.listing.loading = false;
                state.listing.amenities = payload?.data;
                state.listing.totalElements = payload?.data.length;
            })
            .addMatcher(isAnyOf(fetchAmenities.pending), state => {
                state.listing.loading = true;
            })
            .addMatcher(isAnyOf(fetchAmenities.rejected), (state, { payload }) => {
                state.listing.loading = false;
            });
    },
});

export const amenityState = state => state.amenity;
export default amenitySlice.reducer;
