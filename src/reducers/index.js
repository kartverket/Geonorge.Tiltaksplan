// Dependencies
import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

// Reducers
import MeasuresReducer from 'reducers/MeasuresReducer';

export default(history) => combineReducers({
  router: connectRouter(history),
  measures: MeasuresReducer
});
