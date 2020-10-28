import {FETCH_MEASURES} from 'constants/types';
import jsondata from 'data/measures.json';

export const fetchMeasures = () => (dispatch) => {   
 // const apiUrl = jsondata;
 // let actions = getState().actions;  
 // return fetch(apiUrl).then(res => res.json()).then(newActions => {
  //  actions = newActions;

    dispatch({type: FETCH_MEASURES, payload: jsondata})
  
//  });
}
