import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";

export const fetchCurrencies = createAsyncThunk(
    "currency/fetchCurrencies",
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/currencies`);
            return { data };
        } catch (error) {}
    }
);

const initialState = {
    listing: {
        loading: true,
        currencies: [],
    },
};

const currencySlice = createSlice({
    name: "currency",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCurrencies.fulfilled, (state, { payload }) => {
                state.listing.loading = false;
                state.listing.currencies = payload?.data;
            })
            .addCase(fetchCurrencies.pending, state => {
                state.listing.loading = true;
            })
            .addCase(fetchCurrencies.rejected, (state, _) => {
                state.listing.loading = false;
            });
    },
});

export const currencyState = state => state.currency;
export default currencySlice.reducer;
