// @flow
import * as React from "react";
import {
  KeyboardAvoidingView,
  View,
  TextInput,
  ScrollView
} from "react-native";
import { Button, Text } from "react-native-elements";
import Modal from "react-native-modal";
import ObservationCheckBox from "./ObservationCheckBox";
import ObservationSummaryTable from "./ObservationSummaryTable";
import styles from "./PatientStyles";
import { isTablet } from "../Helpers";

type Props = {
  patientName: string,
  isVisible: boolean,
  closeModal: () => void,
  endObservation: (nextSteps: Set<string>, endingNotes: string) => void,
  observationID: ?string
};

type State = {
  nextSteps: Set<string>,
  endingNotes: string
};

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

  handleEndObservation = () => {
    const { nextSteps, endingNotes } = this.state;
    const { endObservation } = this.props;
    endObservation(nextSteps, endingNotes);
    this.setState({
      nextSteps: new Set(),
      endingNotes: ""
    });
  };

  render() {
    const { nextSteps, endingNotes } = this.state;
    const { patientName, isVisible, closeModal, observationID } = this.props;
    if (observationID == null) {
      // Should never be this state bc "End Observation" button will not show
      return null;
    }

    const message = `End observation for ${patientName}?`;
    return (
      <Modal isVisible={isVisible} onBackdropPress={closeModal}>
        <KeyboardAvoidingView behavior="position">
          <ScrollView style={styles.modalContainer}>
            <View style={styles.endModalView}>
              <Text style={styles.modalHeading}>{message}</Text>
              <ObservationSummaryTable
                observationData={null}
                observationID={observationID}
              />
              <ObservationCheckBox
                nextSteps={nextSteps}
                handleNextStepChecked={this.handleNextStepChecked}
              />
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
                  onPress={this.handleEndObservation}
                  title="End Observation"
                  buttonStyle={styles.modalButton}
                  titleProps={{ style: styles.modalButtonTitle }}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}
