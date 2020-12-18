// Dependencies
import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import { reducer as oidcReducer } from 'redux-oidc';

// Reducers
import AuthInfoReducer from 'reducers/AuthInfoReducer';
import ConfigReducer from 'reducers/ConfigReducer';
import MeasuresReducer from 'reducers/MeasuresReducer';
import ActivitiesReducer from 'reducers/ActivitiesReducer';
import OptionsReducer from 'reducers/OptionsReducer';
import OrganizationsReducer from 'reducers/OrganizationsReducer';
import { reducer as toastrReducer } from 'react-redux-toastr'

const reducers = history => combineReducers({
  router: connectRouter(history),
  oidc: oidcReducer,
  authInfo: AuthInfoReducer,
  config: ConfigReducer,
  measures: MeasuresReducer,
  activities: ActivitiesReducer,
  organizations: OrganizationsReducer,
  options: OptionsReducer,
  toastr: toastrReducer
});

export default reducers
