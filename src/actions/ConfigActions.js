import { UPDATE_CONFIG } from 'constants/types';

export const updateConfig = (config) => dispatch => {
  dispatch({ type: UPDATE_CONFIG, payload: config });
}