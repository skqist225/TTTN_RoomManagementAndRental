import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";

export const fetchRules = createAsyncThunk(
    "rule/fetchRules",
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/rules`);

            return { data };
        } catch (error) {}
    }
);

const initialState = {
    listing: {
        loading: true,
        rules: [],
        totalElements: 0,
    },
};

const ruleSlice = createSlice({
    name: "rule",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchRules.fulfilled, (state, { payload }) => {
            state.listing.loading = false;
            state.listing.rules = payload.data;
            state.listing.totalElements = payload.data.length;
        });
    },
});

export const ruleState = state => state.rule;
export default ruleSlice.reducer;
