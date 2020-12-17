import { UPDATE_BAAT_INFO } from 'constants/types';

const initialState = null;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BAAT_INFO:
      return action.payload;
    default:
      return state;
  }
}

export default reducer;