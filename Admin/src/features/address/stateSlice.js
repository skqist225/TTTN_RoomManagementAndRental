import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import api from '../../axios'


export const fetchStates = createAsyncThunk(
  'state/fetchStates',
  async ({ countryId }, { dispatch, getState, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/states`)
      return { data }
    } catch (error) {}
  }
)

export const fetchStatesByCountry = createAsyncThunk(
  'state/fetchStatesByCountry',
  async ({ countryId }, { dispatch, getState, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/states/country/${countryId}`)
      return { data }
    } catch (error) {}
  }
)

const initialState = {
    states: [],
    loading: true,
};

const stateSlice = createSlice({
    name: "state",
    initialState,
    reducers: {},
    extraReducers: builder => {
      builder
        .addCase(fetchStates.pending, state => {
          state.loading = true
        })
        .addCase(fetchStates.fulfilled, (state, { payload }) => {
          state.loading = false
          state.states = payload?.data
        })
        .addCase(fetchStates.rejected, (state, { payload }) => {
          state.loading = false
        })
        .addCase(fetchStatesByCountry.pending, state => {
          state.loading = true
        })
        .addCase(fetchStatesByCountry.fulfilled, (state, { payload }) => {
          state.loading = false
          state.states = payload?.data
        })
        .addMatcher(isAnyOf(fetchStatesByCountry.rejected), (state, { payload }) => {
          state.loading = false
        })
    },
});

export const stateState = state => state.state;
export default stateSlice.reducer;
