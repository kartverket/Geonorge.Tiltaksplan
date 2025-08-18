// Dependencies
import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

// Reducers
import AuthInfoReducer from 'reducers/AuthInfoReducer';
import ConfigReducer from 'reducers/ConfigReducer';
import MeasuresReducer from 'reducers/MeasuresReducer';
import ActivitiesReducer from 'reducers/ActivitiesReducer';
import OptionsReducer from 'reducers/OptionsReducer';
import OrganizationsReducer from 'reducers/OrganizationsReducer';
import SelectedLanguageReducer from 'reducers/SelectedLanguageReducer';
import { reducer as toastrReducer } from 'react-redux-toastr'

// Add your own authentication reducer
import authReducer from 'reducers/authReducer';

const reducers = history => combineReducers({
  router: connectRouter(history),
  auth: authReducer, // Add your own auth reducer
  authInfo: AuthInfoReducer,
  config: ConfigReducer,
  measures: MeasuresReducer,
  activities: ActivitiesReducer,
  organizations: OrganizationsReducer,
  options: OptionsReducer,
  selectedLanguage: SelectedLanguageReducer,
  toastr: toastrReducer
});

export default reducers
