import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../axios";

export const fetchAdminUserBookings = createAsyncThunk(
    "booking/fetchAdminUserBookings",
    async (
        {
            page = 1,
            query = "",
            bookingDateMonth = "",
            bookingDateYear = "",
            isComplete = "APPROVED,PENDING,CANCELLED",
        },
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            let fetchUrl = `/admin/bookings/${page}?query=${query}&booking_date_month=${bookingDateMonth}&booking_date_year=${bookingDateYear}&is_complete=${isComplete}`;

            const {
                data: { bookings, totalElements, totalPages },
            } = await api.get(fetchUrl);

            return { bookings, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const fetchBookingsCount = createAsyncThunk(
    "booking/fetchBookingsCount",
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: { numberOfAllBookings, numberOfApproved, numberOfPending, numberOfCancelled },
            } = await api.get(`/admin/bookings/count`);

            return { numberOfAllBookings, numberOfApproved, numberOfPending, numberOfCancelled };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const fetchBookingsCountByMonthAndYear = createAsyncThunk(
    "booking/fetchBookingsCountByMonthAndYear",
    async (year, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: { numberOfApproved, numberOfPending, numberOfCancelled },
            } = await api.get(`/admin/bookings/countByMonth?year=${year}`);

            return { numberOfApproved, numberOfPending, numberOfCancelled };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const getBookingsRevenueByYear = createAsyncThunk(
    "booking/getBookingsRevenueByYear",
    async (year, { rejectWithValue }) => {
        try {
            const {
                data: { revenue, refund },
            } = await api.get(`/admin/bookings/getRevenueByYear?year=${year}`);

            return { revenue, refund };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const makeReview = createAsyncThunk(
    "booking/makeReview",
    async (
        {
            bookingId,
            cleanlinessRating,
            contactRating,
            checkinRating,
            accuracyRating,
            locationRating,
            valueRating,
            ratingComment,
        },
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const data = await api.post(`/booking/${bookingId}/create-review`, {
                cleanlinessRating,
                contactRating,
                checkinRating,
                accuracyRating,
                locationRating,
                valueRating,
                ratingComment,
            });
            return { data };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

export const cancelUserBooking = createAsyncThunk(
    "booking/cancelUserBooking",
    async (bookingId, { dispatch, getState, rejectWithValue }) => {
        try {
            const data = await api.put(`/booking/${bookingId}/user/canceled`);

            if (data) dispatch(setCancelledBooking(bookingId));

            return { data };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

export const createBooking = createAsyncThunk(
    "booking/createBooking",
    async (
        { roomid, checkinDate, checkoutDate, numberOfDays, clientMessage },
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const { data } = await api.get(
                `/booking/${roomid}/create?checkin=${checkinDate}&checkout=${checkoutDate}&numberOfDays=${numberOfDays}&clientMessage=${clientMessage}`
            );

            return { data };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

export const getStripeClientSecret = createAsyncThunk(
    "booking/getStripeClientSecret",
    async (fetchPayload, { dispatch, getState, rejectWithValue }) => {
        try {
            const data = await api.post(`/create-payment-intent`, fetchPayload);
            return { data };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

export const cancelBooking = createAsyncThunk(
    "booking/cancelBooking",
    async ({ bookingid }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.put(`/booking/${bookingid}/host/canceled`);

            return { data };
        } catch ({ data: { error } }) {
            rejectWithValue(error);
        }
    }
);

export const approveBooking = createAsyncThunk(
    "booking/approveBooking",
    async ({ bookingid }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.put(`/booking/${bookingid}/approved`);
            return { data };
        } catch ({ data: { error } }) {
            rejectWithValue(error);
        }
    }
);

const initialState = {
    bookingsOfCurrentUserRooms: [],
    totalElements: 0,
    loading: true,
    clientSecret: "",
    newlyCreatedBooking: null,
    cancelMessage: "",
    totalPages: 0,
    createReviewSuccess: false,
    listing: {
        bookings: [],
        loading: true,
        totalPages: 0,
        totalElements: 0,
    },
    approveBookingAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    cancelBookingAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    countBookingAction: {
        numberOfApproved: 0,
        numberOfPending: 0,
        numberOfCancelled: 0,
        numberOfAllBookings: 0,
    },
    fetchBookingsCountByMonthAndYearAction: {
        loading: true,
        numberOfApproved: [],
        numberOfPending: [],
        numberOfCancelled: [],
    },
    getBookingsRevenueByYearAction: {
        loading: true,
        revenue: [],
        refund: [],
    },
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setCancelledBooking: (state, { payload }) => {
            state.cancelledBookingId = payload;
        },
        clearApproveAndDenyState(state) {
            state.approveBookingAction.successMessage = null;
            state.approveBookingAction.errorMessage = null;
            state.cancelBookingAction.successMessage = null;
            state.cancelBookingAction.errorMessage = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAdminUserBookings.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.listing.bookings = payload.bookings;
                state.listing.totalElements = payload.totalElements;
                state.listing.totalPages = payload.totalPages;
            })
            .addCase(fetchBookingsCount.fulfilled, (state, { payload }) => {
                state.countBookingAction.numberOfApproved = payload.numberOfApproved;
                state.countBookingAction.numberOfPending = payload.numberOfPending;
                state.countBookingAction.numberOfCancelled = payload.numberOfCancelled;
                state.countBookingAction.numberOfAllBookings = payload.numberOfAllBookings;
            })
            .addCase(getStripeClientSecret.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.clientSecret = payload.data.clientSecret;
            })
            .addCase(createBooking.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.newlyCreatedBooking = payload;
            })
            .addCase(cancelBooking.pending, (state, { payload }) => {
                state.cancelBookingAction.loading = true;
                state.cancelBookingAction.successMessage = null;
                state.cancelBookingAction.errorMessage = null;
            })
            .addCase(cancelBooking.fulfilled, (state, { payload }) => {
                state.cancelBookingAction.loading = true;
                state.cancelBookingAction.successMessage = payload?.data;
            })
            .addCase(cancelBooking.rejected, (state, { payload }) => {
                state.cancelBookingAction.loading = true;
                state.cancelBookingAction.errorMessage = payload?.data;
            })
            .addCase(approveBooking.pending, (state, { payload }) => {
                state.approveBookingAction.loading = true;
                state.approveBookingAction.successMessage = null;
                state.approveBookingAction.errorMessage = null;
            })
            .addCase(approveBooking.fulfilled, (state, { payload }) => {
                state.approveBookingAction.loading = false;
                state.approveBookingAction.successMessage = payload?.data;
            })
            .addCase(approveBooking.rejected, (state, { payload }) => {
                state.approveBookingAction.loading = false;
                state.approveBookingAction.errorMessage = payload?.data;
            })
            .addCase(makeReview.fulfilled, (state, { payload }) => {
                state.createReviewSuccess = true;
            })
            .addCase(cancelUserBooking.fulfilled, (state, { payload }) => {
                state.cancelBookingSuccess = true;
            })
            .addCase(fetchBookingsCountByMonthAndYear.pending, (state, { payload }) => {
                state.fetchBookingsCountByMonthAndYearAction.loading = true;
                state.fetchBookingsCountByMonthAndYearAction.numberOfApproved = [];
                state.fetchBookingsCountByMonthAndYearAction.numberOfPending = [];
                state.fetchBookingsCountByMonthAndYearAction.numberOfCancelled = [];
            })
            .addCase(fetchBookingsCountByMonthAndYear.fulfilled, (state, { payload }) => {
                state.fetchBookingsCountByMonthAndYearAction.loading = false;
                state.fetchBookingsCountByMonthAndYearAction.numberOfApproved =
                    payload.numberOfApproved;
                state.fetchBookingsCountByMonthAndYearAction.numberOfPending =
                    payload.numberOfPending;
                state.fetchBookingsCountByMonthAndYearAction.numberOfCancelled =
                    payload.numberOfCancelled;
            })
            .addCase(getBookingsRevenueByYear.pending, (state, { payload }) => {
                state.getBookingsRevenueByYearAction.loading = true;
                state.getBookingsRevenueByYearAction.revenue = [];
                state.getBookingsRevenueByYearAction.refund = [];
            })
            .addCase(getBookingsRevenueByYear.fulfilled, (state, { payload }) => {
                state.getBookingsRevenueByYearAction.loading = false;
                state.getBookingsRevenueByYearAction.revenue = payload.revenue;
                state.getBookingsRevenueByYearAction.refund = payload.refund;
            });
    },
});

export const { setCancelledBooking, clearApproveAndDenyState } = bookingSlice.actions;
export const bookingState = state => state.booking;
export default bookingSlice.reducer;
