import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../axios";

export const statsCount = createAsyncThunk(
    "dashboard/statsCount",
    async (_, { rejectWithValue }) => {
        try {
            const {
                data: { totalSales, totalBookings, totalRooms, totalUsers },
            } = await api.get(`/admin/dashboard/statsCount`);
            return { totalSales, totalBookings, totalRooms, totalUsers };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const getCreatedRoomByMonthAndYear = createAsyncThunk(
    "dashboard/getCreatedRoomByMonthAndYear",
    async (_, { rejectWithValue }) => {
        try {
            const {
                data: { activeList, deactiveList },
            } = await api.get(`/admin/dashboard/getCreatedRoom`);
            return { activeList, deactiveList };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const countUserByRole = createAsyncThunk(
    "dashboard/countUserByRole",
    async (_, { rejectWithValue }) => {
        try {
            const {
                data: { numberOfUsers, numberOfAdmin, numberOfHost },
            } = await api.get(`/admin/dashboard/countUserByRole`);
            return { numberOfUsers, numberOfAdmin, numberOfHost };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    statsCountAction: {
        loading: true,
        totalSales: 0,
        totalBookings: 0,
        totalRooms: 0,
        totalUsers: 0,
    },
    getCreatedRoomByMonthAndYearAction: {
        loading: true,
        activeList: [],
        deactiveList: [],
    },
    countUserByRoleAction: {
        loading: true,
        numberOfUsers: 0,
        numberOfAdmin: 0,
        numberOfHost: 0,
    },
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(statsCount.pending, state => {
                state.statsCountAction.loading = true;
                state.statsCountAction.totalSales = 0;
                state.statsCountAction.totalBookings = 0;
                state.statsCountAction.totalRooms = 0;
                state.statsCountAction.totalUsers = 0;
            })
            .addCase(statsCount.fulfilled, (state, { payload }) => {
                state.statsCountAction.loading = false;
                state.statsCountAction.totalSales = payload.totalSales;
                state.statsCountAction.totalBookings = payload.totalBookings;
                state.statsCountAction.totalRooms = payload.totalRooms;
                state.statsCountAction.totalUsers = payload.totalUsers;
            })
            .addCase(getCreatedRoomByMonthAndYear.pending, state => {
                state.getCreatedRoomByMonthAndYearAction.loading = true;
                state.getCreatedRoomByMonthAndYearAction.activeList = [];
                state.getCreatedRoomByMonthAndYearAction.deactiveList = [];
            })
            .addCase(getCreatedRoomByMonthAndYear.fulfilled, (state, { payload }) => {
                state.getCreatedRoomByMonthAndYearAction.loading = false;
                state.getCreatedRoomByMonthAndYearAction.activeList = payload.activeList;
                state.getCreatedRoomByMonthAndYearAction.deactiveList = payload.deactiveList;
            })
            .addCase(countUserByRole.pending, state => {
                state.countUserByRoleAction.loading = true;
                state.countUserByRoleAction.numberOfUsers = 0;
                state.countUserByRoleAction.numberOfHost = 0;
                state.countUserByRoleAction.numberOfAdmin = 0;
            })
            .addCase(countUserByRole.fulfilled, (state, { payload }) => {
                state.countUserByRoleAction.loading = false;
                state.countUserByRoleAction.numberOfUsers = payload.numberOfUsers;
                state.countUserByRoleAction.numberOfHost = payload.numberOfHost;
                state.countUserByRoleAction.numberOfAdmin = payload.numberOfAdmin;
            });
    },
});

export const dashboardState = state => state.dashboard;
export default dashboardSlice.reducer;
