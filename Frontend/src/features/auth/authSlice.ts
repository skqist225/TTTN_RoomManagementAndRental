import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";
import { makeGetAsyncThunk, makePostAsyncThunk } from "../../helpers/create_async_thunk";
import { RootState } from "../../store";
import { IForgotPassword, ILogin, IResetPassword } from "../../types/auth/type_Auth";
import { IRegisterUser, IUser } from "../../types/user/type_User";
import { setUserToLocalStorage } from "../common";
import { setUser } from "../user/userSlice";

export const login = createAsyncThunk(
    "auth/login",
    async (loginInfo: ILogin, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await api.post("/auth/login", loginInfo);
            if (data) {
                setUserToLocalStorage(data);
                dispatch(setUser(data));
            }

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (resetPasswordData: IResetPassword, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/auth/reset-password`, resetPasswordData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (forgotPassword: IForgotPassword, { rejectWithValue }) => {
        try {
            const {
                data: { message, resetPasswordCode, email },
            } = await api.post("/auth/forgot-password", forgotPassword);
            return { message, resetPasswordCode, email };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        return {
            data: {
                success: true,
            },
        };
    } catch ({ data: { error } }) {
        return rejectWithValue(error);
    }
});

export const checkPhoneNumber = createAsyncThunk(
    "auth/checkPhoneNumber",
    async (
        { phoneNumber, edit, userId }: { phoneNumber: number; edit: boolean; userId?: number },
        { rejectWithValue }
    ) => {
        try {
            const { data } = await api.get(`auth/check-phonenumber/${phoneNumber}?edit=${edit}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (user: IRegisterUser, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`auth/register/`, user);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

type AuthState = {
    user: IUser | null;
    loading: boolean;
    errorMessage: string | null;
    successMessage: string | null;
    loginAction: {
        loading: boolean;
        successMessage: string | null;
        errorMessage: string | null;
    };
    checkPhoneNumberAction: {
        loading: boolean;
        successMessage: string | null;
        errorMessage: string | null;
    };
    registerAction: {
        loading: boolean;
        errors: any;
        successMessage: string | null;
    };
    resetPasswordAction: {
        loading: boolean;
        errorMessage: string | null;
        successMessage: string | null;
    };
};

const initialState: AuthState = {
    user: null,
    loading: true,
    errorMessage: null,
    successMessage: "",
    registerAction: {
        loading: true,
        errors: null,
        successMessage: null,
    },
    loginAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    checkPhoneNumberAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    resetPasswordAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, { payload }) => {
            state.user = payload as IUser;
        },
        clearErrorMessage(state, _) {
            state.errorMessage = null;
        },
        clearSuccessMessage(state, _) {
            state.successMessage = null;
        },
        clearLASuccessMessage(state) {
            state.loginAction.successMessage = null;
        },
        clearLAErrorMessage(state) {
            state.loginAction.errorMessage = null;
        },
        clearRASuccessMessage(state) {
            state.registerAction.successMessage = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(registerUser.pending, (state, { payload }) => {
                state.registerAction.loading = true;
                state.registerAction.errors = null;
            })
            .addCase(registerUser.fulfilled, (state, { payload }) => {
                state.registerAction.loading = false;
                if (payload.data) {
                    state.registerAction.successMessage = "Register user successfully";
                }
            })
            .addCase(registerUser.rejected, (state, { payload }) => {
                state.registerAction.loading = false;
                state.registerAction.errors = JSON.parse(payload as any);
            })
            .addCase(login.pending, (state, { payload }) => {
                state.loginAction.loading = true;
                state.loginAction.successMessage = null;
                state.loginAction.errorMessage = null;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.loginAction.loading = false;
                if (payload!.data) {
                    state.loginAction.successMessage = "Login successfully";
                }
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.loginAction.loading = false;
                state.loginAction.errorMessage = payload as string;
            })
            .addCase(
                forgotPassword.fulfilled,
                (state, { payload: { message, resetPasswordCode, email } }) => {
                    state.successMessage = message;
                    localStorage.setItem("email", email);
                    localStorage.setItem("resetPasswordCode", resetPasswordCode);
                }
            )
            .addCase(resetPassword.pending, (state, { payload }) => {
                state.resetPasswordAction.loading = true;
                state.resetPasswordAction.successMessage = null;
                state.resetPasswordAction.errorMessage = null;
            })
            .addCase(resetPassword.fulfilled, (state, { payload }) => {
                state.resetPasswordAction.loading = false;
                state.resetPasswordAction.successMessage = payload.data;
            })
            .addCase(resetPassword.rejected, (state, { payload }) => {
                state.resetPasswordAction.loading = false;
                state.resetPasswordAction.errorMessage = payload as string;
            })
            .addCase(checkPhoneNumber.pending, (state, { payload }) => {
                state.checkPhoneNumberAction.loading = true;
                state.checkPhoneNumberAction.successMessage = null;
                state.checkPhoneNumberAction.errorMessage = null;
            })
            .addCase(checkPhoneNumber.fulfilled, (state, { payload }) => {
                state.checkPhoneNumberAction.loading = false;
                state.checkPhoneNumberAction.successMessage = payload!.data as string;

                localStorage.removeItem("email");
                localStorage.removeItem("resetPasswordCode");
            })
            .addCase(checkPhoneNumber.rejected, (state, { payload }) => {
                state.checkPhoneNumberAction.loading = false;
                state.checkPhoneNumberAction.errorMessage = payload as string;
            })
            .addMatcher(isAnyOf(forgotPassword.pending, resetPassword.pending), (state, _) => {
                state.loading = true;
            })
            .addMatcher(
                isAnyOf(forgotPassword.rejected, checkPhoneNumber.rejected),
                (state, { payload }) => {
                    state.loading = false;
                    if (payload) state.errorMessage = payload as string;
                }
            );
    },
});

export const {
    clearErrorMessage,
    clearSuccessMessage,
    clearLAErrorMessage,
    clearLASuccessMessage,
    clearRASuccessMessage,
} = authSlice.actions;
export const authState = (state: RootState) => state.auth;
export default authSlice.reducer;
