import { FETCH_MEASURES, FETCH_MEASURE, CREATE_MEASURE } from 'constants/types';

const reducer = (state = [], action) => {
	switch (action.type) {
		case FETCH_MEASURES:
      return action.payload;
    case FETCH_MEASURE:
      return action.payload;      
    case CREATE_MEASURE:
      const payload = action.payload;

      return [
        ...state,
        payload
      ];
		default:
			return state;
	}
}

export default reducer;
