import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";

export const fetchPrivacies = createAsyncThunk(
    "privacy/fetchPrivacies",
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/room-privacy`);

            return { data };
        } catch (error) {}
    }
);

const initialState = {
    listing: {
        loading: true,
        privacies: [],
        totalElements: 0,
    },
};

const privacySlice = createSlice({
    name: "privacy",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchPrivacies.fulfilled, (state, { payload }) => {
            state.listing.loading = false;
            state.listing.privacies = payload.data;
            state.listing.totalElements = payload.data.length;
        });
    },
});

export const privacyState = state => state.privacy;
export default privacySlice.reducer;
