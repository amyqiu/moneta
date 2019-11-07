// @flow
import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Button, Card, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationScreenProps } from "react-navigation";
import Toast from "react-native-easy-toast";
import colours from "../Colours";
import styles from "./PatientStyles";
import navigationStyles from "../NavigationStyles";
import ColumnChart from "../Trends/ColumnChart";
import PieChart from "../Trends/PieChart";
import type { Patient } from "./Patient";
import PatientInfo from "./PatientInfo";
import Calendar from "./Calendar";

type Props = NavigationScreenProps & {
  patient: Patient
};

// TODO: Show how many days since observation?
type State = {
  inObservation: boolean,
  isExpandedRecentActivity: boolean,
  isExpandedTrends: boolean
};

export default class PatientPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = props;
    const patient = navigation.getParam("patient");
    this.state = {
      inObservation: patient.inObservation,
      isExpandedRecentActivity: false,
      isExpandedTrends: false
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const showToast = navigation.getParam("showSubmitEntryToast");
    if (showToast) {
      this.refs.toast.show("Succesfully submitted!");
    }
  }

  handleNewEntry = () => {
    const { navigation } = this.props;
    const patient = navigation.getParam("patient");
    navigation.navigate("NewEntry", { patient });
  };

  handleNavigateOldEntry = (entryID: string) => {
    const { navigation } = this.props;
    navigation.navigate("OldEntry", { entryID });
  };

  handleStartObservation = () => {
    this.setState({ inObservation: true });
    // TODO: Refresh page and submit to server
  };

  handleEndObservation = () => {
    this.setState({ inObservation: false });
    // TODO: Show summary screen? Refresh / submit
  };

  handleExport = () => {
    // TODO: Navigate to export page
  };

  toggleRecentActivity = () => {
    this.setState(previousState => ({
      isExpandedRecentActivity: !previousState.isExpandedRecentActivity
    }));
  };

  toggleTrends = () => {
    this.setState(previousState => ({
      isExpandedTrends: !previousState.isExpandedTrends
    }));
  };

  static navigationOptions = {
    ...navigationStyles,
    title: "Resident Overview"
  };

  render() {
    const { navigation } = this.props;
    const {
      inObservation,
      isExpandedRecentActivity,
      isExpandedTrends
    } = this.state;
    const patient = navigation.getParam("patient");

    const observationTitle = inObservation
      ? "End Observation"
      : "Start Observation";
    const observationAction = inObservation
      ? this.handleEndObservation
      : this.handleStartObservation;

    const exportButton = (
      <Button
        onPress={this.handleExport}
        title="Export"
        buttonStyle={styles.smallButton}
        containerStyle={styles.buttonContainer}
        titleProps={{ style: styles.smallButtonTitle }}
      />
    );

    const observationButton = (
      <Button
        onPress={observationAction}
        title={observationTitle}
        buttonStyle={styles.smallButton}
        containerStyle={styles.observationButtonContainer}
        titleProps={{ style: styles.smallButtonTitle }}
      />
    );
    return (
      <View style={styles.background}>
        <ScrollView style={styles.background}>
          <Card containerStyle={{ borderRadius: 4 }}>
            <View>
              <PatientInfo
                patient={patient}
                onNavigatePatient={null}
                extraButton={exportButton}
                onAddEntry={this.handleNewEntry}
                observationButton={observationButton}
              />
            </View>
          </Card>
          <Card containerStyle={{ borderRadius: 4 }}>
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={this.toggleRecentActivity}
            >
              <Text h3 style={{ paddingBottom: 4 }}>
                Recent Activity
              </Text>
              <Icon
                name={
                  isExpandedRecentActivity === false
                    ? "md-arrow-dropdown"
                    : "md-arrow-dropup"
                }
                color={colours.primaryGrey}
                size={35}
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
            <View style={isExpandedRecentActivity ? {} : { display: "none" }}>
              <Calendar
                patient={patient}
                onNavigateOldEntry={this.handleNavigateOldEntry}
              />
            </View>
          </Card>
          <Card containerStyle={{ borderRadius: 4 }}>
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={this.toggleTrends}
            >
              <Text h3 style={{ paddingBottom: 4 }}>
                Trends/Patterns
              </Text>
              <Icon
                name={
                  isExpandedTrends === false
                    ? "md-arrow-dropdown"
                    : "md-arrow-dropup"
                }
                color={colours.primaryGrey}
                size={35}
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
            <View style={isExpandedTrends ? {} : { display: "none" }}>
              <ColumnChart />
              <PieChart />
            </View>
          </Card>
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
