import { CREATE_ACTIVITY, DELETE_ACTIVITY } from 'constants/types';
import { apiUrls } from 'components/config';
import axios from 'axios';

export const createActivity = (activity) => async (dispatch) => {
  const apiUrl = apiUrls.activity.create;
  const response = await axios.post(apiUrl, activity);

  dispatch({ type: CREATE_ACTIVITY, payload: response.data });
}

export const deleteActivity = (activity) => async (dispatch) => {
  const apiUrl = apiUrls.activity.delete.format(activity.id);
  const response = await axios.delete(apiUrl, activity);

  dispatch({ type: DELETE_ACTIVITY, payload: response.data });
}
