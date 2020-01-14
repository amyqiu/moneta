// @flow
import * as React from "react";
import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import { Card, Text } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import navigationStyles from "../NavigationStyles";
import ObservationCheckBox from "./ObservationCheckBox";
import ObservationSummaryTable from "./ObservationSummaryTable";
import styles from "./PatientStyles";
import colours from "../Colours";

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

    return (
      <KeyboardAvoidingView behavior="position">
        <View style={{ backgroundColor: "#b30000" }}>
          <Text style={styles.warning}>
            You are reviewing an old observation period: you cannot edit this
            page.
          </Text>
        </View>
        <ScrollView>
          <View style={styles.background}>
            <Card containerStyle={{ borderRadius: 4 }}>
              <ObservationSummaryTable
                observationID={observationId}
                observationData={observationData}
              />
            </Card>
          </View>
          <View style={styles.background}>
            <Card containerStyle={{ borderRadius: 4 }}>
              <ObservationCheckBox
                nextSteps={new Set(observationData.next_steps)}
                handleNextStepChecked={() => {}}
              />
            </Card>
          </View>
          <View style={styles.background}>
            <Card containerStyle={{ borderRadius: 4 }}>
              <View>
                <Text h4>Starting Notes</Text>
                <Text style={styles.date}>
                  {observationData.starting_notes}
                </Text>
              </View>
            </Card>
          </View>
          <View style={styles.background}>
            <Card containerStyle={{ borderRadius: 4, paddingBottom: 100 }}>
              <View>
                <Text h4>Ending Notes</Text>
                <Text style={styles.date}>{observationData.ending_notes}</Text>
              </View>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
