// @flow
import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import { Button, Text, Avatar, Card } from "react-native-elements";
import moment from "moment";
import styles from "./PatientStyles";
import type { Patient } from "./Patient";
import { isTablet } from "../Helpers";
import colours from "../Colours";

type Props = {
  patient: Patient,
  onNavigatePatient: ?() => void,
  extraButton: ?React.Node,
  onAddEntry: Object => void,
  observationButton: ?React.Node
};

type State = {
  lastEntryTime: ?string,
  loadingEntryTime: boolean
};

const DATE_FORMAT = isTablet() ? "h:mmA - MMM D, YYYY" : "H:mm MMM D, YYYY";

export default class PatientInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      lastEntryTime: null,
      loadingEntryTime: true
    };
  }

  async componentDidMount() {
    const { patient } = this.props;
    this.getPatientLastEntry(patient.id);
  }

  async componentDidUpdate(prevProps: Props, prevState: State) {
    const { patient } = this.props;
    if (patient.inObservation && prevState.lastEntryTime === "") {
      this.getPatientLastEntry(patient.id);
    }
  }

  handleNavigateNewEntry = () => {
    const { patient, onAddEntry } = this.props;
    const { lastEntryTime } = this.state;
    onAddEntry({ patient, lastEntryTime });
  };

  getPatientLastEntry = async (patientID: string) => {
    const { patient } = this.props;
    if (!patient.inObservation) {
      this.setState({ lastEntryTime: "", loadingEntryTime: false });
      return;
    }
    try {
      const response = await fetch(
        `https://vast-savannah-47684.herokuapp.com/patient/last-entry-time?id=${patientID}`
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const lastEntryTime = await response.text();
      this.setState({
        lastEntryTime: lastEntryTime.length ? JSON.parse(lastEntryTime) : "",
        loadingEntryTime: false
      });
    } catch (error) {
      console.log(error);
    }
  };

  calculateNextEntry = () => {
    const { lastEntryTime } = this.state;
    const { patient } = this.props;
    if (!patient.inObservation) {
      return {
        colour: colours.secondaryGrey,
        text: isTablet() ? "Not in observation period" : "Not in observation"
      };
    }
    if (lastEntryTime == null || lastEntryTime === "") {
      return { colour: colours.secondaryGrey, text: "Unavailable" };
    }

    const duration = moment.duration(30, "minutes");

    const lastEntry = moment(lastEntryTime);
    const lastInterval = moment(Math.round(+lastEntry / +duration) * +duration);

    const current = moment();
    const currentInterval = moment(
      Math.round(+current / +duration) * +duration
    );

    const nextEntry = lastInterval.clone().add(30, "minutes");
    const nextEntryText = nextEntry.format(DATE_FORMAT);

    if (currentInterval.isSame(lastInterval)) {
      // Last entry is still within the current interval, no need for another entry yet
      return { colour: colours.successGreen, text: nextEntryText };
    }

    // If the last entry is no longer valid, see how far we are from the next entry
    const difference = nextEntry.diff(current, "minutes");
    if (difference > 5) {
      return { colour: colours.successGreen, text: nextEntryText };
    }
    if (Math.abs(difference) <= 5) {
      return { colour: colours.warningOrange, text: nextEntryText };
    }
    return { colour: colours.errorRed, text: nextEntryText };
  };

  render() {
    const {
      patient,
      onNavigatePatient,
      extraButton,
      observationButton
    } = this.props;
    const { loadingEntryTime } = this.state;

    const nextEntry = this.calculateNextEntry();
    const spinner = (
      <ActivityIndicator size="small" color={colours.primaryGrey} />
    );

    const buttons = (
      <View style={{ flexDirection: "row" }}>
        <Button
          buttonStyle={styles.smallButton}
          containerStyle={styles.buttonContainer}
          onPress={this.handleNavigateNewEntry}
          title="Add Entry"
          titleProps={{ style: styles.smallButtonTitle }}
          underlayColor="white"
          disabled={!patient.inObservation}
          disabledStyle={{ backgroundColor: colours.disabled }}
        />
        {extraButton}
      </View>
    );

    const name = (
      <Text
        h4
        style={{ paddingBottom: 4, fontWeight: "bold" }}
        onPress={onNavigatePatient}
      >
        {patient.name}
      </Text>
    );

    const tabletHeader = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {name}
        {buttons}
      </View>
    );

    const observationStartTime =
      patient.observations.length > 0
        ? patient.observations[patient.observations.length - 1].start_time
        : null;
    const observationStartText = observationStartTime
      ? moment(observationStartTime).format("MMM D, YYYY")
      : "";

    return (
      <Card
        containerStyle={{
          borderRadius: 4,
          borderColor: nextEntry.colour,
          borderWidth: 2
        }}
      >
        <View>
          {isTablet() ? tabletHeader : name}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar
              size={isTablet() ? 150 : 100}
              rounded
              source={{ uri: patient.imageUri }}
              containerStyle={{ marginRight: isTablet() ? 32 : 12 }}
              onPress={onNavigatePatient}
            />
            <View>
              <Text style={styles.patientDetailsText}>
                <Text style={{ fontWeight: "bold" }}>ID: </Text>
                {patient.displayId}
              </Text>
              <Text style={styles.patientDetailsText}>
                <Text style={{ fontWeight: "bold" }}>Room #: </Text>
                {patient.room}
              </Text>
              {loadingEntryTime ? (
                spinner
              ) : (
                <Text style={styles.patientDetailsText}>
                  <Text style={{ fontWeight: "bold" }}>Next Entry: </Text>
                  {nextEntry.text}
                </Text>
              )}
              {patient.inObservation ? (
                <Text style={styles.patientDetailsText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {isTablet() ? "Observation Started: " : "Started: "}
                  </Text>
                  {observationStartText}
                </Text>
              ) : null}
              {isTablet() ? observationButton : buttons}
            </View>
          </View>
          {isTablet() ? null : observationButton}
        </View>
      </Card>
    );
  }
}
