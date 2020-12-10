// Dependencies
import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import { reducer as oidcReducer } from 'redux-oidc';

// Reducers
import MeasuresReducer from 'reducers/MeasuresReducer';
import ActivitiesReducer from 'reducers/ActivitiesReducer';
import OptionsReducer from 'reducers/OptionsReducer';
import OrganizationsReducer from 'reducers/OrganizationsReducer';
import { reducer as toastrReducer } from 'react-redux-toastr'

const reducers = history => combineReducers({
  router: connectRouter(history),
  oidc: oidcReducer,
  measures: MeasuresReducer,
  activities: ActivitiesReducer,
  organizations: OrganizationsReducer,
  options: OptionsReducer,
  //setup: SetupReducer
  toastr: toastrReducer
});

export default reducers
