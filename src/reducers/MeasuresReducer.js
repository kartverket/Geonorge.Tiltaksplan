import { FETCH_MEASURES, CREATE_MEASURE, UPDATE_MEASURE, DELETE_MEASURE } from 'constants/types';

const reducer = (state = [], action) => {
   switch (action.type) {
      case FETCH_MEASURES:
         return action.payload;
      case CREATE_MEASURE:
         return [
            ...state,
            action.payload
         ];
      case UPDATE_MEASURE:
         return state.map(measure => {
            if (measure.id !== action.payload.id) {
               return measure;
            }

            return {
               ...measure,
               ...action.payload
            };
         });
      case DELETE_MEASURE:
         return state.filter(measure => measure.id !== action.payload);
      default:
         return state;
   }
}

export default reducer;
