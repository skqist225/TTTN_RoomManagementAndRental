import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api, { DataType } from "../../axios";
import { RootState } from "../../store";
import {
    IUser,
    IUserUpdate,
    IBookedRoom,
    RoomWishlists,
    IRatingLabel,
} from "../../types/user/type_User";
import { setUserToLocalStorage } from "../common";

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

export const updateUserInfo = createAsyncThunk(
    "user/updateUserInfo",
    async (updatedInfo: IUserUpdate, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.put(`/user/update-personal-info`, updatedInfo);

            if (data) {
                const lsUser = localStorage.getItem("user");
                if (lsUser) {
                    const { token } = JSON.parse(lsUser);
                    localStorage.removeItem("user");
                    data.token = token;
                    localStorage.setItem("user", JSON.stringify(data as IUser));
                }
            }

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const updateUserPassword = createAsyncThunk(
    "user/updateUserPassword",
    async (updatedInfo: IUserUpdate, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.put(`/user/update-personal-info`, updatedInfo);

            if (data) {
                const lsUser = localStorage.getItem("user");
                if (lsUser) {
                    const { token } = JSON.parse(lsUser);
                    localStorage.removeItem("user");
                    data.token = token;
                    localStorage.setItem("user", JSON.stringify(data as IUser));
                }
            }

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const updateUserAvatar = createAsyncThunk(
    "user/updateUserAvatar",
    async (formData: FormData, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.put(`/user/update-avatar`, formData, {
                headers: {
                    "Content-Type": DataType.MULTIPARTFORMDATA,
                },
            });

            if (data) {
                const lsUser = localStorage.getItem("user");
                if (lsUser) {
                    const { token } = JSON.parse(lsUser);
                    localStorage.removeItem("user");
                    data.token = token;
                    localStorage.setItem("user", JSON.stringify(data as IUser));
                }
            }

            return { data };
        } catch (error) {}
    }
);

export const fetchBookedRooms = createAsyncThunk(
    "user/fetchBookedRooms",
    async ({ query }: { query: string }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/user/booked-rooms?query=${query}`);

            return { data };
        } catch (error) {}
    }
);

type UserState = {
    user: IUser | null;
    loading: boolean;
    wishlistsIDsFetching: boolean;
    errorMessage: string | null;
    successMessage: string | null;
    update: {
        loading: boolean;
        errorMessage: string | null;
        successMessage: string | null;
    };
    updatePassword: {
        loading: boolean;
        errorMessage: string | null;
        successMessage: string | null;
    };
    wishlistsIDs: number[];
    wishlists: RoomWishlists[];
    bookedRooms: IBookedRoom[];
};

const initialState: UserState = {
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
    updatePassword: {
        loading: true,
        errorMessage: null,
        successMessage: null,
    },
    wishlistsIDs: [],
    wishlists: [],
    bookedRooms: [],
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, { payload }) => {
            state.user = payload as IUser;
        },
        clearUSAErrorMessage(state) {
            state.update.errorMessage = null;
        },
    },
    extraReducers: builder => {
        builder

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
            .addCase(updateUserInfo.pending, (state, _) => {
                state.update.loading = true;
                state.update.successMessage = null;
                state.update.errorMessage = null;
            })
            .addCase(updateUserInfo.fulfilled, (state, { payload }) => {
                state.update.loading = false;
                state.user = payload?.data;
                state.update.successMessage = "Update user successfully";
            })
            .addCase(updateUserInfo.rejected, (state, { payload }) => {
                state.update.loading = false;
                state.update.errorMessage = payload as string;
            })
            .addCase(updateUserPassword.pending, (state, _) => {
                state.update.loading = true;
                state.update.successMessage = null;
                state.update.errorMessage = null;
            })
            .addCase(updateUserPassword.fulfilled, (state, { payload }) => {
                state.update.loading = false;
                state.user = payload?.data;
                state.update.successMessage = "Update user successfully";
            })
            .addCase(updateUserPassword.rejected, (state, { payload }) => {
                state.update.loading = false;
                state.update.errorMessage = payload as string;
            })
            .addCase(updateUserAvatar.fulfilled, (state, { payload }) => {
                state.user = payload?.data;
                state.update.loading = false;
            })
            .addMatcher(isAnyOf(fetchWishlistsOfCurrentUser.rejected), (state, { payload }) => {
                state.loading = false;
                if (payload) state.errorMessage = payload as string;
            });
    },
});

export const { setUser, clearUSAErrorMessage } = userSlice.actions;
export const userState = (state: RootState) => state.user;
export default userSlice.reducer;
