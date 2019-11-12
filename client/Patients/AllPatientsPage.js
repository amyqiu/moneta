// @flow
import React from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { Button, Card, Text, SearchBar } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";
import { format } from "date-fns";
import styles from "./PatientStyles";
import navigationStyles from "../NavigationStyles";
import colours from "../Colours";
import PatientInfo from "./PatientInfo";
import type { Patient } from "./Patient";

type Props = NavigationScreenProps & {};

type State = {
  search: string,
  patients: Array<Patient>,
  isLoading: boolean,
  isError: boolean,
  isRefreshing: boolean
};

export default class AllPatientsPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      search: "",
      patients: [],
      isLoading: true,
      isError: false,
      isRefreshing: false
    };
  }

  async componentDidMount() {
    this.getPatients();
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true });
    this.getPatients();
  };

  getPatients = async () => {
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
          displayId: rawPatient.display_ID,
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
        isRefreshing: false,
        isError: false
      });
    } catch (error) {
      this.setState({ isError: true, isRefreshing: false, isLoading: false });
    }
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
        !patient.displayId.includes(search)
      ) {
        return;
      }
      const extraButton = (
        <Button
          buttonStyle={styles.smallButton}
          containerStyle={styles.buttonContainer}
          onPress={() => this.navigatePatient(patient)}
          title="Overview"
          titleProps={{ style: styles.smallButtonTitle }}
        />
      );
      patientBubbles.push(
        <TouchableOpacity
          key={patient.id}
          onPress={() => this.navigatePatient(patient)}
        >
          <Card containerStyle={{ borderRadius: 4 }}>
            <PatientInfo
              patient={patient}
              onNavigatePatient={() => this.navigatePatient(patient)}
              extraButton={extraButton}
              onAddEntry={() => this.navigateEntry(patient)}
              observationButton={null}
            />
          </Card>
        </TouchableOpacity>
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
    const { search, patients, isLoading, isError, isRefreshing } = this.state;
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
        <ScrollView>
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={this.onRefresh}
            enabled
          />
          {isError ? error : content}
        </ScrollView>
      </View>
    );
  }
}
