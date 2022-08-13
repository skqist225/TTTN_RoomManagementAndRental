import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";

export const fetchCategories = createAsyncThunk(
    "category/fetchCategories",
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/categories`);
            return { data };
        } catch (error) {}
    }
);

const initialState = {
    listing: {
        loading: true,
        categories: [],
        totalElements: 0,
    },
};

const roomSlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCategories.fulfilled, (state, { payload }) => {
                state.listing.loading = false;
                state.listing.categories = payload?.data;
                state.listing.totalElements = payload?.data.length;
            })
            .addCase(fetchCategories.pending, state => {
                state.listing.loading = true;
            })
            .addCase(fetchCategories.rejected, (state, _) => {
                state.listing.loading = false;
            });
    },
});

export const categoryState = state => state.category;
export default roomSlice.reducer;
