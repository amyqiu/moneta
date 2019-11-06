// @flow
import React from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { Button, Card, Text, Avatar, SearchBar } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";
import { format } from "date-fns";
import styles from "./PatientStyles";
import navigationStyles from "../NavigationStyles";
import colours from "../Colours";

type Props = NavigationScreenProps & {};

type State = {
  search: string,
  patients: Array<Patient>,
  isLoading: boolean,
  isError: boolean
};

export type Patient = {
  name: string,
  id: string,
  displayId: string,
  room: string,
  imageUri: string,
  date: string,
  inObservation: boolean,
  observations: [string]
};

export default class AllPatientsPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      search: "",
      patients: [],
      isLoading: true,
      isError: false
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch(
        "https://vast-savannah-47684.herokuapp.com/patient/findall"
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      const parsedPatients = json.map(rawPatient => {
        return {
          name: rawPatient.name,
          id: rawPatient._id,
          displayId: rawPatient.patient_ID,
          room: rawPatient.room,
          imageUri: rawPatient.profile_picture,
          date: this.getNextEntry(),
          inObservation: rawPatient.in_observation,
          observations: rawPatient.observation_periods
        };
      });
      this.setState({
        patients: parsedPatients,
        isLoading: false,
        isError: false
      });
    } catch (error) {
      this.setState({ isError: true });
    }
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

  updateSearch = (search: string) => {
    this.setState({ search });
  };

  navigateEntry = (patient: Patient) => {
    const { navigation } = this.props;
    navigation.navigate("NewEntry", { patient });
  };

  navigatePatient = (patient: Patient) => {
    const { navigation } = this.props;
    navigation.navigate("Patient", { patient });
  };

  renderRows = (patients: Array<Patient>) => {
    const { search } = this.state;
    const patientBubbles = [];

    patients.forEach(patient => {
      if (
        search &&
        !patient.name.includes(search) &&
        !patient.id.includes(search)
      ) {
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
    const { search, patients, isLoading, isError } = this.state;
    const patientRows = this.renderRows(patients);
    const spinner = (
      <ActivityIndicator size="large" color={colours.primaryGrey} />
    );
    const error = (
      <Text style={styles.errorText}>Could not retrieve patients.</Text>
    );
    const content = isLoading ? spinner : patientRows;

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
        <ScrollView>{isError ? error : content}</ScrollView>
      </View>
    );
  }
}
