import { FETCH_ORGANIZATIONS } from 'constants/types';

const initialState = [];

const reducer = (state = initialState, measure) => {
	switch (measure.type) {
		case FETCH_ORGANIZATIONS:
			return measure.payload;
		default:
			return state;
	}
}

export default reducer;
