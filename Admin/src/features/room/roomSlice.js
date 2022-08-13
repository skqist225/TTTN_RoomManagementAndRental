import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";

export const fetchRooms = createAsyncThunk(
    "room/fetchRooms",
    async (page,
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const { data: { rooms, totalRecords, totalPages } } = await api.get(
                `/admin/rooms?page=${page}`
            );

            return { rooms, totalRecords, totalPages };
        } catch (error) { }
    }
);

export const fetchRoomById = createAsyncThunk(
    "room/fetchRoomById",
    async ({ roomid }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/room/${roomid}`);

            return { data };
        } catch (error) { }
    }
);

const initialState = {
    rooms: [],
    hosting: {
        rooms: [],
        loading: true,
        totalPages: 0,
        totalRecords: 0,
    },
    room: null,
    loading: true,
    roomPrivacies: [],
    roomGroups: [],
    mockingRoomLoading: true,
    averageRoomPriceByType: 0,
    filterObject: {
        page: 1,
        query: "",
        choosenPrivacy: [],
        minPrice: 0,
        maxPrice: 100000000,
        beds: 0,
        bedRooms: 0,
        bathRooms: 0,
        amenityIDs: "",
        bookingDates: [],
    },
    newlyCreatedRoomId: 0,
    updateSuccess: false,
    photos: [],
};

const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        setMockingRoomLoading: (state, { payload }) => {
            state.mockingRoomLoading = payload;
        },
        setCurrentFilterObject: (state, { payload }) => {
            state.filterObject = payload;
        },
        resetCurretnFilterObject: state => {
            state.filterObject = {
                page: 1,
                query: "",
                choosenPrivacy: [],
                minPrice: 0,
                maxPrice: 100000000,
                beds: 0,
                bedRooms: 0,
                bathRooms: 0,
                amenityIDs: "",
                bookingDates: [],
            };
        },
        resetUpdateStatus: state => {
            state.updateSuccess = false;
        },
        setRoomQuery: (state, { payload }) => {
            state.filterObject.query = payload;
        },
        setRoomInfo: (state, { payload }) => {
            state.filterObject.beds = payload.beds;
            state.filterObject.bedRooms = payload.bedRooms;
            state.filterObject.bathRooms = payload.bathRooms;
        },
        setListingPage: (state, { payload }) => {
            state.filterObject.page = payload;
        },
        setAmenities: (state, { payload }) => {
            state.filterObject.amenityIDs = payload;
        },
        setStatus: (state, { payload }) => {
            state.filterObject.statuses = payload;
        },
        setSortField: (state, { payload }) => {
            state.filterObject.sortField = payload;
        },
        setSortDir: (state, { payload }) => {
            state.filterObject.sortDir = payload;
        },
        setPhotos: (state, { payload }) => {
            state.photos = [...state.photos, payload];
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchRooms.fulfilled, (state, { payload }) => {
                state.hosting.rooms = payload.rooms;
                state.hosting.totalRecords = payload.totalRecords;
                state.hosting.totalPages = payload.totalPages;
            })
            .addCase(fetchRoomById.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.room = payload?.data;
            })
    },
});
export const {
    actions: {
        setMockingRoomLoading,
        setCurrentFilterObject,
        resetCurretnFilterObject,
        resetUpdateStatus,
        setRoomInfo,
        setRoomQuery,
        setListingPage,
        setAmenities,
        setStatus,
        setSortField,
        setSortDir,
        setPhotos,
    },
} = roomSlice;

export const roomState = (state) => state.room;
export default roomSlice.reducer;
