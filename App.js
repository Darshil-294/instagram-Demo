import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import StackNavigation from './src/navigation/StackNavigation';
import {Provider} from 'react-redux';
import {persiststore, store} from './src/redux/Store';
import {PersistGate} from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persiststore}>
        <StackNavigation />
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
