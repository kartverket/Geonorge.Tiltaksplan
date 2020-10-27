import {FETCH_ACTIONS} from 'constants/types';
import jsondata from 'data/actions.json';

export const fetchActions = () => (dispatch, getState) => {   
 // const apiUrl = jsondata;
 // let actions = getState().actions;  
 // return fetch(apiUrl).then(res => res.json()).then(newActions => {
  //  actions = newActions;

    dispatch({type: FETCH_ACTIONS, payload: jsondata})
  
//  });
}
