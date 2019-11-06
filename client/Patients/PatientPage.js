// @flow
import React from "react";
import { FlatList, View, ScrollView, TouchableOpacity } from "react-native";
import { Button, Card, Text, Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationScreenProps } from "react-navigation";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import colours from "../Colours";
import styles from "./PatientStyles";
import navigationStyles from "../NavigationStyles";
import ColumnChart from "../Trends/ColumnChart";
import PieChart from "../Trends/PieChart";
import type { Patient } from "./AllPatientsPage";

type Props = NavigationScreenProps & {
  patient: Patient
};

// TODO: Show how many days since observation?
type State = {
  inObservation: boolean,
  isExpandedRecentActivity: boolean,
  isExpandedTrends: boolean,
  selectedStartDate: ?moment
};

export default class PatientPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = props;
    const patient = navigation.getParam("patient");
    this.state = {
      inObservation: patient.inObservation,
      isExpandedRecentActivity: false,
      isExpandedTrends: false,
      selectedStartDate: null
    };
  }

  onDateChange = (date: Date) => {
    this.setState({
      selectedStartDate: date
    });
  };

  handleNewEntry = () => {
    const { navigation } = this.props;
    const patient = navigation.getParam("patient");
    navigation.navigate("NewEntry", { patient });
  };

  navigateOldEntry = (entryID: number) => {
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

  renderCalender = () => {
    const { selectedStartDate } = this.state;
    // TODO: replace with entries within month
    const today = new Date();
    const existingDates = [
      new Date(today.setDate(today.getDate() - 1)),
      new Date(today.setDate(today.getDate() - 6)),
      new Date(today.setDate(today.getDate() + 5))
    ];
    const customDatesStyles = [];
    existingDates.forEach(day => {
      customDatesStyles.push({
        date: day,
        style: { backgroundColor: "#ccffee" }
      });
    });

    let existingTimesList = null;
    if (selectedStartDate) {
      // TODO: replace with query for available times on this day
      const timelist = [moment(), moment(), moment()];
      timelist[0].add(5, "hours");
      timelist[1].add(3, "hours");

      const formattedDay = selectedStartDate.format("LL");
      const data = [];
      timelist.forEach(timestamp => {
        const formattedTime = timestamp.format("HH:mm A");
        data.push({ key: formattedTime, entryID: 12345 });
      });

      existingTimesList = (
        <FlatList
          key="data"
          data={data}
          ItemSeparatorComponent={() => <View style={styles.entrySeparator} />}
          ListHeaderComponent={() => (
            <Text style={styles.entryHeader} key={formattedDay}>
              {formattedDay}
            </Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => this.navigateOldEntry(item.entryID)}
            >
              <Text style={styles.entryLink}>{item.key}</Text>
            </TouchableOpacity>
          )}
        />
      );
    }

    return (
      <View>
        <CalendarPicker
          onDateChange={this.onDateChange}
          customDatesStyles={customDatesStyles}
        />
        <View style={{ maxHeight: "50%" }}>
          <ScrollView style={{ flexGrow: 0 }}>{existingTimesList}</ScrollView>
        </View>
      </View>
    );
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

    const calendar = this.renderCalender();

    return (
      <ScrollView style={styles.background}>
        <Card containerStyle={{ borderRadius: 4 }}>
          <View>
            <Text h3 style={{ paddingBottom: 4 }}>
              {patient.name}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Avatar
                size={100}
                rounded
                source={{ uri: patient.imageUri }}
                containerStyle={{ marginRight: 16 }}
              />
              <View>
                <Text style={styles.patientDetailsText}>
                  <Text style={{ fontWeight: "bold" }}>ID: </Text>
                  {patient.id}
                </Text>
                <Text style={styles.patientDetailsText}>
                  <Text style={{ fontWeight: "bold" }}>Room #: </Text>
                  {patient.room}
                </Text>
                <Text style={styles.patientDetailsText}>
                  <Text style={{ fontWeight: "bold" }}>Next Entry: </Text>
                  {patient.date}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Button
                    onPress={this.handleNewEntry}
                    title="+ Add Entry"
                    buttonStyle={styles.smallButton}
                    containerStyle={styles.buttonContainer}
                    titleProps={{ style: styles.smallButtonTitle }}
                  />
                  <Button
                    onPress={this.handleExport}
                    title="Export"
                    buttonStyle={styles.smallButton}
                    containerStyle={styles.buttonContainer}
                    titleProps={{ style: styles.smallButtonTitle }}
                  />
                </View>
                <Button
                  onPress={observationAction}
                  title={observationTitle}
                  buttonStyle={styles.smallButton}
                  containerStyle={styles.buttonContainer}
                  titleProps={{ style: styles.smallButtonTitle }}
                />
              </View>
            </View>
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
            {calendar}
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
    );
  }
}
