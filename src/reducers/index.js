// Dependencies
import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

// Reducers
import CommitsReducer from 'reducers/CommitsReducer';
import MeasuresReducer from 'reducers/MeasuresReducer';

export default(history) => combineReducers({
  router: connectRouter(history),
  commits: CommitsReducer,
  measures: MeasuresReducer
});
