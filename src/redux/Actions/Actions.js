import {ADD_DATA, CURRENT_USER} from '../Type';

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
