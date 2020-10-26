import { FETCH_COMMITS } from 'constants/types';

const initialState = {};

export default function(state = initialState, action) {
	switch(action.type) {
		case FETCH_COMMITS:
			return action.payload;
		default:
			return state;
	}

}
