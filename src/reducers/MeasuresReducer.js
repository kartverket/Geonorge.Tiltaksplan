import { FETCH_MEASURES } from 'constants/types';

const initialState = {};

export default function(state = initialState, measure) {
	switch(measure.type) {
		case FETCH_MEASURES:
			return measure.payload;
		default:
			return state;
	}

}
