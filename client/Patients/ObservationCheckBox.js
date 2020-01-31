// @flow
import * as React from "react";
import { View } from "react-native";
import { Text, CheckBox } from "react-native-elements";
import styles from "./PatientStyles";
import colours from "../Colours";

const NEXT_STEPS = [
  "Repeat DOS in 4-6 weeks",
  "No further DOS",
  "ABC charting for behaviour",
  "Clinical huddle/meeting",
  "Progress note written",
  "Consult with substitute decision maker (SDM)",
  "Medication adjustment/review",
  "Non-pharmacological interventions",
  "Care plan updated",
  "Referral"
];

const ObservationCheckBox = ({
  nextSteps,
  handleNextStepChecked
}: {
  nextSteps: Set<string>,
  handleNextStepChecked: string => void
}) => {
  return (
    <View>
      <Text style={styles.modalSubHeading}>Next Steps</Text>
      {NEXT_STEPS.map(nextStep => (
        <CheckBox
          title={nextStep}
          key={nextStep}
          checked={nextSteps.has(nextStep)}
          onPress={() => handleNextStepChecked(nextStep)}
          containerStyle={styles.checkBoxContainer}
          textStyle={styles.checkBoxLabel}
          iconType="feather"
          checkedIcon="check-square"
          uncheckedIcon="square"
          checkedColor={colours.primaryGrey}
          uncheckedColor={colours.primaryGrey}
        />
      ))}
    </View>
  );
};

export default ObservationCheckBox;
