import { CREATE_ACTIVITY, FETCH_SELECTED_ACTIVITY, UPDATE_ACTIVITY, DELETE_ACTIVITY } from 'constants/types';
import { apiUrls } from 'components/config';
import axios from 'axios';

export const createActivity = (activity) => async (dispatch) => {
  const apiUrl = apiUrls.activity.create;
  const response = await axios.post(apiUrl, activity);

  dispatch({ type: CREATE_ACTIVITY, payload: response.data });
}

export const fetchActivity = activityId => async (dispatch) => {
  const apiUrl = apiUrls.activity.get.format({ id: activityId })
  const response = await axios.get(apiUrl);

  dispatch({ type: FETCH_SELECTED_ACTIVITY, payload: response.data })
}

export const updateActivity = (activity, ) => async (dispatch) => {
  const apiUrl = apiUrls.activity.update.format({ id: activity.id })
  const response = await axios.post(apiUrl, activity);

  dispatch({ type: UPDATE_ACTIVITY, payload: response.data });
}

export const deleteActivity = (activity) => async (dispatch) => {
  const apiUrl = apiUrls.activity.delete.format(activity.id);
  const response = await axios.delete(apiUrl, activity);

  dispatch({ type: DELETE_ACTIVITY, payload: response.data });
}
