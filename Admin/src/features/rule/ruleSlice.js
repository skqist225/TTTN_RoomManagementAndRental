import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";

export const fetchRules = createAsyncThunk(
    "rule/fetchRules",
    async (page, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/rules`);

            return { data };
        } catch (error) {}
    }
);

export const fetchRule = createAsyncThunk(
    "rule/fetchRule",
    async (ruleId, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/rules/${ruleId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addRule = createAsyncThunk(
    "rule/addRule",
    async (rule, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.post(`/admin/rules/save`, rule, {
                headers: {
                    "Content-Type": "multipart/formData",
                },
            });

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const updateRule = createAsyncThunk(
    "rule/updateRule",
    async (rule, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.post(`/admin/rules/save`, rule, {
                headers: {
                    "Content-Type": "multipart/formData",
                },
            });

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const deleteRule = createAsyncThunk(
    "rule/deleteRule",
    async (ruleId, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/admin/rules/${ruleId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    listing: {
        loading: true,
        rules: [],
        totalElements: 0,
    },
    addRuleAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    deleteRuleAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    updateRuleAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    fetchRuleAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
        rule: null,
    },
};

const ruleSlice = createSlice({
    name: "rule",
    initialState,
    reducers: {
        clearDeleteActionState(state) {
            state.deleteRuleAction.successMessage = null;
            state.deleteRuleAction.errorMessage = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchRules.fulfilled, (state, { payload }) => {
                state.listing.loading = false;
                state.listing.rules = payload.data;
                state.listing.totalElements = payload.data.length;
            })
            .addCase(fetchRule.fulfilled, (state, { payload }) => {
                state.fetchRuleAction.loading = false;
                state.fetchRuleAction.rule = payload.data;
            })
            .addCase(addRule.pending, (state, { payload }) => {
                state.addRuleAction.loading = true;
                state.addRuleAction.successMessage = null;
                state.addRuleAction.errorMessage = null;
            })
            .addCase(addRule.fulfilled, (state, { payload }) => {
                state.addRuleAction.loading = false;
                if (payload.data) {
                    state.addRuleAction.successMessage = "Add Rule Successfully";
                }
            })
            .addCase(addRule.rejected, (state, { payload }) => {
                state.addRuleAction.loading = false;
                state.addRuleAction.errorMessage = payload;
            })
            .addCase(updateRule.pending, (state, { payload }) => {
                state.updateRuleAction.loading = true;
                state.updateRuleAction.successMessage = null;
                state.updateRuleAction.errorMessage = null;
            })
            .addCase(updateRule.fulfilled, (state, { payload }) => {
                state.updateRuleAction.loading = false;
                if (payload.data) {
                    state.updateRuleAction.successMessage = "Update Rule Successfully";
                }
            })
            .addCase(updateRule.rejected, (state, { payload }) => {
                state.updateRuleAction.loading = false;
                state.updateRuleAction.errorMessage = payload;
            })
            .addCase(deleteRule.pending, (state, { payload }) => {
                state.deleteRuleAction.loading = true;
                state.deleteRuleAction.successMessage = null;
                state.deleteRuleAction.errorMessage = null;
            })
            .addCase(deleteRule.fulfilled, (state, { payload }) => {
                state.deleteRuleAction.loading = false;
                state.deleteRuleAction.successMessage = payload?.data;
            })
            .addCase(deleteRule.rejected, (state, { payload }) => {
                state.deleteRuleAction.loading = false;
                state.deleteRuleAction.errorMessage = payload;
            });
    },
});
export const { clearDeleteActionState } = ruleSlice.actions;
export const ruleState = state => state.rule;
export default ruleSlice.reducer;
