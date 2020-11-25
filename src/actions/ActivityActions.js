import { CREATE_ACTIVITY, UPDATE_ACTIVITY, DELETE_ACTIVITY } from 'constants/types';
import { apiUrls } from 'components/config';
import axios from 'axios';

export const createActivity = (activity) => async (dispatch) => {
  const apiUrl = apiUrls.activity.create;
  const response = await axios.post(apiUrl, activity);

  dispatch({ type: CREATE_ACTIVITY, payload: response.data });
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
