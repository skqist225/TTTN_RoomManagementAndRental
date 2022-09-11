import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";

export const fetchCategories = createAsyncThunk(
    "category/fetchCategories",
    async (page, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/categories`);
            return { data };
        } catch (error) {}
    }
);

export const fetchCategory = createAsyncThunk(
    "category/fetchCategory",
    async (categoryId, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/categories/${categoryId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addCategory = createAsyncThunk(
    "category/addCategory",
    async (category, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.post(`/admin/categories/save`, category, {
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

export const updateCategory = createAsyncThunk(
    "category/updateCategory",
    async (category, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.post(`/admin/categories/save`, category, {
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

export const deleteCategory = createAsyncThunk(
    "rule/deleteCategory",
    async (ruleId, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/admin/categories/${ruleId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    listing: {
        loading: true,
        categories: [],
        totalElements: 0,
    },
    addCategoryAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    deleteCategoryAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    updateCategoryAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    fetchCategoryAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
        category: null,
    },
};

const roomSlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        clearDeleteActionState(state) {
            state.deleteCategoryAction.successMessage = null;
            state.deleteCategoryAction.errorMessage = null;
        },
    },
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
            })
            .addCase(fetchCategory.fulfilled, (state, { payload }) => {
                state.fetchCategoryAction.loading = false;
                state.fetchCategoryAction.category = payload.data;
            })
            .addCase(addCategory.pending, (state, { payload }) => {
                state.addCategoryAction.loading = true;
                state.addCategoryAction.successMessage = null;
                state.addCategoryAction.errorMessage = null;
            })
            .addCase(addCategory.fulfilled, (state, { payload }) => {
                state.addCategoryAction.loading = false;
                if (payload.data) {
                    state.addCategoryAction.successMessage = "Add category Successfully";
                }
            })
            .addCase(addCategory.rejected, (state, { payload }) => {
                state.addCategoryAction.loading = false;
                state.addCategoryAction.errorMessage = payload;
            })
            .addCase(updateCategory.pending, (state, { payload }) => {
                state.updateCategoryAction.loading = true;
                state.updateCategoryAction.successMessage = null;
                state.updateCategoryAction.errorMessage = null;
            })
            .addCase(updateCategory.fulfilled, (state, { payload }) => {
                state.updateCategoryAction.loading = false;
                if (payload.data) {
                    state.updateCategoryAction.successMessage = "Update category Successfully";
                }
            })
            .addCase(updateCategory.rejected, (state, { payload }) => {
                state.updateCategoryAction.loading = false;
                state.updateCategoryAction.errorMessage = payload;
            })
            .addCase(deleteCategory.pending, (state, { payload }) => {
                state.deleteCategoryAction.loading = true;
                state.deleteCategoryAction.successMessage = null;
                state.deleteCategoryAction.errorMessage = null;
            })
            .addCase(deleteCategory.fulfilled, (state, { payload }) => {
                state.deleteCategoryAction.loading = false;
                state.deleteCategoryAction.successMessage = payload?.data;
            })
            .addCase(deleteCategory.rejected, (state, { payload }) => {
                state.deleteCategoryAction.loading = false;
                state.deleteCategoryAction.errorMessage = payload;
            });
    },
});

export const { clearDeleteActionState } = roomSlice.actions;
export const categoryState = state => state.category;
export default roomSlice.reducer;
