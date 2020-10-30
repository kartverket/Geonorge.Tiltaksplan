import { FETCH_MEASURES } from 'constants/types';

const initialState = {};

const reducer = (state = initialState, measure) => {
	switch (measure.type) {
		case FETCH_MEASURES:
			return measure.payload;
		default:
			return state;
	}
}

export default reducer;
