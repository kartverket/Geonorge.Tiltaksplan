import { FETCH_SELECTED_ACTIVITY, CREATE_ACTIVITY, UPDATE_ACTIVITY, DELETE_ACTIVITY } from 'constants/types';

const initialState = {
   selectedActivity: {},
   activities: []
};

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case FETCH_SELECTED_ACTIVITY:
         return {
            ...initialState,
            ...{
               selectedActivity: action.payload
            }
         };      
      case CREATE_ACTIVITY:
         return {
            ...initialState,
            ...{
               activities: [
                  ...state.activities,
                  action.payload
               ]
            }
         };
      case UPDATE_ACTIVITY:
         return {
            selectedActivity: action.payload,
            ...{
               activities: state.activities.map(activity => {
                  if (activity.id !== action.payload.id) {
                     return activity;
                  }
      
                  return {
                     ...activity,
                     ...action.payload
                  };
               })
            }
         };
      case DELETE_ACTIVITY:
         return {
            selectedActivity: {},
            ...{
               activities: state.activities.filter(activity => activity.id !== action.payload)
            }
         };
      default:
         return state;
   }
}

export default reducer;
