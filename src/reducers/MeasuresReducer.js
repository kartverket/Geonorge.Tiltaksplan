import { FETCH_MEASURES, FETCH_SELECTED_MEASURE, CREATE_MEASURE, UPDATE_MEASURE, DELETE_MEASURE } from 'constants/types';

const initialState = {
   selectedMeasure: {},
   measures: []
};

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case FETCH_MEASURES:
         return {
            ...initialState,
            ...{ 
               measures: action.payload
            }
         };
      case FETCH_SELECTED_MEASURE:
         return {
            ...initialState,
            ...{
               selectedMeasure: action.payload
            }
         };
      case CREATE_MEASURE:
         return {
            ...initialState,
            ...{
               measures: [
                  ...state.measures,
                  action.payload
               ]
            }
         };
      case UPDATE_MEASURE:
         return {
            selectedMeasure: action.payload,
            ...{
               measures: state.measures.map(measure => {
                  if (measure.id !== action.payload.id) {
                     return measure;
                  }
      
                  return {
                     ...measure,
                     ...action.payload
                  };
               })
            }
         };
      case DELETE_MEASURE:
         return {
            selectedMeasure: {},
            ...{
               measures: state.measures.filter(measure => measure.id !== action.payload)
            }
         };
      default:
         return state;
   }
}

export default reducer;
