// @flow
import React from "react";
import { View } from "react-native";
import { Button, Card, Text, Avatar, SearchBar } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";
import styles from "./style";

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

  navigateEntry = () => {
    const { navigation, patient } = this.props;
    navigation.navigate("NewEntry", { patientID: patient.id });
  };

  navigatePatient = () => {
    const { navigation, patient } = this.props;
    navigation.navigate("Patient", { patientID: patient.id });
  };

  static navigationOptions = {
    title: "Patients",
    headerStyle: {
      backgroundColor: "#393939"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "normal"
    },
    headerRight: (
      <Button
        buttonStyle={styles.headerButton}
        containerStyle={styles.headerContainer}
        title="+ Add Patient"
        titleProps={{
          style: {
            color: "#393939",
            fontWeight: "normal",
            fontSize: 14
          }
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

    const patientBubbles = [];
    function createRows(patient: Patient) {
      if (search && !patient.name.includes(search)) {
        return;
      }
      patientBubbles.push(
        <Card containerStyle={{ borderRadius: 4 }}>
          <View>
            <Text h4 style={{ paddingBottom: 4 }}>
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
                    onPress={this.navigateEntry}
                    title="+ Add Entry"
                    titleProps={{
                      style: {
                        color: "#ffffff",
                        fontWeight: "normal",
                        fontSize: 14
                      }
                    }}
                  />
                  <Button
                    buttonStyle={styles.smallButton}
                    containerStyle={styles.buttonContainer}
                    onPress={this.navigatePatient}
                    title="Overview"
                    titleProps={{
                      style: {
                        color: "#ffffff",
                        fontWeight: "normal",
                        fontSize: 14
                      }
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Card>
      );
    }
    patients.forEach(createRows);

    return (
      <View style={styles.background}>
        <SearchBar
          lightTheme
          placeholder="Search..."
          onChangeText={this.updateSearch}
          value={search}
          containerStyle={{ backgroundColor: "#393939" }}
          inputStyle={{
            color: "#393939",
            fontWeight: "normal",
            fontSize: 14
          }}
        />
        {patientBubbles}
      </View>
    );
  }
}
