// @flow
import * as React from "react";
import { View, ScrollView } from "react-native";
import { Card, Text, CheckBox } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import navigationStyles from "../NavigationStyles";
import ObservationCheckBox from "./ObservationCheckBox";
import ObservationSummaryTable from "./ObservationSummaryTable";
import styles from "./PatientStyles";
import colours from "../Colours";
import { STARTING_REASONS } from "../Helpers";

type Props = NavigationScreenProps & {};

type State = {
  observationData: ?Object
};

export default class ObservationOverview extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: { navigation: Object }) => {
    return {
      ...navigationStyles,
      title: "Observation Overview",
      headerRight: (
        <Icon
          size={24}
          name="ios-home"
          style={{ color: colours.white, marginRight: 16 }}
          onPress={() => navigation.navigate("Patient")}
        />
      )
    };
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      observationData: null
    };
  }

  async componentDidMount() {
    this.getObservation();
  }

  getObservation = async () => {
    const { navigation } = this.props;
    const observationId = navigation.getParam("observationId");
    try {
      const response = await fetch(
        `https://vast-savannah-47684.herokuapp.com/observation/${observationId}`
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const observation = await response.json();
      this.setState({
        observationData: observation
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { navigation } = this.props;
    const observationId = navigation.getParam("observationId");
    const { observationData } = this.state;
    if (observationData == null) {
      return null;
    }
    const observationReasons = new Set(observationData.reasons);

    return (
      <View style={styles.background}>
        <View style={styles.banner}>
          <Text style={styles.warning}>
            You are reviewing an old observation period: you cannot edit this
            page.
          </Text>
        </View>
        <ScrollView style={{ marginBottom: 12 }}>
          <Card containerStyle={styles.card}>
            <ObservationSummaryTable
              observationID={observationId}
              observationData={observationData}
            />
          </Card>
          <Card containerStyle={styles.card}>
            <View>
              <Text style={styles.h4Text}>Starting Reasons</Text>
              {STARTING_REASONS.map(reason => (
                <CheckBox
                  title={reason}
                  key={reason}
                  checked={observationReasons.has(reason)}
                  onPress={() => {}}
                  containerStyle={styles.checkBoxContainer}
                  textStyle={styles.checkBoxLabel}
                  iconType="feather"
                  checkedIcon="check-square"
                  uncheckedIcon="square"
                  checkedColor={colours.primaryGrey}
                  uncheckedColor={colours.primaryGrey}
                />
              ))}
            </View>
          </Card>
          <Card containerStyle={styles.card}>
            <ObservationCheckBox
              nextSteps={new Set(observationData.next_steps)}
              handleNextStepChecked={() => {}}
            />
          </Card>
          <Card containerStyle={styles.card}>
            <View>
              <Text style={styles.h4Text}>Starting Notes</Text>
              <Text style={styles.notesText}>
                {observationData.starting_notes}
              </Text>
            </View>
          </Card>
          <Card containerStyle={styles.card}>
            <View>
              <Text style={styles.h4Text}>Ending Notes</Text>
              <Text style={styles.notesText}>
                {observationData.ending_notes}
              </Text>
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }
}
