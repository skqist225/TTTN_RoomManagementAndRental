import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";

export const fetchPrivacies = createAsyncThunk(
    "privacy/fetchPrivacies",
    async (page, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/room-privacy?page=${page}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const fetchPrivacy = createAsyncThunk(
    "privacy/fetchPrivacy",
    async (privacyId, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/room-privacy/${privacyId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addRoomPrivacy = createAsyncThunk(
    "privacy/addRoomPrivacy",
    async (privacy, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.post(`/admin/room-privacy/save`, privacy);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const updatePrivacy = createAsyncThunk(
    "privacy/updatePrivacy",
    async ({ privacyId, updateData }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.put(`/admin/room-privacy/${privacyId}/update`, updateData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const deletePrivacy = createAsyncThunk(
    "privacy/deletePrivacy",
    async (privacyId, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/admin/room-privacy/${privacyId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    listing: {
        loading: true,
        privacies: [],
        totalElements: 0,
    },
    addPrivacyAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    deletePrivacyAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    updatePrivacyAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    fetchPrivacyAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
        privacy: null,
    },
};

const privacySlice = createSlice({
    name: "privacy",
    initialState,
    reducers: {
        clearDeleteActionState(state) {
            state.deletePrivacyAction.successMessage = null;
            state.deletePrivacyAction.errorMessage = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchPrivacies.fulfilled, (state, { payload }) => {
                state.listing.loading = false;
                state.listing.privacies = payload.data;
                state.listing.totalElements = payload.data.length;
            })
            .addCase(fetchPrivacy.fulfilled, (state, { payload }) => {
                state.fetchPrivacyAction.loading = false;
                state.fetchPrivacyAction.privacy = payload.data;
            })
            .addCase(addRoomPrivacy.pending, (state, { payload }) => {
                state.addPrivacyAction.loading = true;
                state.addPrivacyAction.successMessage = null;
                state.addPrivacyAction.errorMessage = null;
            })
            .addCase(addRoomPrivacy.fulfilled, (state, { payload }) => {
                state.addPrivacyAction.loading = false;
                if (payload.data) {
                    state.addPrivacyAction.successMessage = "Add Privacy Successfully";
                }
            })
            .addCase(addRoomPrivacy.rejected, (state, { payload }) => {
                state.addPrivacyAction.loading = false;
                state.addPrivacyAction.errorMessage = payload;
            })
            .addCase(updatePrivacy.pending, (state, { payload }) => {
                state.updatePrivacyAction.loading = true;
                state.updatePrivacyAction.successMessage = null;
                state.updatePrivacyAction.errorMessage = null;
            })
            .addCase(updatePrivacy.fulfilled, (state, { payload }) => {
                state.updatePrivacyAction.loading = false;
                if (payload.data) {
                    state.updatePrivacyAction.successMessage = "Update Privacy Successfully";
                }
            })
            .addCase(updatePrivacy.rejected, (state, { payload }) => {
                state.updatePrivacyAction.loading = false;
                state.updatePrivacyAction.errorMessage = payload;
            })
            .addCase(deletePrivacy.pending, (state, { payload }) => {
                state.deletePrivacyAction.loading = true;
                state.deletePrivacyAction.successMessage = null;
                state.deletePrivacyAction.errorMessage = null;
            })
            .addCase(deletePrivacy.fulfilled, (state, { payload }) => {
                state.deletePrivacyAction.loading = false;
                state.deletePrivacyAction.successMessage = payload?.data;
            })
            .addCase(deletePrivacy.rejected, (state, { payload }) => {
                state.deletePrivacyAction.loading = false;
                console.log(payload);
                console.log(payload.data);
                state.deletePrivacyAction.errorMessage = payload;
            });
    },
});
export const { clearDeleteActionState } = privacySlice.actions;
export const privacyState = state => state.privacy;
export default privacySlice.reducer;
