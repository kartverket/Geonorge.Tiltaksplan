import { FETCH_OPTIONS } from 'constants/types';
import { apiUrls } from 'components/config';
import axios from 'axios';

export const fetchOptions = () => async (dispatch) => {
  const apiUrl = apiUrls.options.getAll;
  const response = await axios.get(apiUrl);

  dispatch({ type: FETCH_OPTIONS, payload: response.data });
}