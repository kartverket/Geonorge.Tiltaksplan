import { FETCH_ORGANIZATIONS } from 'constants/types';
import { apiUrls } from 'components/config';
import axios from 'axios';

export const fetchOrganizations = () => async (dispatch) => {
  const apiUrl = apiUrls.organizations.getAll;
  const response = await axios.get(apiUrl);

  dispatch({ type: FETCH_ORGANIZATIONS, payload: response.data });
}