import { FETCH_SELECTED_MEASURE } from 'constants/types';

const reducer = (state = {}, action) => {
   switch (action.type) {
      case FETCH_SELECTED_MEASURE:
         return action.payload;
      default:
         return state;
   }
}

export default reducer;
