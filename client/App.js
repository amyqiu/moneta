// @flow
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import React from "react";
import NewEntryPage from "./NewEntry/NewEntryPage";
import OldEntryPage from "./NewEntry/OldEntryPage";
import PatientPage from "./Patients/PatientPage";
import AllPatientsPage from "./Patients/AllPatientsPage";

const MainNavigator = createStackNavigator({
  AllPatients: { screen: AllPatientsPage },
  Patient: { screen: PatientPage },
  NewEntry: { screen: NewEntryPage },
  OldEntry: { screen: OldEntryPage }
});

const Apps = createAppContainer(MainNavigator);

export default function App() {
  return <Apps />;
}
