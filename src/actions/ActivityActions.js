import { CREATE_ACTIVITY, FETCH_SELECTED_ACTIVITY, UPDATE_ACTIVITY, DELETE_ACTIVITY } from 'constants/types';
import { apiUrls } from 'components/config';
import appApi from 'config/appApi';

export const fetchActivity = (measureNumber, activityNumber) => async (dispatch) => {
   const apiUrl = apiUrls.activity.get.format({ measureNumber, number: activityNumber });
   const response = await appApi().get(apiUrl);
 
   dispatch({ type: FETCH_SELECTED_ACTIVITY, payload: response.data })
}

export const createActivity = (activity, user) => async (dispatch) => {
  const apiUrl = apiUrls.activity.create;
  const response = await appApi(user).post(apiUrl, activity);

  dispatch({ type: CREATE_ACTIVITY, payload: response.data });
}

export const updateActivity = (activity, user) => async (dispatch) => {
  const apiUrl = apiUrls.activity.update.format({ id: activity.id })
  const response = await appApi(user).put(apiUrl, activity);

  dispatch({ type: UPDATE_ACTIVITY, payload: response.data });
}

export const deleteActivity = (activity, user) => async (dispatch) => {
  const apiUrl = apiUrls.activity.delete.format({ id: activity.id });  
  const response = await appApi(user).delete(apiUrl, activity);

  dispatch({ type: DELETE_ACTIVITY, payload: response.data });
}
