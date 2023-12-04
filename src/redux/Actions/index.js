import {combineReducers} from 'redux';
import {Reducers} from '../reducers/Reducers';

export const rootreducer = combineReducers({
  user: Reducers,
});
