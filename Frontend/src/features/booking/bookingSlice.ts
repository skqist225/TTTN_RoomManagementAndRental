import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";
import { RootState } from "../../store";
import { IBooking, IBookingOrder } from "../../types/booking/type_Booking";

interface IFetchUserBookings {
    page: number;
    query?: string;
    bookingDateMonth?: string;
    bookingDateYear?: string;
    bookingDate?: string;
    isComplete?: string;
    totalFee?: number;
    sortField?: string;
    sortDir?: string;
}

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
        }: IFetchUserBookings,
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            let fetchUrl = `/booking/listings/${page}?query=${query}`;
            const state = getState() as RootState;
            // const { fetchData } = state.booking;

            // if (
            //     (bookingDateMonth && bookingDateYear) ||
            //     (fetchData.bookingDateMonth && fetchData.bookingDateYear)
            // ) {
            //     fetchUrl += `&booking_date_month=${
            //         bookingDateMonth || fetchData.bookingDateMonth
            //     }&booking_date_year=${bookingDateYear || fetchData.bookingDateYear}`;
            //     dispatch(setBookingDateMonth(bookingDateMonth || fetchData.bookingDateMonth));
            //     dispatch(setBookingDateYear(bookingDateYear || fetchData.bookingDateYear));
            // } else if (bookingDateMonth || fetchData.bookingDateMonth) {
            //     fetchUrl += `&booking_date_month=${bookingDateMonth || fetchData.bookingDateMonth}`;
            //     dispatch(setBookingDateMonth(bookingDateMonth || fetchData.bookingDateMonth));
            // } else if (bookingDateYear || fetchData.bookingDateYear) {
            //     fetchUrl += `&booking_date_year=${bookingDateYear || fetchData.bookingDateYear}`;
            //     dispatch(setBookingDateYear(bookingDateYear || fetchData.bookingDateYear));
            // }

            // if (bookingDate || fetchData.bookingDate) {
            //     fetchUrl += `&booking_date=${bookingDate || fetchData.bookingDate}`;
            //     dispatch(setBookingDate(bookingDate || fetchData.bookingDate));
            // }

            // if (isComplete || fetchData.isComplete) {
            //     fetchUrl += `&is_complete=${isComplete || fetchData.isComplete}`;
            //     dispatch(setIsComplete(isComplete || fetchData.isComplete));
            // }

            // if (totalFee || fetchData.bookingDate) {
            //     fetchUrl += `&total_fee=${totalFee || fetchData.totalFee}`;
            //     dispatch(setTotalFee(totalFee || fetchData.totalFee));
            // }

            // dispatch(setQuery(query || fetchData.query));
            // fetchUrl += `&sort_field=${sortField}&sort_dir=${sortDir}`;
            // dispatch(setSortField(sortField || fetchData.sortField));
            // dispatch(setSortDir(sortDir || fetchData.sortDir));

            // console.info(fetchUrl);

            const {
                data: { bookings, totalElements, totalPages },
            } = await api.get(fetchUrl);

            return { bookings, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const fetchUserOrders = createAsyncThunk(
    "booking/fetchUserOrders",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/booking/user/orders`);
            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const fetchUserSelectedOrders = createAsyncThunk(
    "booking/fetchUserSelectedOrders",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/booking/user/orders/selected`);
            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const fetchUserBookedOrders = createAsyncThunk(
    "booking/fetchUserBookedOrders",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/booking/user/orders/booked`);
            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const updateBookingStatus = createAsyncThunk(
    "booking/updateBookingStatus",
    async ({ bookingIds }: { bookingIds: number[] }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                `/booking/updateBookingStatus?bookingIds=${bookingIds.join(",")}`
            );
            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

interface ITransferToPendingBooking {
    id: number;
    clientMessage?: string;
}

export const transferToPendingBooking = createAsyncThunk(
    "booking/transferToPendingBooking",
    async ({ postData }: { postData: ITransferToPendingBooking[] }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/booking/transferToPendingBooking`, { postData });
            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

interface IMakeReview {
    bookingId: number;
    cleanlinessRating: number;
    contactRating: number;
    checkinRating: number;
    accuracyRating: number;
    locationRating: number;
    valueRating: number;
    ratingComment: string;
}

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
        }: IMakeReview,
        { rejectWithValue }
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
    async (bookingId: number, { dispatch, rejectWithValue }) => {
        try {
            const data = await api.put(`/booking/${bookingId}/user/canceled`);

            if (data) dispatch(setCancelledBooking(bookingId));

            return { data };
        } catch ({ data: { errorMessage } }) {
            return rejectWithValue(errorMessage);
        }
    }
);

interface ICreateBooking {
    roomId: number;
    checkinDate: string;
    checkoutDate: string;
    numberOfDays: number;
    clientMessage: string;
}

