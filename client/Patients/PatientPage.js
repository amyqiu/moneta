// @flow
import React from "react";
import { View, ScrollView, Animated } from "react-native";
import { Button, Card, Text, Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationScreenProps } from "react-navigation";
import CalendarPicker from "react-native-calendar-picker";
import { format } from "date-fns";
import colours from "../Colours";
import styles from "./PatientStyles";
import navigationStyles from "../NavigationStyles";
import ColumnChart from "../Trends/ColumnChart";

type Props = NavigationScreenProps & {};

// TODO: Show how many days since observation?
type State = {
  inObservation: boolean,
  isExpandedRecentActivity: boolean,
  selectedStartDate: ?Date,
  animation: any,
  maxHeight: number,
  minHeight: number
};

export default class PatientPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      inObservation: true,
      isExpandedRecentActivity: false,
      selectedStartDate: null,
      animation: new Animated.Value(42),
      maxHeight: 317,
      minHeight: 42
    };
  }

  onDateChange = (date: Date) => {
    this.setState({
      selectedStartDate: date
    });
  };

  getNextEntry = () => {
    const time = 1000 * 60 * 30;
    const fifteen = 1000 * 60 * 15;
    const date = new Date();
    const rounded = new Date(
      Math.round((date.getTime() + fifteen) / time) * time
    );
    return format(rounded, "H:mm MMM d, yyyy");
  };

  handleNewEntry = () => {
    const { navigation } = this.props;
    const patientID = navigation.getParam("patientID", "NO-ID");
    navigation.navigate("NewEntry", { patientID });
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
    const {
      isExpandedRecentActivity,
      minHeight,
      maxHeight,
      animation
    } = this.state;
    const initialValue = isExpandedRecentActivity
      ? maxHeight + minHeight
      : minHeight;
    const finalValue = isExpandedRecentActivity
      ? minHeight
      : maxHeight + minHeight;

    this.setState(previousState => ({
      isExpandedRecentActivity: !previousState.isExpandedRecentActivity
    }));

    animation.setValue(initialValue);
    Animated.spring(animation, {
      toValue: finalValue
    }).start();
  };

  static navigationOptions = {
    ...navigationStyles,
    title: "Resident Overview"
  };

  renderCalender = () => {
    const { isExpandedRecentActivity } = this.state;
    if (isExpandedRecentActivity) {
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

      return (
        <CalendarPicker
          onDateChange={this.onDateChange}
          customDatesStyles={customDatesStyles}
        />
      );
      // TODO: component to show existing entries when selectedStartDate
    }
    return null;
  };

  render() {
    const { navigation } = this.props;
    const { inObservation, isExpandedRecentActivity, animation } = this.state;
    const patientID = navigation.getParam("patientID", "NO-ID");
    const patientName = navigation.getParam("patientName", "Jane Doe");
    const patientRoom = "E5 6004";

    const formattedDate = this.getNextEntry();
    const observationTitle = inObservation
      ? "End Observation"
      : "Start Observation";
    const observationAction = inObservation
      ? this.handleEndObservation
      : this.handleStartObservation;

    return (
      <ScrollView style={styles.background}>
        <Card containerStyle={{ borderRadius: 4 }}>
          <View>
            <Text h3 style={{ paddingBottom: 4 }}>
              {patientName}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Avatar
                size={100}
                rounded
                source={{
                  uri:
                    "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                }}
                containerStyle={{ marginRight: 16 }}
              />
              <View>
                <Text style={styles.patientDetailsText}>
                  <Text style={{ fontWeight: "bold" }}>ID: </Text>
                  {patientID}
                </Text>
                <Text style={styles.patientDetailsText}>
                  <Text style={{ fontWeight: "bold" }}>Room #: </Text>
                  {patientRoom}
                </Text>
                <Text style={styles.patientDetailsText}>
                  <Text style={{ fontWeight: "bold" }}>Next Entry: </Text>
                  {formattedDate}
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
          <Animated.View style={{ height: animation }}>
            <View style={{ flexDirection: "row" }}>
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
                onPress={() => this.toggleRecentActivity()}
              />
            </View>
            <View>{this.renderCalender()}</View>
          </Animated.View>
        </Card>
        <Card containerStyle={{ borderRadius: 4 }}>
          <View>
            <Text h3 style={{ paddingBottom: 4 }}>
              Trends/Patterns
            </Text>
            <ColumnChart />
          </View>
        </Card>
      </ScrollView>
    );
  }
}
