import { FETCH_MEASURES, FETCH_SELECTED_MEASURE, CREATE_MEASURE, UPDATE_MEASURE, DELETE_MEASURE } from 'constants/types';
import { apiUrls } from 'components/config';
import appApi from 'config/appApi';

export const fetchMeasures = () => async (dispatch) => {
   const apiUrl = apiUrls.measure.getAll;
   const response = await appApi().get(apiUrl);
   dispatch({ type: FETCH_MEASURES, payload: response.data });
}

export const fetchMeasure = (measureId) => async (dispatch) => {
   const apiUrl = apiUrls.measure.get.format({ id: measureId })
   const response = await appApi().get(apiUrl);

   dispatch({ type: FETCH_SELECTED_MEASURE, payload: response.data })
}

export const createMeasure = (measure, user) => async (dispatch) => {
   const apiUrl = apiUrls.measure.create;
   const response = await appApi(user).post(apiUrl, measure);

   dispatch({ type: CREATE_MEASURE, payload: response.data });
}

export const updateMeasure = (measure, user) => async (dispatch) => {
   const apiUrl = apiUrls.measure.update.format({ id: measure.id });
   const response = await appApi(user).put(apiUrl, measure);

   dispatch({ type: UPDATE_MEASURE, payload: response.data });
}

export const deleteMeasure = (measure, user) => async (dispatch) => {
   const apiUrl = apiUrls.measure.delete.format({ id: measure.id });
   const response = await appApi(user).delete(apiUrl);

   dispatch({ type: DELETE_MEASURE, payload: response.data });
}
