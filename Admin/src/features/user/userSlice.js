import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";
import { setUserToLocalStorage } from "../common";

export const fetchUsers = createAsyncThunk(
    "user/fetchUsers",
    async (page, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: { users, totalElements, totalPages },
            } = await api.get(`/admin/users?page=${page}`);

            return { users, totalElements, totalPages };
        } catch (error) {}
    }
);

export const fetchUser = createAsyncThunk(
    "user/fetchUser",
    async (id, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/users/${id}`);

            return { data };
        } catch (error) {}
    }
);

export const addUser = createAsyncThunk(
    "user/addUser",
    async (user, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await api.post("/auth/register", user);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const deleteUser = createAsyncThunk(
    "user/deleteUser",
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/admin/users/${id}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const updateUser = createAsyncThunk(
    "user/updateUser",
    async ({ id, formData }, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await api.put(`/admin/users/${id}/update`, formData, {
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

export const fetchWishlistsIDsOfCurrentUser = createAsyncThunk(
    "user/fetchWishlistsIDsOfCurrentUser",
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/user/wishlists/ids`);
            return { data };
        } catch (error) {}
    }
);

export const fetchWishlistsOfCurrentUser = createAsyncThunk(
    "user/fetchWishlistsOfCurrentUser",
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/user/wishlists`);
            return { data };
        } catch (error) {}
    }
);

export const fetchBookedRooms = createAsyncThunk(
    "user/fetchBookedRooms",
    async ({ query }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/user/booked-rooms?query=${query}`);

            return { data };
        } catch (error) {}
    }
);

const initialState = {
    user: null,
    loading: true,
    wishlistsIDsFetching: true,
    errorMessage: null,
    successMessage: "",
    update: {
        loading: true,
        errorMessage: null,
        successMessage: null,
    },
    wishlistsIDs: [],
    wishlists: [],
    bookedRooms: [],
    listing: {
        users: [],
        loading: true,
        totalElements: 0,
        totalPages: 0,
    },
    get: {
        loading: true,
        user: {},
    },
    addUserAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    deleteUserAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    updateUserAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, { payload }) => {
            state.user = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchUsers.fulfilled, (state, { payload }) => {
                state.listing.loading = false;
                state.listing.users = payload.users;
                state.listing.totalElements = payload.totalElements;
                state.listing.totalPages = payload.totalPages;
            })
            .addCase(fetchUser.fulfilled, (state, { payload }) => {
                state.get.loading = false;
                state.get.user = payload.data;
            })
            .addCase(addUser.pending, (state, { payload }) => {
                state.updateUserAction.loading = true;
                state.addUserAction.successMessage = null;
                state.addUserAction.errorMessage = null;
            })
            .addCase(addUser.fulfilled, (state, { payload }) => {
                state.updateUserAction.loading = false;
                if (payload.data) {
                    state.addUserAction.successMessage = "Add User Successfully";
                }
            })
            .addCase(deleteUser.pending, (state, { payload }) => {
                state.deleteUserAction.loading = true;
                state.deleteUserAction.successMessage = null;
                state.deleteUserAction.errorMessage = null;
            })
            .addCase(deleteUser.fulfilled, (state, { payload }) => {
                state.deleteUserAction.loading = false;
                if (payload.data) {
                    state.deleteUserAction.successMessage = "Delete User Successfully";
                }
            })
            .addCase(deleteUser.rejected, (state, { payload }) => {
                state.deleteUserAction.loading = false;
                state.deleteUserAction.errorMessage = payload;
            })
            .addCase(addUser.rejected, (state, { payload }) => {
                state.updateUserAction.loading = false;
                state.addUserAction.errorMessage = payload;
            })
            .addCase(updateUser.pending, (state, { payload }) => {
                state.updateUserAction.loading = true;
                state.updateUserAction.successMessage = null;
                state.updateUserAction.errorMessage = null;
            })
            .addCase(updateUser.fulfilled, (state, { payload }) => {
                state.updateUserAction.loading = false;
                if (payload.data) {
                    state.updateUserAction.successMessage = "Update User Successfully";
                }
            })
            .addCase(updateUser.rejected, (state, { payload }) => {
                state.updateUserAction.loading = false;
                state.updateUserAction.errorMessage = payload;
            })
            .addCase(fetchWishlistsIDsOfCurrentUser.pending, (state, { payload }) => {
                state.wishlistsIDsFetching = true;
            })
            .addCase(fetchWishlistsIDsOfCurrentUser.fulfilled, (state, { payload }) => {
                state.wishlistsIDsFetching = false;
                state.wishlistsIDs = payload?.data;
            })
            .addCase(fetchWishlistsOfCurrentUser.fulfilled, (state, { payload }) => {
                state.wishlists = payload?.data;
            })
            .addCase(fetchWishlistsOfCurrentUser.pending, (state, _) => {
                state.wishlistsIDsFetching = true;
            })
            .addCase(fetchBookedRooms.fulfilled, (state, { payload }) => {
                state.bookedRooms = payload?.data;
            })
            .addMatcher(isAnyOf(fetchWishlistsOfCurrentUser.rejected), (state, { payload }) => {
                state.loading = false;
                if (payload) state.errorMessage = payload;
            });
    },
});

export const { setUser } = userSlice.actions;
export const userState = state => state.user;
export default userSlice.reducer;
