import { FETCH_ACTIONS } from 'constants/types';

const initialState = {};

export default function(state = initialState, action) {
	switch(action.type) {
		case FETCH_ACTIONS:
			return action.payload;
		default:
			return state;
	}

}
