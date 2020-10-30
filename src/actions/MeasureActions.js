import { FETCH_MEASURES, FETCH_SELECTED_MEASURE } from 'constants/types';

export const fetchMeasures = () => (dispatch) => {
  const apiUrl = `/data/measures.json`;
  return fetch(apiUrl).then(res => res.json()).then(measures => {
    dispatch({ type: FETCH_MEASURES, payload: measures })
  });
}

export const fetchSelectedMeasure = measureId => dispatch => {
  const apiUrl = `/data/measures/${measureId}.json`;
  return fetch(apiUrl).then(res => res.json()).then(measure => {
    dispatch({ type: FETCH_SELECTED_MEASURE, payload: measure })
  });
}
