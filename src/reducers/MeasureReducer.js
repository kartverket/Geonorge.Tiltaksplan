import { FETCH_MEASURE } from 'constants/types';

const reducer = (state = {}, action) => {
   switch (action.type) {
      case FETCH_MEASURE:
         return action.payload;
      default:
         return state;
   }
}

export default reducer;
