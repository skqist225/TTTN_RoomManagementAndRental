import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axios";

export const fetchRooms = createAsyncThunk(
    "room/fetchRooms",
    async (
        { page = 1, query = "", price = 0, roomStatus = "0,1" },
        { dispatch, getState, rejectWithValue }
    ) => {
        try {
            const {
                data: { rooms, totalRecords, totalPages },
            } = await api.get(
                `/admin/rooms?page=${page}&query=${query}&price=${price}&roomStatus=${roomStatus}`
            );

            return { rooms, totalRecords, totalPages };
        } catch (error) {}
    }
);

export const fetchRoomById = createAsyncThunk(
    "room/fetchRoomById",
    async ({ roomid }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/room/${roomid}`);

            return { data };
        } catch (error) {}
    }
);

export const addRoom = createAsyncThunk(
    "room/addRoom",
    async (formData, { dispatch, getState, rejectWithValue }) => {
        try {
            const data = await api.post(`/admin/room/save`, formData);

            if (data) localStorage.removeItem("roomAdmin");

            return { data };
        } catch (error) {}
    }
);

export const updateRoom = createAsyncThunk(
    "room/updateRoom",
    async ({ formData, roomId }, { dispatch, getState, rejectWithValue }) => {
        try {
            const data = await api.post(`/admin/room/${roomId}/save`, formData);

            if (data) localStorage.removeItem("room");

            return { data };
        } catch (error) {}
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
    addRoomAction: {
        loading: false,
        successMessage: null,
        errorMessage: null,
    },
    updateRoomAction: {
        loading: false,
        successMessage: null,
        errorMessage: null,
    },
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
        clearEditState: (state, { payload }) => {
            state.updateRoomAction.loading = true;
            state.updateRoomAction.successMessage = null;
            state.updateRoomAction.errorMessage = null;
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
            .addCase(addRoom.pending, (state, { payload }) => {
                state.addRoomAction.loading = true;
                state.addRoomAction.successMessage = null;
                state.addRoomAction.errorMessage = null;
            })
            .addCase(addRoom.fulfilled, (state, { payload }) => {
                state.addRoomAction.loading = false;
                if (payload.data) {
                    state.addRoomAction.successMessage = "Add Room Successfully";
                }
            })
            .addCase(updateRoom.pending, (state, { payload }) => {
                state.updateRoomAction.loading = true;
                state.updateRoomAction.successMessage = null;
                state.updateRoomAction.errorMessage = null;
            })
            .addCase(updateRoom.fulfilled, (state, { payload }) => {
                state.updateRoomAction.loading = false;
                if (payload.data) {
                    state.updateRoomAction.successMessage = "Update Room Successfully";
                }
            })
            .addCase(updateRoom.rejected, (state, { payload }) => {
                state.updateRoomAction.loading = false;
                state.updateRoomAction.errorMessage = payload;
            });
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

export const { clearEditState } = roomSlice.actions;

export const roomState = state => state.room;
export default roomSlice.reducer;
