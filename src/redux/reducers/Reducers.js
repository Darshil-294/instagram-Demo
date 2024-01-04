import {
  ADD_DATA,
  CURRENT_USER,
  GET_MULTI_USER,
  HOME_POST,
  ROUTE_NAME,
} from '../Type';

const INITIAL_STATE = {
  User: [],
  currentuser: null,
  route_name: false,
  home_post: [],
  get_multi_user: [],
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
    case HOME_POST: {
      return {...state, home_post: action?.payload};
    }
    case GET_MULTI_USER: {
      return {...state, get_multi_user: action?.payload};
    }
    default:
      return state;
  }
};
