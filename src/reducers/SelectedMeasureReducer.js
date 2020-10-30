import { FETCH_SELECTED_MEASURE } from 'constants/types';

const initialState = {};

const reducer = (state = initialState, measure) => {
	switch (measure.type) {
		case FETCH_SELECTED_MEASURE:
			return measure.payload;
		default:
			return state;
	}
}

export default reducer;
