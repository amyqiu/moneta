// @flow
import React from "react";
import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Button, Card, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationScreenProps } from "react-navigation";
import Toast from "react-native-easy-toast";
import moment from "moment";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import colours from "../Colours";
import styles from "./PatientStyles";
import navigationStyles from "../NavigationStyles";
import HourlyColumnChart from "../Trends/HourlyColumnChart";
import PatientInfo from "./PatientInfo";
import Calendar from "./Calendar";
import BEHAVIOURS from "../NewEntry/Behaviours";
import type { Entry } from "../NewEntry/Entry";
import { isTablet } from "../Helpers";

type Props = NavigationScreenProps & {};

type State = {
  inObservation: boolean,
  isExpandedRecentActivity: boolean,
  isExpandedTrends: boolean,
  observationStart: ?moment,
  observationID: ?string,
  loadingObservation: boolean,
  loadingTrends: boolean,
  aggregatedBehaviours: ?Map<string, Array<number>>,
  entryTimes: ?Array<moment>,
  selectedBehaviours: Array<Object>
};

export default class PatientPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = props;
    const observationID = navigation.getParam("observationID");
    this.state = {
      inObservation: observationID != null,
      isExpandedRecentActivity: false,
      isExpandedTrends: false,
      observationStart: null,
      observationID,
      loadingObservation: false,
      loadingTrends: true,
      aggregatedBehaviours: null,
      entryTimes: null,
      selectedBehaviours: [...BEHAVIOURS.keys()] // All are selected at first
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const showToast = navigation.getParam("showSubmitEntryToast");
    if (showToast) {
      this.refs.toast.show("Succesfully submitted!");
    }
    this.getTrendData();
  }

  handleNewEntry = (params: Object) => {
    const { navigation } = this.props;
    navigation.navigate("NewEntry", params);
  };

  handleNavigateOldEntry = (entry: Entry) => {
    const { navigation } = this.props;
    navigation.navigate("OldEntry", { entry });
  };

  handleNavigateMoreTrends = () => {
    const { navigation } = this.props;
    const patient = navigation.getParam("patient");
    navigation.navigate("TrendsDetails", { patient });
  };

  confirmStartObservation = () => {
    const { navigation } = this.props;
    const patient = navigation.getParam("patient");
    const message = `Start observation for ${patient.name}?`;
    Alert.alert(
      isTablet() ? message : "",
      isTablet() ? "" : message,
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: this.handleStartObservation }
      ],
      { cancelable: true }
    );
  };

  handleStartObservation = () => {
    this.setState({ loadingObservation: true });
    const { navigation } = this.props;
    const patient = navigation.getParam("patient");
    const start = new Date();
    const data = JSON.stringify({
      patient_ID: patient.id,
      start_time: Math.round(start.getTime() / 1000)
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
            observationStart: moment(start),
            inObservation: true,
            observationID: responseData.observation,
            loadingObservation: false
          });
        } else {
          console.log(responseData);
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  confirmEndObservation = () => {
    const { navigation } = this.props;
    const patient = navigation.getParam("patient");
    const message = `End observation for ${patient.name}?`;
    Alert.alert(
      isTablet() ? message : "",
      isTablet() ? "" : message,
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: this.handleEndObservation }
      ],
      { cancelable: true }
    );
  };

  handleEndObservation = () => {
    // TODO: Show summary screen with graphs?
    this.setState({ loadingObservation: true });
    const { navigation } = this.props;
    const { observationID } = this.state;
    const patient = navigation.getParam("patient");
    const data = JSON.stringify({
      id: observationID,
      patient_ID: patient.id,
      end_time: Math.round(new Date().getTime() / 1000)
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
          this.setState({ inObservation: false, loadingObservation: false });
        } else {
          console.log(response);
        }
      })
      .catch(error => {
        console.log("erorr", error);
      });
  };

  getTrendData = async () => {
    const { navigation } = this.props;
    const { observationID } = this.state;
    const patient = navigation.getParam("patient");

    // No observations for patient
    if (observationID == null && patient.observations.length === 0) {
      return;
    }

    // If not currently in observation, show stats from last observation period
    const observation =
      observationID ||
      patient.observations[patient.observations.length - 1]._id;

    try {
      const response = await fetch(
        `https://vast-savannah-47684.herokuapp.com/observation/${observation}`
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      const aggregatedBehaviours = new Map<string, Array<number>>();
      Object.keys(json.aggregated_behaviours).forEach(behaviour => {
        aggregatedBehaviours.set(
          behaviour,
          json.aggregated_behaviours[behaviour]
        );
      });
      const entryTimes = json.entry_times.map(entryTime => moment(entryTime));
      this.setState({
        loadingTrends: false,
        aggregatedBehaviours,
        entryTimes
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  handleExport = () => {
    // TODO: Navigate to export page
  };

  handleSelectedBehavioursChange = (selectedBehaviours: Array<Object>) => {
    this.setState({ selectedBehaviours });
  };

  createDropdownItems = () => {
    const dropdownItems = [];
    BEHAVIOURS.forEach((_, behaviour) => {
      dropdownItems.push({
        name: behaviour,
        id: behaviour
      });
    });
    return dropdownItems;
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

  processHourlyTrends = () => {
    const { aggregatedBehaviours, entryTimes, selectedBehaviours } = this.state;
    if (
      aggregatedBehaviours == null ||
      entryTimes == null ||
      entryTimes.length === 0
    ) {
      return [];
    }

    const filteredBehaviours = new Set(selectedBehaviours);

    const processedData = [];
    aggregatedBehaviours.forEach((data, behaviour) => {
      if (filteredBehaviours.has(behaviour)) {
        const hourlyData = new Array(24).fill(0);
        for (let i = 0; i < entryTimes.length; i += 1) {
          const hour = entryTimes[i].hour();
          hourlyData[hour] += data[i];
        }

        const dataPoints = [];
        for (let i = 0; i < 24; i += 1) {
          dataPoints.push({
            x: isTablet() ? `${i}h` : i,
            y: hourlyData[i],
            color: BEHAVIOURS.get(behaviour).color
          });
        }
        processedData.push(dataPoints);
      }
    });
    return processedData;
  };

  static navigationOptions = {
    ...navigationStyles,
    title: "Resident Overview"
  };

  render() {
    const { navigation } = this.props;
    const {
      observationStart,
      inObservation,
      isExpandedRecentActivity,
      isExpandedTrends,
      loadingObservation,
      selectedBehaviours,
      observationID
    } = this.state;
    const patient = navigation.getParam("patient");

    const observationTitle = inObservation
      ? "End Observation"
      : "Start Observation";
    const observationAction = inObservation
      ? this.confirmEndObservation
      : this.confirmStartObservation;

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
        loading={loadingObservation}
      />
    );

    const processedData = this.processHourlyTrends();
    const dropdownItems = this.createDropdownItems();
    const selectedIcon = (
      <Icon
        size={48}
        name="ios-checkmark"
        style={{ color: colours.successGreen, marginRight: 16 }}
      />
    );

    let periodStart = null;
    let periodEnd = null;
    if (inObservation && observationStart) {
      periodStart = observationStart.format("MMM Do, YYYY");
      periodEnd = moment().format("MMM Do, YYYY");
    } else if (patient.observations.length > 0) {
      const lastObservation =
        patient.observations[patient.observations.length - 1];
      periodStart = moment(lastObservation.start_time).format("MMM Do, YYYY");
      periodEnd = moment(lastObservation.end_time).format("MMM Do, YYYY");
    }

    return (
      <View style={styles.background}>
        <ScrollView style={styles.background}>
          <PatientInfo
            patient={patient}
            observationID={observationID}
            onNavigatePatient={null}
            extraButton={exportButton}
            onAddEntry={this.handleNewEntry}
            observationButton={observationButton}
            inObservation={inObservation}
          />
          <Card
            containerStyle={{
              borderRadius: 4,
              borderColor: colours.secondaryGrey,
              borderWidth: 2
            }}
          >
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
          <Card
            containerStyle={{
              borderRadius: 4,
              marginBottom: 8,
              borderColor: colours.secondaryGrey,
              borderWidth: 2
            }}
          >
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
              {processedData.length === 0 ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    No entries available for current observation period.
                  </Text>
                </View>
              ) : (
                <View>
                  <SectionedMultiSelect
                    items={dropdownItems}
                    uniqueKey="id"
                    selectText="Select behaviours"
                    onSelectedItemsChange={this.handleSelectedBehavioursChange}
                    selectedItems={selectedBehaviours}
                    hideSearch
                    styles={{
                      selectToggleText: styles.dropdownToggleText,
                      chipText: styles.dropdownChipText,
                      confirmText: styles.dropdownConfirmText,
                      itemText: styles.dropdownItemText
                    }}
                    colors={{
                      primary: colours.primaryGrey,
                      chipColor: colours.primaryGrey
                    }}
                    selectedIconComponent={selectedIcon}
                  />
                  <HourlyColumnChart
                    graphData={processedData}
                    selectedBehaviours={new Set(selectedBehaviours)}
                    periodStart={periodStart}
                    periodEnd={periodEnd}
                  />
                </View>
              )}
              <View style={styles.centerContainer}>
                <Button
                  onPress={this.handleNavigateMoreTrends}
                  title="View More Trends"
                  buttonStyle={styles.smallButton}
                  containerStyle={styles.viewMoreButtonContainer}
                  titleProps={{ style: styles.smallButtonTitle }}
                />
              </View>
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
