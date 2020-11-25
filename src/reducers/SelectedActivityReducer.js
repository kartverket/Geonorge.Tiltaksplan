import { FETCH_SELECTED_ACTIVITY } from 'constants/types';

const reducer = (state = {}, action) => {
   switch (action.type) {
      case FETCH_SELECTED_ACTIVITY:
         return action.payload;
      default:
         return state;
   }
}

export default reducer;
