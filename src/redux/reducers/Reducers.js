import {ADD_DATA, CURRENT_USER} from '../Type';

const INITIAL_STATE = {
  User: [],
  currentuser: null,
};

export const Reducers = (state = INITIAL_STATE, action) => {
  switch (action?.type) {
    case ADD_DATA: {
      return {...state, Data: [...state?.Data, action?.payload]};
    }
    case CURRENT_USER: {
      return {...state, currentuser: action?.payload};
    }
    default:
      return state;
  }
};
