import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

// Reducers
import MeasureReducer from 'reducers/MeasureReducer';
import MeasuresReducer from 'reducers/MeasuresReducer';
import OptionsReducer from 'reducers/OptionsReducer';
import OrganizationsReducer from 'reducers/OrganizationsReducer';

const reducers = history => combineReducers({
  router: connectRouter(history),
  measure: MeasureReducer,
  measures: MeasuresReducer,
  options: OptionsReducer,
  organizations: OrganizationsReducer
});

export default reducers
