import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axios";
import { RootState } from "../../store";

interface ICreateBooking {
    roomId: number;
    checkinDate: string;
    checkoutDate: string;
}

export const upsertBookingDetail = createAsyncThunk(
    "bookingDetail/upsertBookingDetail",
    async (bookingDetail: ICreateBooking, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await api.post(`/bookingDetail/create`, bookingDetail);

            if (data) {
                dispatch(getCartNumber());
            }

            return { data };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

export const deleteBookingDetail = createAsyncThunk(
    "bookingDetail/deleteBookingDetail",
    async (bookingDetailId: { bookingDetailId: number }, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/bookingDetail/${bookingDetailId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const getCartNumber = createAsyncThunk(
    "bookingDetail/getCartNumber",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/bookingDetail/numberOfCartBookingDetails`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

type BookingDetailState = {
    upsertBookingDetailAction: {
        loading: boolean;
        successMessage: string | null;
        errorMessage: string | null;
    };
    deleteBookingDetailAction: {
        loading: boolean;
        successMessage: string | null;
        errorMessage: string | null;
    };
    getCartNumberAction: {
        loading: boolean;
        cartNumber: number;
    };
};

const initialState: BookingDetailState = {
    upsertBookingDetailAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    deleteBookingDetailAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    getCartNumberAction: {
        loading: true,
        cartNumber: 0,
    },
};

const bookingDetailSlice = createSlice({
    name: "bookingDetail",
    initialState,
    reducers: {
        clearDeleteBookingDetailAction(state) {
            state.deleteBookingDetailAction.successMessage = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(upsertBookingDetail.fulfilled, (state, { payload }) => {})
            .addCase(deleteBookingDetail.pending, (state, { payload }) => {
                state.deleteBookingDetailAction.loading = true;
                state.deleteBookingDetailAction.successMessage = null;
                state.deleteBookingDetailAction.errorMessage = null;
            })
            .addCase(deleteBookingDetail.fulfilled, (state, { payload }) => {
                state.deleteBookingDetailAction.loading = false;
                state.deleteBookingDetailAction.successMessage = payload.data;
            })
            .addCase(getCartNumber.fulfilled, (state, { payload }) => {
                state.getCartNumberAction.loading = false;
                state.getCartNumberAction.cartNumber = payload.data;
            });
    },
});

export const { clearDeleteBookingDetailAction } = bookingDetailSlice.actions;
export const bookingDetailState = (state: RootState) => state.bookingDetail;
export default bookingDetailSlice.reducer;