export const createBooking = createAsyncThunk(
    "booking/createBooking",
    async (
        { roomId, checkinDate, checkoutDate, numberOfDays, clientMessage }: ICreateBooking,
        { rejectWithValue }
    ) => {
        try {
            const { data } = await api.get(
                `/booking/${roomId}/create?checkin=${checkinDate}&checkout=${checkoutDate}&numberOfDays=${numberOfDays}&clientMessage=${clientMessage}`
            );

            return { data };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

interface IStripeArgs {
    currency: string;
    price: number;
}

export const getStripeClientSecret = createAsyncThunk(
    "booking/getStripeClientSecret",
    async (fetchPayload: IStripeArgs, { rejectWithValue }) => {
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
    async ({ bookingId }: { bookingId: number }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.put(`/booking/${bookingId}/host/canceled`);
            const state = getState() as RootState;
            const { fetchData } = state.booking;
            // dispatch(fetchUserBookings({ ...fetchData }));

            return { data };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

export const approveBooking = createAsyncThunk(
    "booking/approveBooking",
    async ({ bookingId }: { bookingId: number }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/booking/${bookingId}/approved`);
            return { data };
        } catch ({ data: { errorMessage } }) {
            rejectWithValue(errorMessage);
        }
    }
);

type BookingState = {
    bookings: IBookingOrder[];
    totalElements: number;
    loading: boolean;
    clientSecret: string;
    newlyCreatedBooking: any;
    cancelMessage: string;
    fetchData: IFetchUserBookings;
    totalPages: number;
    createReviewSuccess: boolean;
    cancelledBookingId: number;
    fetchUserOrdersAction: {
        loading: boolean;
        bookings: IBookingOrder[];
    };
    fetchUserSelectedOrdersAction: {
        loading: boolean;
        bookings: IBookingOrder[];
    };
    updateBookingStatusAction: {
        loading: boolean;
        successMessage: string | null;
        errorMessage: string | null;
    };
    fetchUserBookedOrdersAction: {
        loading: boolean;
        bookings: IBookingOrder[];
    };
    cancelBookingAction: {
        loading: boolean;
        successMessage: string | null;
        errorMessage: string | null;
    };
};

const initialState: BookingState = {
    bookings: [],
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
    cancelBookingAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    cancelledBookingId: 0,
    fetchUserOrdersAction: {
        loading: true,
        bookings: [],
    },
    updateBookingStatusAction: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
    fetchUserSelectedOrdersAction: {
        loading: true,
        bookings: [],
    },
    fetchUserBookedOrdersAction: {
        loading: true,
        bookings: [],
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
        clearAllFetchData: state => {
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
            .addCase(fetchUserBookings.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.bookings = payload?.bookings;
                state.totalElements = payload?.totalElements;
                state.totalPages = payload?.totalPages;
            })
            .addCase(getStripeClientSecret.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.clientSecret = (payload!.data as any).clientSecret!;
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
            .addCase(makeReview.fulfilled, state => {
                state.createReviewSuccess = true;
            })
            .addCase(cancelUserBooking.pending, (state, { payload }) => {
                state.cancelBookingAction.loading = false;
                state.cancelBookingAction.errorMessage = null;
                state.cancelBookingAction.successMessage = null;
            })
            .addCase(cancelUserBooking.fulfilled, (state, { payload }) => {
                state.cancelBookingAction.loading = false;
                if (payload.data) {
                    state.cancelBookingAction.successMessage = "Hủy đặt phòng thành công";
                }
            })
            .addCase(cancelUserBooking.rejected, (state, { payload }) => {
                state.cancelBookingAction.loading = false;
                state.cancelBookingAction.errorMessage = payload as string;
            })
            .addCase(fetchUserOrders.pending, state => {
                state.fetchUserOrdersAction.loading = true;
            })
            .addCase(fetchUserOrders.fulfilled, (state, { payload }) => {
                state.fetchUserOrdersAction.loading = false;
                state.fetchUserOrdersAction.bookings = payload.data;
            })
            .addCase(fetchUserSelectedOrders.fulfilled, (state, { payload }) => {
                state.fetchUserSelectedOrdersAction.loading = false;
                state.fetchUserSelectedOrdersAction.bookings = payload.data;
            })
            .addCase(fetchUserBookedOrders.fulfilled, (state, { payload }) => {
                state.fetchUserBookedOrdersAction.loading = false;
                state.fetchUserBookedOrdersAction.bookings = payload.data;
            })
            .addCase(transferToPendingBooking.pending, (state, { payload }) => {
                state.updateBookingStatusAction.loading = false;
                state.updateBookingStatusAction.errorMessage = null;
                state.updateBookingStatusAction.successMessage = null;
            })
            .addCase(transferToPendingBooking.fulfilled, (state, { payload }) => {
                state.updateBookingStatusAction.loading = false;
                state.updateBookingStatusAction.successMessage = payload.data;
            })
            .addCase(updateBookingStatus.pending, (state, { payload }) => {
                state.updateBookingStatusAction.loading = false;
                state.updateBookingStatusAction.errorMessage = null;
                state.updateBookingStatusAction.successMessage = null;
            })
            .addCase(updateBookingStatus.fulfilled, (state, { payload }) => {
                state.updateBookingStatusAction.loading = false;
                state.updateBookingStatusAction.successMessage = payload.data;
            })
            .addCase(updateBookingStatus.rejected, (state, { payload }) => {
                state.updateBookingStatusAction.loading = false;
                state.updateBookingStatusAction.errorMessage = payload as string;
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
export const bookingState = (state: RootState) => state.booking;
export default bookingSlice.reducer;
