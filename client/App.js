// @flow
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import React from "react";
import NewEntryPage from "./NewEntry/NewEntryPage";
import ObservationOverview from "./Patients/ObservationOverview";
import OldEntryPage from "./NewEntry/OldEntryPage";
import PatientPage from "./Patients/PatientPage";
import AllPatientsPage from "./Patients/AllPatientsPage";
import LoginPage from "./LoginPage";

const MainNavigator = createStackNavigator({
  Login: {
    screen: LoginPage,
    navigationOptions: {
      header: null
    }
  },
  AllPatients: { screen: AllPatientsPage },
  Patient: { screen: PatientPage },
  NewEntry: { screen: NewEntryPage },
  OldEntry: { screen: OldEntryPage },
  ObservationOverview: { screen: ObservationOverview }
});

const Apps = createAppContainer(MainNavigator);

export default function App() {
  return <Apps />;
}
