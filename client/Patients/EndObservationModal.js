// @flow
import * as React from "react";
import { View, TextInput } from "react-native";
import { Button, Text, CheckBox } from "react-native-elements";
import Modal from "react-native-modal";
import styles from "./PatientStyles";
import colours from "../Colours";
import { isTablet } from "../Helpers";

type Props = {
  patientName: string,
  isVisible: boolean,
  closeModal: () => void,
  endObservation: (nextSteps: Set<string>, endingNotes: string) => void
};

type State = {
  nextSteps: Set<string>,
  endingNotes: string
};

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

export default class EndObservationModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      nextSteps: new Set(),
      endingNotes: ""
    };
  }

  handleNextStepChecked = (nextStep: string) => {
    const { nextSteps } = this.state;

    if (nextSteps.has(nextStep)) {
      nextSteps.delete(nextStep);
    } else {
      nextSteps.add(nextStep);
    }

    this.setState({ nextSteps });
  };

  render() {
    const { nextSteps, endingNotes } = this.state;
    const { patientName, isVisible, closeModal, endObservation } = this.props;
    const message = `End observation for ${patientName}?`;
    return (
      <Modal isVisible={isVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>{message}</Text>
          <Text style={styles.modalSubHeading}>Reasons</Text>
          {NEXT_STEPS.map(nextStep => (
            <CheckBox
              title={nextStep}
              key={nextStep}
              checked={nextSteps.has(nextStep)}
              onPress={() => this.handleNextStepChecked(nextStep)}
              containerStyle={styles.checkBoxContainer}
              textStyle={styles.checkBoxLabel}
              iconType="feather"
              checkedIcon="check-square"
              uncheckedIcon="square"
              checkedColor={colours.primaryGrey}
              uncheckedColor={colours.primaryGrey}
            />
          ))}
          <Text
            style={{
              ...styles.modalSubHeading,
              ...{ paddingTop: 12, paddingBottom: 8 }
            }}
          >
            Notes
          </Text>
          <TextInput
            style={styles.comments}
            onChangeText={notes => this.setState({ endingNotes: notes })}
            value={endingNotes}
            multiline
            height={isTablet() ? 200 : 100}
          />
          <View style={styles.observationModalButtons}>
            <Button
              onPress={closeModal}
              title="Cancel"
              buttonStyle={styles.modalCancelButton}
              titleProps={{ style: styles.modalButtonTitle }}
            />
            <Button
              onPress={() => endObservation(nextSteps, endingNotes)}
              title="End Observation"
              buttonStyle={styles.modalButton}
              titleProps={{ style: styles.modalButtonTitle }}
            />
          </View>
        </View>
      </Modal>
    );
  }
}
