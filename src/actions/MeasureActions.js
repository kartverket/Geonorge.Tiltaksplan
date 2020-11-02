import { FETCH_MEASURES, FETCH_SELECTED_MEASURE } from 'constants/types';
import { apiUrls } from 'components/config';

export const fetchMeasures = () => (dispatch) => {
  const apiUrl = apiUrls.measure.getAll;

  return fetch(apiUrl).then(res => res.json()).then(measures => {
    dispatch({ type: FETCH_MEASURES, payload: measures })
  });
}

export const fetchSelectedMeasure = measureId => (dispatch) => {
  const apiUrl = apiUrls.measure.get.format({ id: measureId })

  return fetch(apiUrl).then(res => res.json()).then(measure => {
    dispatch({ type: FETCH_SELECTED_MEASURE, payload: measure })
  });
}
