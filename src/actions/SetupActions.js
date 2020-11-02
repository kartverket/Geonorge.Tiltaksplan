import { FETCH_SETUP } from 'constants/types';
import { getEnvironmentVariable } from 'helpers/environmentVariableHelpers';

export const fetchSetup = () => (dispatch) => {
  const apiUrl = getEnvironmentVariable('setupApiUrl');

  return fetch(apiUrl).then(res => res.json()).then(setup => {
    dispatch({ type: FETCH_SETUP, payload: setup })
  });
}