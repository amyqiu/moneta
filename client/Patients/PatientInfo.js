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
  extraButton: React.Node,
  onAddEntry: () => void,
  observationButton: ?React.Node,
  inObservation: boolean
};

type State = {
  lastEntryTime: ?string,
  loadingEntryTime: boolean
};

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
      return { colour: colours.white, text: "Not in observation period" };
    }
    if (lastEntryTime == null || lastEntryTime === "") {
      return { colour: colours.white, text: "Unavailable" };
    }

    const duration = moment.duration(30, "minutes");

    const lastEntry = moment(lastEntryTime);
    const lastInterval = moment(Math.round(+lastEntry / +duration) * +duration);

    const current = moment();
    const currentInterval = moment(
      Math.round(+current / +duration) * +duration
    );

    const nextEntry = lastInterval.clone().add(30, "minutes");
    const nextEntryText = nextEntry.format("h:mmA - MMM Do, YYYY");

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
      onAddEntry,
      observationButton,
      inObservation
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
          onPress={onAddEntry}
          title="+ Add Entry"
          titleProps={{ style: styles.smallButtonTitle }}
          underlayColor="white"
          disabled={!inObservation}
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

    return (
      <Card
        containerStyle={{
          borderRadius: 4,
          borderColor: nextEntry.colour,
          borderWidth: 4
        }}
      >
        <View>
          {isTablet() ? tabletHeader : name}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar
              size={isTablet() ? 150 : 100}
              rounded
              source={{ uri: patient.imageUri }}
              containerStyle={{ marginRight: isTablet() ? 32 : 16 }}
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
              {isTablet() ? observationButton : buttons}
            </View>
          </View>
          {isTablet() ? null : observationButton}
        </View>
      </Card>
    );
  }
}
