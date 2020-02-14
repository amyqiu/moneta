// @flow
import React from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { Button, Text, SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationScreenProps, NavigationEvents } from "react-navigation";
import styles from "./PatientStyles";
import navigationStyles from "../NavigationStyles";
import colours from "../Colours";
import PatientInfo from "./PatientInfo";
import type { Patient } from "./Patient";
import { parseRawPatient } from "../Helpers";

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
      const parsedPatients = json.map(parseRawPatient);
      this.setState({
        patients: parsedPatients.sort((a, b) => (a.name > b.name ? 1 : -1)),
        isLoading: false,
        isRefreshing: false,
        isError: false
      });
    } catch (error) {
      this.setState({ isError: true, isRefreshing: false, isLoading: false });
    }
  };

  updateSearch = (search: string) => {
    this.setState({ search });
  };

  navigateEntry = (params: Object) => {
    const { navigation } = this.props;
    navigation.navigate("NewEntry", params);
  };

  navigatePatient = (patient: Patient) => {
    const { navigation } = this.props;
    navigation.navigate("Patient", {
      patient,
      observationID: patient.inObservation
        ? patient.observations[patient.observations.length - 1]._id
        : null
    });
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
          title="Profile"
          titleProps={{ style: styles.smallButtonTitle }}
        />
      );
      patientBubbles.push(
        <TouchableOpacity
          key={patient.id}
          onPress={() => this.navigatePatient(patient)}
        >
          <PatientInfo
            patient={patient}
            onNavigatePatient={() => this.navigatePatient(patient)}
            extraButton={extraButton}
            onAddEntry={this.navigateEntry}
            observationButton={null}
          />
        </TouchableOpacity>
      );
    });

    return <View style={{ paddingBottom: 12 }}>{patientBubbles}</View>;
  };

  static navigationOptions = {
    ...navigationStyles,
    title: "Residents"
  };

  render() {
    const { search, patients, isLoading, isError, isRefreshing } = this.state;
    const patientRows = this.renderRows(patients);
    const spinner = (
      <View style={{ paddingTop: 8 }}>
        <ActivityIndicator size="large" color={colours.primaryGrey} />
      </View>
    );
    const error = (
      <Text style={styles.errorText}>Could not retrieve patients.</Text>
    );
    const content = isLoading ? spinner : <View>{patientRows}</View>;

    const searchIcon = (
      <Icon
        size={24}
        name="ios-search"
        style={{ color: colours.black, marginRight: 8 }}
      />
    );

    return (
      <View style={styles.background}>
        <NavigationEvents onDidFocus={this.getPatients} />
        <SearchBar
          lightTheme
          placeholder="Search..."
          placeholderTextColor={colours.black}
          onChangeText={this.updateSearch}
          value={search}
          containerStyle={styles.searchContainer}
          inputContainerStyle={{ backgroundColor: colours.white }}
          inputStyle={styles.searchInput}
          searchIcon={searchIcon}
          clearIcon={null}
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
