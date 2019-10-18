// @flow
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import React from "react";
import NewEntryPage from "./NewEntry/NewEntryPage";
import PatientPage from "./PatientPage";

const MainNavigator = createStackNavigator({
  Patient: { screen: PatientPage },
  NewEntry: { screen: NewEntryPage }
});

const Apps = createAppContainer(MainNavigator);

export default function App() {
  return <Apps />;
}
