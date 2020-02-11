import React from "react";
import { Dimensions } from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import colours from "./Colours";
import BEHAVIOURS from "./NewEntry/Behaviours";
import type { Patient } from "./Patients/Patient";

export function scaleWidth(percent: number) {
  const deviceWidth = Dimensions.get("window").width;
  return deviceWidth * percent;
}

export function isTablet() {
  const deviceWidth = Dimensions.get("window").width;
  return deviceWidth > 700;
}

export function formatObservationDates(observation: Object) {
  if (observation == null) {
    return "";
  }
  return `${moment(observation.start_time).format("MMM D, YYYY")} - ${moment(
    observation.end_time || new Date()
  ).format("MMM D, YYYY")}`;
}

export function createDropdownPeriods(observations: [Object]) {
  const items = [];
  observations.forEach(period => {
    items.push({
      name: formatObservationDates(period),
      id: period._id
    });
  });
  return items;
}

export function processObservationData(observation: Object) {
  const processedData = [];
  BEHAVIOURS.forEach((_, behaviour) => {
    if (!behaviour.includes("Sleeping") && !behaviour.includes("Calm")) {
      const entryData = observation.aggregated_behaviours[behaviour];
      const totalOccurrences = entryData.reduce((a, b) => a + b, 0);

      processedData.push({
        x: behaviour,
        y: totalOccurrences
      });
    }
  });
  return processedData;
}

export function parseRawPatient(rawPatient: Object) {
  return {
    name: rawPatient.name,
    id: rawPatient._id,
    displayId: rawPatient.display_ID,
    room: rawPatient.room,
    imageUri: rawPatient.profile_picture,
    inObservation: rawPatient.in_observation,
    observations: rawPatient.observation_periods
  };
}

export function getLastObservation(patient: Patient) {
  const observationCount = patient.observations.length;
  return observationCount > 0
    ? patient.observations[observationCount - 1]._id
    : null;
}

export function getSecondLastObservation(patient: Patient) {
  const observationCount = patient.observations.length;
  return observationCount > 1
    ? patient.observations[observationCount - 2]._id
    : null;
}

export function createDropdownBehaviours(
  optionalBehaviour1?: string,
  optionalBehaviour2?: string
) {
  const dropdownItems = [];
  BEHAVIOURS.forEach((_, behaviour) => {
    dropdownItems.push({
      name: behaviour,
      id: behaviour
    });
  });
  if (optionalBehaviour1) {
    dropdownItems.push({
      name: optionalBehaviour1,
      id: optionalBehaviour1
    });
  }
  if (optionalBehaviour2) {
    dropdownItems.push({
      name: optionalBehaviour2,
      id: optionalBehaviour2
    });
  }
  return dropdownItems;
}

export const SELECT_COLOURS = {
  primary: colours.primaryGrey,
  chipColor: colours.primaryGrey,
  selectToggleTextColor: colours.white,
  cancel: colours.errorRed
};

export const SELECT_ICON = (
  <Icon
    size={36}
    name="ios-checkmark"
    style={{ color: colours.successGreen, marginRight: 16 }}
  />
);

export const STARTING_REASONS = [
  "Baseline/Admission",
  "Transition/Move",
  "New Behaviour",
  "Behaviour Change",
  "New Intervention",
  "Medication Adjustment",
  "Urgent Referral/Transfer"
];
