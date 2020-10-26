// Dependencies
import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

// Reducers
import CommitsReducer from 'reducers/CommitsReducer';
import ActionsReducer from 'reducers/ActionsReducer';

export default(history) => combineReducers({
  router: connectRouter(history),
  commits: CommitsReducer,
  actions: ActionsReducer
});
