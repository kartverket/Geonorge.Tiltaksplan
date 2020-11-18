import { FETCH_MEASURES, FETCH_MEASURE, CREATE_MEASURE,  } from 'constants/types';
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

export const createMeasure = (data) => async (dispatch) => {
  const apiUrl = apiUrls.measure.create;
  const response = await axios.post(apiUrl, data);

  dispatch({ type: CREATE_MEASURE, payload: response.data });
}
