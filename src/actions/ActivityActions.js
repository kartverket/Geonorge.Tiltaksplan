import { apiUrls } from 'components/config';

export const createActivity = (activity) => (dispatch) => {
  const apiUrl = apiUrls.activity.create;
  return fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(activity),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(activity => {
    return activity;
  })

}
export const deleteActivity = (activity) => (dispatch) => {
  const apiUrl = apiUrls.activity.delete;
  return fetch(apiUrl, {
    method: 'post',
    body: JSON.stringify(activity),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(activity => {
    return '';
  })
}
