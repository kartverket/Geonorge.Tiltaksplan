import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { measureAPI } from './measureAPI'

const fetchMeasureById = createAsyncThunk(
  'measure/fetchById',

  async (id, _) => {
    const response = await measureAPI.fetchById(id)
    return response.data
  }
);

const fetchMeasures = createAsyncThunk(
  'measure/fetchAll',

  async (_) => {
    const response = await measureAPI.fetchAll()
    return response.data
  }
);

const measuresSlice = createSlice({
  name: 'measures',
  initialState: { 
    measures: [], 
    loading: 'idle' 
  },
  reducers: {
    [fetchMeasures]: (state, action) => {
      state.measures.push(action.payload)
    },
    [fetchMeasureById]: (state, action) => {
      state.measures.push(action.payload)
    }
  }
});

const ert = measuresSlice.actions;
debugger


export default measuresSlice.reducer