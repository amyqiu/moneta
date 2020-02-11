// @flow
import React from "react";
import { View, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationScreenProps } from "react-navigation";
import Toast from "react-native-easy-toast";
import colours from "../Colours";
import styles from "./PatientStyles";
import navigationStyles from "../NavigationStyles";
import PatientInfo from "./PatientInfo";
import StartObservationModal from "./StartObservationModal";
import EndObservationModal from "./EndObservationModal";
import Calendar from "./Calendar";
import type { Entry } from "../NewEntry/Entry";
import PatientTrends from "./PatientTrends";
import CollapsibleCard from "./CollapsibleCard";
import Exporter from "./Exporter";
import type { Patient } from "./Patient";
import ObservationComparison from "../Trends/ObservationComparison";
import { parseRawPatient, getLastObservation, isTablet } from "../Helpers";

type Props = NavigationScreenProps & {};

type State = {
  loadingObservation: boolean,
  startObservationModal: boolean,
  endObservationModal: boolean,
  patient: Patient
};

export default class PatientPage extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: { navigation: Object }) => {
    return {
      ...navigationStyles,
      title: "Resident Overview",
      headerRight: (
        <Icon
          size={24}
          name="ios-home"
          style={{ color: colours.white, marginRight: 16 }}
          onPress={() => navigation.navigate("AllPatients")}
        />
      )
    };
  };

  constructor(props: Props) {
    super(props);
    const { navigation } = props;
    const patient = navigation.getParam("patient");
    this.state = {
      loadingObservation: false,
      startObservationModal: false,
      endObservationModal: false,
      patient
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const showToast = navigation.getParam("showSubmitEntryToast");
    if (showToast) {
      this.refs.toast.show("Succesfully submitted!");
    }
    this.getPatient();
  }

  getPatient = async () => {
    const { navigation } = this.props;
    const patient = navigation.getParam("patient");

    try {
      const response = await fetch(
        `https://vast-savannah-47684.herokuapp.com/patient/${patient.id}`
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      this.setState({ patient: parseRawPatient(json) });
    } catch (error) {
      console.log("error", error);
    }
  };

  handleExport = () => {
    // TODO: Navigate to export page
  };

  handleNewEntry = (params: Object) => {
    const { navigation } = this.props;
    navigation.navigate("NewEntry", params);
  };

  handleNavigateOldEntry = (entry: Entry) => {
    const { navigation } = this.props;
    navigation.navigate("OldEntry", { entry });
  };

  handleNavigateObservationOverview = (observationId: string) => {
    const { navigation } = this.props;
    navigation.navigate("ObservationOverview", { observationId });
  };

  handleNavigateMoreTrends = () => {
    const { navigation } = this.props;
    const { patient } = this.state;
    navigation.navigate("TrendsDetails", { patient });
  };

  confirmStartObservation = () => {
    this.setState({ startObservationModal: true });
  };

  handleStartObservation = (
    checkedReasons: Set<string>,
    startingNotes: string,
    customFields: Array<string>
  ) => {
    this.setState({ loadingObservation: true });
    const { patient } = this.state;
    const start = new Date();
    const data = JSON.stringify({
      patient_ID: patient.id,
      start_time: Math.round(start.getTime() / 1000),
      reasons: Array.from(checkedReasons),
      starting_notes: startingNotes,
      personalized_behaviour_1_title: customFields[0],
      personalized_behaviour_2_title: customFields[1],
      personalized_context_1_title: customFields[2],
      personalized_context_2_title: customFields[3]
    });
    fetch("https://vast-savannah-47684.herokuapp.com/observation/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: data
    })
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        if (responseData.observation) {
          this.setState({
            loadingObservation: false,
            startObservationModal: false
          });
          this.getPatient();
        } else {
          console.log(responseData);
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  confirmEndObservation = () => {
    this.setState({ endObservationModal: true });
  };

  handleEndObservation = (nextSteps: Set<string>, endingNotes: string) => {
    this.setState({ loadingObservation: true });
    const { patient } = this.state;
    const observationID = getLastObservation(patient);
    const data = JSON.stringify({
      id: observationID,
      patient_ID: patient.id,
      end_time: Math.round(new Date().getTime() / 1000),
      next_steps: Array.from(nextSteps),
      ending_notes: endingNotes
    });
    fetch("https://vast-savannah-47684.herokuapp.com/observation/end", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: data
    })
      .then(response => {
        if (response.ok) {
          this.setState({
            loadingObservation: false,
            endObservationModal: false
          });
          this.getPatient();
        } else {
          console.log(response);
        }
      })
      .catch(error => {
        console.log("erorr", error);
      });
  };

  render() {
    const {
      loadingObservation,
      startObservationModal,
      endObservationModal,
      patient
    } = this.state;
    const observationID = getLastObservation(patient);

    const observationTitle = patient.inObservation
      ? "End Observation"
      : "Start Observation";
    const observationAction = patient.inObservation
      ? this.confirmEndObservation
      : this.confirmStartObservation;

    const observationButton = (
      <Button
        onPress={observationAction}
        title={observationTitle}
        buttonStyle={styles.smallButton}
        containerStyle={styles.observationButtonContainer}
        titleProps={{ style: styles.smallButtonTitle }}
        loading={loadingObservation}
      />
    );

    return (
      <View style={styles.background}>
        <StartObservationModal
          patientName={patient.name}
          isVisible={startObservationModal}
          closeModal={() => this.setState({ startObservationModal: false })}
          startObservation={this.handleStartObservation}
        />
        <EndObservationModal
          patientName={patient.name}
          isVisible={endObservationModal}
          closeModal={() => this.setState({ endObservationModal: false })}
          endObservation={this.handleEndObservation}
          observationID={observationID}
        />
        <ScrollView style={{ marginBottom: 12 }}>
          <PatientInfo
            patient={patient}
            onNavigatePatient={null}
            extraButton={null}
            onAddEntry={this.handleNewEntry}
            observationButton={observationButton}
          />
          <CollapsibleCard
            startExpanded={false}
            title="Export"
            iconName="ios-arrow-round-down"
          >
            <Exporter patient={patient} />
          </CollapsibleCard>
          <CollapsibleCard
            startExpanded={false}
            title="Recent Activity"
            iconName="md-alarm"
          >
            <Calendar
              patient={patient}
              onNavigateOldEntry={this.handleNavigateOldEntry}
              onNavigateObservationOverview={
                this.handleNavigateObservationOverview
              }
            />
          </CollapsibleCard>
          <CollapsibleCard
            startExpanded
            title={isTablet() ? "Observation Period Details" : "Period Details"}
            iconName="ios-list"
          >
            <PatientTrends startExpanded patient={patient} />
          </CollapsibleCard>
          <CollapsibleCard
            startExpanded
            title={
              isTablet() ? "Compare Observation Periods" : "Compare Periods"
            }
            iconName="ios-swap"
          >
            <ObservationComparison patient={patient} />
          </CollapsibleCard>
        </ScrollView>
        <Toast
          ref="toast"
          position="bottom"
          positionValue={148}
          style={styles.toast}
          textStyle={styles.toastText}
        />
      </View>
    );
  }
}
