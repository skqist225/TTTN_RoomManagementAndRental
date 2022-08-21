import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../axios";
import {RootState} from "../../store";


interface ICreateBooking {
    roomId: number;
    checkinDate: string;
    checkoutDate: string;
}

export const upsertBookingDetail = createAsyncThunk(
    "bookingDetail/upsertBookingDetail",
    async (
        bookingDetail: ICreateBooking,
        {rejectWithValue}
    ) => {
        try {
            const {data} = await api.post(
                `/bookingDetail/create`, bookingDetail
            );

            return {data};
        } catch ({data: {errorMessage}}) {
            rejectWithValue(errorMessage);
        }
    }
);

export const deleteBookingDetail = createAsyncThunk(
        "bookingDetail/deleteBookingDetail",
        async (
            bookingDetailId: { bookingDetailId: number },
            {rejectWithValue}
        ) => {
            try {
                const {data} = await api.delete(
                    `/bookingDetail/${bookingDetailId}/delete`
                );

                return {data};
            } catch ({data: {error}}) {
                return rejectWithValue(error);
            }
        }
    )
;

type BookingDetailState = {
    upsertBookingDetailAction: {
        loading: boolean,
        successMessage: string | null,
        errorMessage: string | null,
    },
    deleteBookingDetailAction: {
        loading: boolean,
        successMessage: string | null,
        errorMessage: string | null,
    }
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
    }
};

const bookingDetailSlice = createSlice({
    name: "bookingDetail",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(upsertBookingDetail.fulfilled, (state, {payload}) => {

            })
            .addCase(deleteBookingDetail.fulfilled, (state, {payload}) => {
                state.deleteBookingDetailAction.loading = false;
                state.deleteBookingDetailAction.successMessage = payload.data;
            })
        ;
    },
});

export const {} = bookingDetailSlice.actions;
export const bookingDetailState = (state: RootState) => state.bookingDetail;
export default bookingDetailSlice.reducer;
