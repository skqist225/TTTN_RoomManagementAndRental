import {createAsyncThunk, createSlice, isAnyOf} from "@reduxjs/toolkit";
import {RootState} from "../../store";
import IAmenity from "../../types/type_Amenity";
import api from "../../axios";

interface PostUpsertCart {
    bookingDetail: {
        checkin: string;
        checkout: string;
        roomId: number;
    }
}

export const upsertCart = createAsyncThunk(
    "cart/upsertCart",
    async (cartInfo: PostUpsertCart, {dispatch, getState, rejectWithValue}) => {
        try {
            const {data} = await api.post(`/cart/upsert`, cartInfo);
            return {data};
        } catch (error) {
        }
    }
);

type AmenityState = {
    amenities: IAmenity[];
    loading: boolean;
};

const initialState: AmenityState = {
    amenities: [],
    loading: true,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(upsertCart.fulfilled, (state, {payload}) => {
                state.loading = false;
                state.amenities = payload?.data;
            })
            .addMatcher(isAnyOf(upsertCart.pending), state => {
                state.loading = true;
            })
            .addMatcher(isAnyOf(upsertCart.rejected), (state, {payload}) => {
                state.loading = false;
            });
    },
});

export const cartState = (state: RootState) => state.cart;
export default cartSlice.reducer;
