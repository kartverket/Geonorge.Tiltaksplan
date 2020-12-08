import { CREATE_ACTIVITY, UPDATE_ACTIVITY, DELETE_ACTIVITY } from 'constants/types';

const reducer = (state = [], action) => {
   switch (action.type) {
      case CREATE_ACTIVITY:
         return [
            ...state,
            action.payload
         ];
      case UPDATE_ACTIVITY:
         return state.map(activity => {
            if (activity.id !== action.payload.id) {
               return activity;
            }

            return {
               ...activity,
               ...action.payload
            };
         });
      case DELETE_ACTIVITY:
         return state.filter(activity => activity.id !== action.payload);
      default:
         return state;
   }
}

export default reducer;
