// Types
import { UPDATE_BAAT_INFO } from 'constants/types';
import * as Cookies from 'js-cookie';


export const updateOidcCookie = (user) => dispatch => {
  if (user) {
    const accessToken = user.access_token
      ? user.access_token
      : null;
    const expiresAt = user.expires_at
      ? user.expires_at * 1000
      : null;
    if (accessToken && expiresAt) {
      Cookies.set('oidcAccessToken', accessToken, {expires: new Date(expiresAt)});
    }
  }
};

export const updateBaatInfo = (user, savedBaatInfo) => dispatch => {
  if (user && user.profile && user.profile.sub && !savedBaatInfo) {
    const accessToken = user.access_token
      ? user.access_token
      : null;
    const expiresAt = user.expires_at
      ? user.expires_at * 1000
      : null;
    if (accessToken && expiresAt) {
      const userInfoUrl = `https://baat.geonorge.no/authzapi/0.2/info/${user.profile.sub}`;
      fetch(userInfoUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken
        }
      }).then((res) => res.json()).then((baatInfo) => {
        Cookies.set('baatInfo', baatInfo, { expires: new Date(expiresAt) });
        dispatch({ type: UPDATE_BAAT_INFO, payload: baatInfo });
      });
    }
  }
}