// @flow
import * as React from "react";
import { View, ScrollView, TextInput } from "react-native";
import { Button, Text, CheckBox } from "react-native-elements";
import Modal from "react-native-modal";
import styles from "./PatientStyles";
import colours from "../Colours";
import { isTablet, STARTING_REASONS } from "../Helpers";

type Props = {
  patientName: string,
  isVisible: boolean,
  closeModal: () => void,
  startObservation: (
    checkedReasons: Set<string>,
    startingNotes: string,
    customEntryFields: Array<string>
  ) => void
};

type State = {
  checkedReasons: Set<string>,
  startingNotes: string,
  customEntryFields: Array<string>
};

export default class StartObservationModal extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      checkedReasons: new Set(),
      startingNotes: "",
      customEntryFields: ["", "", "", ""]
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
    const { checkedReasons, startingNotes, customEntryFields } = this.state;
    const { patientName, isVisible, closeModal, startObservation } = this.props;
    const message = `Start observation for ${patientName}?`;
    return (
      <Modal isVisible={isVisible} onBackdropPress={closeModal}>
        <ScrollView>
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
            <Text style={styles.startModalSubHeading}>
              Add optional custom behaviour fields
            </Text>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TextInput
                style={styles.comments}
                onChangeText={notes => {
                  customEntryFields[0] = notes;
                  this.setState({ customEntryFields });
                }}
                value={customEntryFields[0]}
                height={isTablet() ? 60 : 30}
                maxLength={32}
              />
              <TextInput
                style={styles.comments}
                onChangeText={notes => {
                  customEntryFields[1] = notes;
                  this.setState({ customEntryFields });
                }}
                value={customEntryFields[1]}
                height={isTablet() ? 60 : 30}
                maxLength={32}
              />
            </View>
            <Text style={styles.startModalSubHeading}>
              Add optional custom context fields
            </Text>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TextInput
                style={styles.comments}
                onChangeText={notes => {
                  customEntryFields[2] = notes;
                  this.setState({ customEntryFields });
                }}
                value={customEntryFields[2]}
                height={isTablet() ? 60 : 30}
                maxLength={32}
              />
              <TextInput
                style={styles.comments}
                onChangeText={notes => {
                  customEntryFields[3] = notes;
                  this.setState({ customEntryFields });
                }}
                value={customEntryFields[3]}
                height={isTablet() ? 60 : 30}
                maxLength={32}
              />
            </View>
            <Text style={styles.startModalSubHeading}>Notes</Text>
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
                onPress={() => {
                  startObservation(
                    checkedReasons,
                    startingNotes,
                    customEntryFields
                  );
                }}
                title="Start Observation"
                buttonStyle={styles.modalButton}
                titleProps={{ style: styles.modalButtonTitle }}
              />
            </View>
          </View>
        </ScrollView>
      </Modal>
    );
  }
}
