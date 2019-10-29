// @flow
import React from "react";
import { View } from "react-native";
import { Button, Card, Text, Avatar, SearchBar } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";
import styles from "./PatientStyles";
import navigationStyles from "../NavigationStyles";
import colours from "../Colours";

type Props = NavigationScreenProps & {};

type State = { search: string };

type Patient = {
  name: string,
  id: string,
  room: string,
  imageUri: string,
  date: string
};

export default class AllPatientsPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      search: ""
    };
  }

  updateSearch = (search: string) => {
    this.setState({ search });
  };

  navigateEntry = (patient: Patient) => {
    const { navigation } = this.props;
    navigation.navigate("NewEntry", { patientID: patient.id });
  };

  navigatePatient = (patient: Patient) => {
    const { navigation } = this.props;
    navigation.navigate("Patient", { patientID: patient.id });
  };

  renderRows = (patients: Array<Patient>) => {
    const { search } = this.state;
    const patientBubbles = [];

    patients.forEach(patient => {
      if (search && !patient.name.includes(search)) {
        return;
      }
      patientBubbles.push(
        <Card key={patient.id} containerStyle={{ borderRadius: 4 }}>
          <View>
            <Text
              h4
              style={{ paddingBottom: 4 }}
              onPress={() => this.navigatePatient(patient)}
            >
              {patient.name}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Avatar
                size={100}
                rounded
                source={{ uri: patient.imageUri }}
                containerStyle={{ marginRight: 16 }}
                onPress={() => this.navigatePatient(patient)}
              />
              <View>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>ID: </Text>
                  {patient.id}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Room #: </Text>
                  {patient.room}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Next Entry: </Text>
                  {patient.date}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Button
                    buttonStyle={styles.smallButton}
                    containerStyle={styles.buttonContainer}
                    onPress={() => this.navigateEntry(patient)}
                    title="+ Add Entry"
                    titleProps={{ style: styles.smallButtonTitle }}
                  />
                  <Button
                    buttonStyle={styles.smallButton}
                    containerStyle={styles.buttonContainer}
                    onPress={() => this.navigatePatient(patient)}
                    title="Overview"
                    titleProps={{ style: styles.smallButtonTitle }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Card>
      );
    });

    return patientBubbles;
  };

  static navigationOptions = {
    ...navigationStyles,
    title: "Residents",
    headerRight: (
      <Button
        buttonStyle={styles.headerButton}
        containerStyle={styles.headerContainer}
        title="+ Add Resident"
        titleProps={{
          style: styles.headerButtonTitle
        }}
      />
    )
  };

  render() {
    const { search } = this.state;
    // replace this with loaded data
    const patients: Array<Patient> = [];
    patients.push({
      name: "Ivysaur Bulbasaur",
      id: "test",
      room: "E5 6004",
      imageUri:
        "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
      date: "14:30 Oct 19, 2019"
    });
    patients.push({
      name: "Squirtle Wartortle",
      id: "test2",
      room: "E5 6004",
      imageUri:
        "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
      date: "14:30 Oct 19, 2019"
    });

    const patientRows = this.renderRows(patients);

    return (
      <View style={styles.background}>
        <SearchBar
          lightTheme
          placeholder="Search..."
          onChangeText={this.updateSearch}
          value={search}
          containerStyle={{ backgroundColor: colours.primaryGrey }}
          inputStyle={styles.searchInput}
        />
        {patientRows}
      </View>
    );
  }
}
