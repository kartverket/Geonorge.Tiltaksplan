// Dependencies
import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

// Reducers
import MeasuresReducer from 'reducers/MeasuresReducer';
import SelectedMeasureReducer from 'reducers/SelectedMeasureReducer';

const reducers = history => combineReducers({
  router: connectRouter(history),
  measures: MeasuresReducer,
  selectedMeasure: SelectedMeasureReducer
});

export default reducers;
