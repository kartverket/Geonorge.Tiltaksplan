import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

// Reducers
import SelectedActivityReducer from 'reducers/SelectedActivityReducer';
import MeasuresReducer from 'reducers/MeasuresReducer';
import SelectedMeasureReducer from 'reducers/SelectedMeasureReducer';
import OptionsReducer from 'reducers/OptionsReducer';
import OrganizationsReducer from 'reducers/OrganizationsReducer';
import { reducer as toastrReducer } from 'react-redux-toastr'

const reducers = history => combineReducers({
  router: connectRouter(history),
  selectedActivity: SelectedActivityReducer,
  measures: MeasuresReducer,
  selectedMeasure: SelectedMeasureReducer,
  organizations: OrganizationsReducer,
  options: OptionsReducer,
  //setup: SetupReducer
  toastr: toastrReducer
});

export default reducers
