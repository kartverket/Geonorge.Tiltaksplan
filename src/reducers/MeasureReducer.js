import { FETCH_MEASURE } from 'constants/types';

const initialState = {};

const reducer = (state = initialState, measure) => {
	switch (measure.type) {
		case FETCH_MEASURE:
			return measure.payload;
		default:
			return state;
	}
}

export default reducer;
