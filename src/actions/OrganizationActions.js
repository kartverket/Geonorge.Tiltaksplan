import { FETCH_ORGANIZATIONS } from 'constants/types';
import { apiUrls } from 'components/config';

export const fetchOrganizations = () => (dispatch) => {
  const apiUrl = apiUrls.organizations.getAll;

  return fetch(apiUrl).then(res => res.json()).then(organizations => {
    dispatch({ type: FETCH_ORGANIZATIONS, payload: organizations })
  });
}
