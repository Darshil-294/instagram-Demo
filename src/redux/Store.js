import AsyncStorage from '@react-native-async-storage/async-storage';
import {applyMiddleware, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import {rootreducer} from './Actions';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistreducer = persistReducer(persistConfig, rootreducer);
export const store = createStore(persistreducer, applyMiddleware(thunk));
export const persiststore = persistStore(store);

// return store;
