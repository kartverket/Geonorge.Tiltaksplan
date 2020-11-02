import { FETCH_SETUP } from 'constants/types';

const initialState = {};

const reducer = (state = initialState, setup) => {
	switch (setup.type) {
		case FETCH_SETUP:
			return setup.payload;
		default:
			return state;
	}
}

export default reducer;
