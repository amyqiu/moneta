import React from "react";
import { Dimensions } from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import colours from "./Colours";
import BEHAVIOURS from "./NewEntry/Behaviours";

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

export function createObservationDropdown(observations: [Object]) {
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

export const SELECT_COLOURS = {
  primary: colours.primaryGrey,
  chipColor: colours.primaryGrey
};

export const SELECT_ICON = (
  <Icon
    size={36}
    name="ios-checkmark"
    style={{ color: colours.successGreen, marginRight: 16 }}
  />
);
