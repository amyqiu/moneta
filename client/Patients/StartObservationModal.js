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
  startObservation: (checkedReasons: Set<string>, startingNotes: string) => void
};

type State = {
  checkedReasons: Set<string>,
  startingNotes: string
};

const STARTING_REASONS = [
  "Baseline/Admission",
  "Transition/Move",
  "New Behaviour",
  "Behaviour Change",
  "New Intervention",
  "Medication Adjustment",
  "Urgent Referral/Transfer"
];

export default class StartObservationModal extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      checkedReasons: new Set(),
      startingNotes: ""
    };
  }

  handleReasonChecked = (reason: string) => {
    const { checkedReasons } = this.state;

    if (checkedReasons.has(reason)) {
      checkedReasons.delete(reason);
    } else {
      checkedReasons.add(reason);
    }

    this.setState({ checkedReasons });
  };

  render() {
    const { checkedReasons, startingNotes } = this.state;
    const { patientName, isVisible, closeModal, startObservation } = this.props;
    const message = `Start observation for ${patientName}?`;
    return (
      <Modal isVisible={isVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>{message}</Text>
          <Text style={styles.modalSubHeading}>Reasons</Text>
          {STARTING_REASONS.map(reason => (
            <CheckBox
              title={reason}
              key={reason}
              checked={checkedReasons.has(reason)}
              onPress={() => this.handleReasonChecked(reason)}
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
            onChangeText={notes => this.setState({ startingNotes: notes })}
            value={startingNotes}
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
              onPress={() => startObservation(checkedReasons, startingNotes)}
              title="Start Observation"
              buttonStyle={styles.modalButton}
              titleProps={{ style: styles.modalButtonTitle }}
            />
          </View>
        </View>
      </Modal>
    );
  }
}
