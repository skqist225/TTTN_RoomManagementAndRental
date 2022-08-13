import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";

export const fetchCountries = createAsyncThunk(
    "country/fetchCountries",
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/countries`);
            return { data };
        } catch (error) {}
    }
);

const initialState = {
    listing: {
        loading: true,
        countries: [],
    },
};

const countrySlice = createSlice({
    name: "country",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCountries.fulfilled, (state, { payload }) => {
                state.listing.loading = false;
                state.listing.countries = payload?.data;
            })
            .addMatcher(isAnyOf(fetchCountries.pending), state => {
                state.listing.loading = true;
            })
            .addMatcher(isAnyOf(fetchCountries.rejected), (state, { payload }) => {
                state.listing.loading = false;
            });
    },
});

export const countryState = state => state.country;
export default countrySlice.reducer;
