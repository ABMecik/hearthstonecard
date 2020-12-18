/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Home from "./src/home";
import CardMec from "./src/cardMec";
import SearchCard from "./src/searchCard";

const Navigator = createStackNavigator({
  Home: { screen: Home },
  CardMec: { screen: CardMec },
  SearchCard: { screen: SearchCard }
})

const App = createAppContainer(Navigator);

export default App;
