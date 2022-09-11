import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";

export const fetchAmenities = createAsyncThunk(
    "amenity/fetchAmenities",
    async (page, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/amenities`);
            return { data };
        } catch (error) {}
    }
);

export const fetchAmenityCategories = createAsyncThunk(
    "amenity/fetchAmenityCategories",
    async (page, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/amenityCategories`);
            return { data };
        } catch (error) {}
    }
);

export const fetchAmenityCategory = createAsyncThunk(
    "amenity/fetchAmenityCategory",
    async (amenityId, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/amenities/categories/${amenityId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addAmenityCategory = createAsyncThunk(
    "amenity/addAmenityCategory",
    async (amenity, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.post(`/amenities/categories/save`, amenity);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const updateAmenityCategory = createAsyncThunk(
    "amenity/updateAmenityCategory",
    async (amenity, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.post(`/amenities/categories/save`, amenity);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const deleteAmenityCategory = createAsyncThunk(
    "amenity/deleteAmenityCategory",
    async (amenityCategoryId, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/amenities/categories/${amenityCategoryId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const fetchAmenity = createAsyncThunk(
    "amenity/fetchAmenity",
    async (amenityId, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/amenities/${amenityId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addAmenity = createAsyncThunk(
    "amenity/addAmenity",
    async (amenity, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.post(`/amenities/save`, amenity, {
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

export const updateAmenity = createAsyncThunk(
    "amenity/updateAmenity",
    async (amenity, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.post(`/amenities/save`, amenity, {
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

export const deleteAmenity = createAsyncThunk(
    "amenity/deleteAmenity",
    async (amenityId, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/amenities/${amenityId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    listing: {
        loading: false,
        amenities: [],
        totalElements: 0,
    },
    addAmenityAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    deleteAmenityAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    updateAmenityAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    fetchAmenityAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
        amenity: null,
    },
    fetchAmenityCategoriesAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
        amenityCategories: [],
    },
    addAmenityCategoryAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    deleteAmenityCategoryAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    updateAmenityCategoryAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    fetchAmenityCategoryAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
        amenityCategory: null,
    },
};

const amenitylice = createSlice({
    name: "amenity",
    initialState,
    reducers: {
        clearDeleteAmenityActionState(state) {
            state.deleteAmenityAction.successMessage = null;
            state.deleteAmenityAction.errorMessage = null;
        },
        clearDeleteAmenityCategoryActionState(state) {
            state.deleteAmenityCategoryAction.successMessage = null;
            state.deleteAmenityCategoryAction.errorMessage = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAmenities.fulfilled, (state, { payload }) => {
                state.listing.loading = false;
                state.listing.amenities = payload?.data;
                state.listing.totalElements = payload?.data.length;
            })
            .addCase(fetchAmenityCategories.fulfilled, (state, { payload }) => {
                state.fetchAmenityCategoriesAction.loading = false;
                state.fetchAmenityCategoriesAction.amenityCategories = payload.data;
            })
            .addCase(fetchAmenity.fulfilled, (state, { payload }) => {
                state.fetchAmenityAction.loading = false;
                state.fetchAmenityAction.amenity = payload.data;
            })
            .addCase(addAmenity.pending, (state, { payload }) => {
                state.addAmenityAction.loading = true;
                state.addAmenityAction.successMessage = null;
                state.addAmenityAction.errorMessage = null;
            })
            .addCase(addAmenity.fulfilled, (state, { payload }) => {
                state.addAmenityAction.loading = false;
                if (payload.data) {
                    state.addAmenityAction.successMessage = "Add Amenity Successfully";
                }
            })
            .addCase(addAmenity.rejected, (state, { payload }) => {
                state.addAmenityAction.loading = false;
                state.addAmenityAction.errorMessage = payload;
            })
            .addCase(updateAmenity.pending, (state, { payload }) => {
                state.updateAmenityAction.loading = true;
                state.updateAmenityAction.successMessage = null;
                state.updateAmenityAction.errorMessage = null;
            })
            .addCase(updateAmenity.fulfilled, (state, { payload }) => {
                state.updateAmenityAction.loading = false;
                if (payload.data) {
                    state.updateAmenityAction.successMessage = "Update Amenity Successfully";
                }
            })
            .addCase(updateAmenity.rejected, (state, { payload }) => {
                state.updateAmenityAction.loading = false;
                state.updateAmenityAction.errorMessage = payload;
            })
            .addCase(deleteAmenity.pending, (state, { payload }) => {
                state.deleteAmenityAction.loading = true;
                state.deleteAmenityAction.successMessage = null;
                state.deleteAmenityAction.errorMessage = null;
            })
            .addCase(deleteAmenity.fulfilled, (state, { payload }) => {
                state.deleteAmenityAction.loading = false;
                state.deleteAmenityAction.successMessage = payload?.data;
            })
            .addCase(deleteAmenity.rejected, (state, { payload }) => {
                state.deleteAmenityAction.loading = false;
                state.deleteAmenityAction.errorMessage = payload;
            })
            .addCase(addAmenityCategory.pending, (state, { payload }) => {
                state.addAmenityCategoryAction.loading = true;
                state.addAmenityCategoryAction.successMessage = null;
                state.addAmenityCategoryAction.errorMessage = null;
            })
            .addCase(addAmenityCategory.fulfilled, (state, { payload }) => {
                state.addAmenityAction.loading = false;
                if (payload.data) {
                    state.addAmenityAction.successMessage = "Add Amenity Successfully";
                }
            })
            .addCase(addAmenityCategory.rejected, (state, { payload }) => {
                state.addAmenityCategoryAction.loading = false;
                state.addAmenityCategoryAction.errorMessage = payload;
            })
            .addCase(updateAmenityCategory.pending, (state, { payload }) => {
                state.updateAmenityCategoryAction.loading = true;
                state.updateAmenityCategoryAction.successMessage = null;
                state.updateAmenityCategoryAction.errorMessage = null;
            })
            .addCase(updateAmenityCategory.fulfilled, (state, { payload }) => {
                state.updateAmenityCategoryAction.loading = false;
                if (payload.data) {
                    state.updateAmenityCategoryAction.successMessage =
                        "Update Amenity Category Successfully";
                }
            })
            .addCase(updateAmenityCategory.rejected, (state, { payload }) => {
                state.updateAmenityCategoryAction.loading = false;
                state.updateAmenityCategoryAction.errorMessage = payload;
            })
            .addCase(deleteAmenityCategory.pending, (state, { payload }) => {
                state.deleteAmenityCategoryAction.loading = true;
                state.deleteAmenityCategoryAction.successMessage = null;
                state.deleteAmenityCategoryAction.errorMessage = null;
            })
            .addCase(deleteAmenityCategory.fulfilled, (state, { payload }) => {
                state.deleteAmenityCategoryAction.loading = false;
                state.deleteAmenityCategoryAction.successMessage = payload?.data;
            })
            .addCase(deleteAmenityCategory.rejected, (state, { payload }) => {
                state.deleteAmenityCategoryAction.loading = false;
                state.deleteAmenityCategoryAction.errorMessage = payload;
            })
            .addCase(fetchAmenityCategory.fulfilled, (state, { payload }) => {
                state.fetchAmenityCategoryAction.loading = false;
                state.fetchAmenityCategoryAction.amenityCategory = payload.data;
            })
            .addMatcher(isAnyOf(fetchAmenities.pending), state => {
                state.listing.loading = true;
            })
            .addMatcher(isAnyOf(fetchAmenities.rejected), (state, { payload }) => {
                state.listing.loading = false;
            });
    },
});
export const { clearDeleteAmenityActionState, clearDeleteAmenityCategoryActionState } =
    amenitylice.actions;
export const amenityState = state => state.amenity;
export default amenitylice.reducer;
