import { FETCH_MEASURES, FETCH_MEASURE, CREATE_MEASURE, UPDATE_MEASURE } from 'constants/types';
import { apiUrls } from 'components/config';
import axios from 'axios';

export const fetchMeasures = () => async (dispatch) => {
   const apiUrl = apiUrls.measure.getAll;
   const response = await axios.get(apiUrl);

   dispatch({ type: FETCH_MEASURES, payload: response.data });
}

export const fetchMeasure = measureId => async (dispatch) => {
   const apiUrl = apiUrls.measure.get.format({ id: measureId })
   const response = await axios.get(apiUrl);

   dispatch({ type: FETCH_MEASURE, payload: response.data })
}

export const createMeasure = (measure) => async (dispatch) => {
   const apiUrl = apiUrls.measure.create;
   const response = await axios.post(apiUrl, measure);

   dispatch({ type: CREATE_MEASURE, payload: response.data });
}

export const updateMeasure = (measure) => async (dispatch) => {
   const apiUrl = apiUrls.measure.update.format({ id: measure.id });
   const response = await axios.put(apiUrl, measure);

   dispatch({ type: UPDATE_MEASURE, payload: response.data });
}

export const deleteMeasure = (measureId) => async (dispatch) => {
   const apiUrl = apiUrls.measure.delete.format({ id: measureId });
   const response = await axios.delete(apiUrl);

   dispatch({ type: UPDATE_MEASURE, payload: response.data });
}
