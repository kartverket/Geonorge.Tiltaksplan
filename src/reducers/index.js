// Dependencies
import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

// Reducers
import MeasuresReducer from 'reducers/MeasuresReducer';
import OrganizationsReducer from 'reducers/OrganizationsReducer';
import SelectedMeasureReducer from 'reducers/SelectedMeasureReducer';
import SetupReducer from 'reducers/SetupReducer';

const reducers = history => combineReducers({
  router: connectRouter(history),
  measures: MeasuresReducer,
  organizations: OrganizationsReducer,
  selectedMeasure: SelectedMeasureReducer,
  setup: SetupReducer
});

export default reducers;
