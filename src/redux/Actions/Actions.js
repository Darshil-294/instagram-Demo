import {ADD_DATA, CURRENT_USER, ROUTE_NAME} from '../Type';

export const Add_Data_Action = data => dispatch => {
  dispatch({
    type: ADD_DATA,
    payload: data,
  });
};

export const Current_User_Action = data => dispatch => {
  dispatch({
    type: CURRENT_USER,
    payload: data,
  });
};

export const Route_name = data => dispatch => {
  dispatch({
    type: ROUTE_NAME,
    payload: [...data],
  });
};
