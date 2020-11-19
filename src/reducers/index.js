import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

// Reducers
import MeasuresReducer from 'reducers/MeasuresReducer';
import SelectedMeasureReducer from 'reducers/SelectedMeasureReducer';
import OptionsReducer from 'reducers/OptionsReducer';
import OrganizationsReducer from 'reducers/OrganizationsReducer';

const reducers = history => combineReducers({
  router: connectRouter(history),
  measures: MeasuresReducer,
  selectedMeasure: SelectedMeasureReducer,
  organizations: OrganizationsReducer,
  options: OptionsReducer,
  //setup: SetupReducer
});

export default reducers
