import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";
import { RootState } from "../../store";

export const fetchRules = createAsyncThunk(
    "rule/fetchRules",
    async (page, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/rules`);

            return { data };
        } catch (error) {}
    }
);

const initialState = {
    listing: {
        loading: true,
        rules: [],
    },
};

const ruleSlice = createSlice({
    name: "rule",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchRules.pending, (state, { payload }) => {
                state.listing.loading = true;
            })
            .addCase(fetchRules.fulfilled, (state, { payload }) => {
                state.listing.loading = false;
                state.listing.rules = payload!.data;
            });
    },
});

export const ruleState = (state: RootState) => state.rule;
export default ruleSlice.reducer;
