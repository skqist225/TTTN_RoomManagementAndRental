import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";

export const fetchUserBookings = createAsyncThunk(
    "booking/fetchUserBookings",
    async (
        {
            page,
            query = "",
            bookingDateMonth,
            bookingDateYear,
            bookingDate,
            isComplete,
            totalFee,
            sortField = "bookingDate",
            sortDir = "desc",
        },
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            let fetchUrl = `/booking/listings/${page}?query=${query}`;
            const state = getState();
            const { fetchData } = state.booking;

            if (
                (bookingDateMonth && bookingDateYear) ||
                (fetchData.bookingDateMonth && fetchData.bookingDateYear)
            ) {
                fetchUrl += `&booking_date_month=${
                    bookingDateMonth || fetchData.bookingDateMonth
                }&booking_date_year=${bookingDateYear || fetchData.bookingDateYear}`;
                dispatch(setBookingDateMonth(bookingDateMonth || fetchData.bookingDateMonth));
                dispatch(setBookingDateYear(bookingDateYear || fetchData.bookingDateYear));
            } else if (bookingDateMonth || fetchData.bookingDateMonth) {
                fetchUrl += `&booking_date_month=${bookingDateMonth || fetchData.bookingDateMonth}`;
                dispatch(setBookingDateMonth(bookingDateMonth || fetchData.bookingDateMonth));
            } else if (bookingDateYear || fetchData.bookingDateYear) {
                fetchUrl += `&booking_date_year=${bookingDateYear || fetchData.bookingDateYear}`;
                dispatch(setBookingDateYear(bookingDateYear || fetchData.bookingDateYear));
            }

            if (bookingDate || fetchData.bookingDate) {
                fetchUrl += `&booking_date=${bookingDate || fetchData.bookingDate}`;
                dispatch(setBookingDate(bookingDate || fetchData.bookingDate));
            }

            if (isComplete || fetchData.isComplete) {
                fetchUrl += `&is_complete=${isComplete || fetchData.isComplete}`;
                dispatch(setIsComplete(isComplete || fetchData.isComplete));
            }

            if (totalFee || fetchData.bookingDate) {
                fetchUrl += `&total_fee=${totalFee || fetchData.totalFee}`;
                dispatch(setTotalFee(totalFee || fetchData.totalFee));
            }

            dispatch(setQuery(query || fetchData.query));
            fetchUrl += `&sort_field=${sortField}&sort_dir=${sortDir}`;
            dispatch(setSortField(sortField || fetchData.sortField));
            dispatch(setSortDir(sortDir || fetchData.sortDir));

            console.info(fetchUrl);

            const {
                data: { content, totalElements, totalPages },
            } = await api.get(fetchUrl);

            return { content, totalElements, totalPages };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

export const fetchBookings = createAsyncThunk(
    "booking/fetchBookings",
    async (page, { dispatch, getState, rejectWithValue }) => {
        try {
            const {
                data: { bookings, totalElements, totalPages },
            } = await api.get(`/admin/bookings?page=${page}`);

            return { bookings, totalElements, totalPages };
        } catch (error) {}
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
            const state = getState();
            const { fetchData } = state.booking;
            dispatch(fetchUserBookings({ ...fetchData }));

            return { data };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

export const approveBooking = createAsyncThunk(
    "booking/approveBooking",
    async ({ bookingid }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.put(`/booking/${bookingid}/approved`);
            return { data };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
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
    fetchData: {
        query: "",
        page: 1,
        bookingDateMonth: "",
        bookingDateYear: "",
        isComplete: "0,1,2",
        totalFee: 0,
        sortField: "bookingDate",
        sortDir: "desc",
    },
    totalPages: 0,
    createReviewSuccess: false,
    cancelBookingSuccess: false,
    cancelledBookingId: 0,
    listing: {
        bookings: [],
        loading: true,
        totalPages: 0,
        totalElements: 0,
    },
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setPage: (state, { payload }) => {
            state.fetchData.page = payload;
        },
        setQuery: (state, { payload }) => {
            state.fetchData.query = payload;
        },
        setBookingDateMonth: (state, { payload }) => {
            state.fetchData.bookingDateMonth = payload;
        },
        setBookingDateYear: (state, { payload }) => {
            state.fetchData.bookingDateYear = payload;
        },
        setBookingDate: (state, { payload }) => {
            state.fetchData.bookingDate = payload;
        },
        setIsComplete: (state, { payload }) => {
            state.fetchData.isComplete = payload;
        },
        setTotalFee: (state, { payload }) => {
            state.fetchData.totalFee = payload;
        },
        setSortField: (state, { payload }) => {
            state.fetchData.sortField = payload;
        },
        setSortDir: (state, { payload }) => {
            state.fetchData.sortDir = payload;
        },
        clearAllFetchData: (state, action) => {
            state.fetchData.page = 1;
            state.fetchData.query = "";
            state.fetchData.bookingDate = "";
            state.fetchData.bookingDateMonth = "";
            state.fetchData.bookingDateYear = "";
            state.fetchData.isComplete = "0,1,2";
            state.fetchData.totalFee = 0;
            state.fetchData.sortField = "bookingDate";
            state.fetchData.sortDir = "desc";
        },
        setCancelledBooking: (state, { payload }) => {
            state.cancelledBookingId = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchBookings.fulfilled, (state, { payload }) => {
                state.listing.loading = false;
                state.listing.bookings = payload.bookings;
                state.listing.totalElements = payload.totalElements;
                state.listing.totalPages = payload.totalPages;
            })
            .addCase(fetchUserBookings.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.bookingsOfCurrentUserRooms = payload?.content;
                state.totalElements = payload?.totalElements;
                state.totalPages = payload?.totalPages;
            })
            .addCase(getStripeClientSecret.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.clientSecret = payload.data.clientSecret;
            })
            .addCase(createBooking.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.newlyCreatedBooking = payload;
            })
            .addCase(cancelBooking.fulfilled, (state, { payload }) => {
                state.cancelMessage = payload?.data;
            })
            .addCase(approveBooking.fulfilled, (state, { payload }) => {
                state.cancelMessage = payload?.data;
            })
            .addCase(makeReview.fulfilled, (state, { payload }) => {
                state.createReviewSuccess = true;
            })
            .addCase(cancelUserBooking.fulfilled, (state, { payload }) => {
                state.cancelBookingSuccess = true;
            })
            .addMatcher(isAnyOf(fetchUserBookings.pending), state => {
                state.loading = true;
            })
            .addMatcher(isAnyOf(fetchUserBookings.rejected), (state, { payload }) => {
                state.loading = false;
            });
    },
});

export const {
    setPage,
    setQuery,
    setBookingDateMonth,
    setBookingDateYear,
    setBookingDate,
    setIsComplete,
    setTotalFee,
    setSortField,
    setSortDir,
    clearAllFetchData,
    setCancelledBooking,
} = bookingSlice.actions;
export const bookingState = state => state.booking;
export default bookingSlice.reducer;
