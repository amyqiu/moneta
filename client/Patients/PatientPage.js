// @flow
import React from "react";
import { View } from "react-native";
import { Button, Card, Text, Avatar } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";
import { format } from "date-fns";
import styles from "./PatientStyles";
import navigationStyles from "../NavigationStyles";

type Props = NavigationScreenProps & {};

// TODO: Show how many days since observation?
type State = {
  inObservation: boolean
};

export default class PatientPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      inObservation: true
    };
  }

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

  static navigationOptions = {
    ...navigationStyles,
    title: "Patient Overview"
  };

  render() {
    const { navigation } = this.props;
    const { inObservation } = this.state;
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
      <View style={styles.background}>
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
                <Text>
                  <Text style={{ fontWeight: "bold" }}>ID: </Text>
                  {patientID}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Room #: </Text>
                  {patientRoom}
                </Text>
                <Text>
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
          <View>
            <Text h3 style={{ paddingBottom: 4 }}>
              Recent Activity
            </Text>
          </View>
        </Card>
        <Card containerStyle={{ borderRadius: 4 }}>
          <View>
            <Text h3 style={{ paddingBottom: 4 }}>
              Trends/Patterns
            </Text>
          </View>
        </Card>
      </View>
    );
  }
}
