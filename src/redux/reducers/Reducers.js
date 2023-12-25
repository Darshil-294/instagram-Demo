import {ADD_DATA, CURRENT_USER, ROUTE_NAME} from '../Type';

const INITIAL_STATE = {
  User: [],
  currentuser: null,
  route_name: false,
};

export const Reducers = (state = INITIAL_STATE, action) => {
  switch (action?.type) {
    case ADD_DATA: {
      return {...state, Data: [...state?.Data, action?.payload]};
    }
    case CURRENT_USER: {
      return {...state, currentuser: action?.payload};
    }
    case ROUTE_NAME: {
      return {...state, route_name: action?.payload};
    }
    default:
      return state;
  }
};
