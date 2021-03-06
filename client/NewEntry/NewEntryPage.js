// @flow
import * as React from "react";
import {
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import { Card, Text, CheckBox, Button } from "react-native-elements";
import DateTimePicker from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/Ionicons";
import {
  NavigationScreenProps,
  StackActions,
  NavigationActions
} from "react-navigation";
import { format } from "date-fns";
import BehaviourCheckbox from "./BehaviourCheckbox";
import BEHAVIOURS from "./Behaviours";
import CONTEXTS from "./Contexts";
import LOCATIONS from "./Locations";
import styles from "./NewEntryStyles";
import navigationStyles from "../NavigationStyles";
import colours from "../Colours";

type Props = NavigationScreenProps & {};

type State = {
  checkedBehaviours: Map<string, Set<string>>,
  checkedLocations: Set<string>,
  checkedContexts: Set<string>,
  comments: string,
  date: Date,
  showDatePicker: boolean,
  isSubmitting: boolean
};

export default class NewEntryPage extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: { navigation: Object }) => {
    return {
      ...navigationStyles,
      title: "New Entry",
      headerRight: (
        <Icon
          size={24}
          name="ios-home"
          style={{ color: colours.white, marginRight: 16 }}
          onPress={() => navigation.navigate("AllPatients")}
        />
      )
    };
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      checkedBehaviours: new Map(),
      checkedLocations: new Set(),
      checkedContexts: new Set(),
      comments: "",
      date: new Date(),
      showDatePicker: false,
      isSubmitting: false
    };
  }

  onBehaviourChecked = (
    behaviour: string,
    checked: boolean,
    subBehaviours: Set<string>
  ) => {
    const { checkedBehaviours } = this.state;

    if (checked) {
      checkedBehaviours.set(behaviour, subBehaviours);
    } else if (checkedBehaviours.has(behaviour)) {
      checkedBehaviours.delete(behaviour);
    }

    this.setState({ checkedBehaviours });
  };

  handleLocationChecked = (location: string) => {
    const { checkedLocations } = this.state;

    if (checkedLocations.has(location)) {
      checkedLocations.delete(location);
    } else {
      checkedLocations.add(location);
    }

    this.setState({ checkedLocations });
  };

  handleContextChecked = (context: string) => {
    const { checkedContexts } = this.state;

    if (checkedContexts.has(context)) {
      checkedContexts.delete(context);
    } else {
      checkedContexts.add(context);
    }

    this.setState({ checkedContexts });
  };

  handleSetDate = (inputDate: Date) => {
    const { date } = this.state;
    const newDate = inputDate || date;

    this.setState({
      showDatePicker: false,
      date: newDate
    });
  };

  handleOpenDatePicker = () => {
    this.setState({
      showDatePicker: true
    });
  };

  handleCloseDatePicker = () => {
    this.setState({
      showDatePicker: false
    });
  };

  mapToObject = (map: Map<string, Set<string>>) => {
    const obj = Object.create(null);
    map.forEach((entry, key) => {
      obj[key] = Array.from(entry);
    });
    return obj;
  };

  handleSubmit = () => {
    const {
      checkedBehaviours,
      checkedLocations,
      checkedContexts,
      comments,
      date
    } = this.state;
    this.setState({
      isSubmitting: true
    });
    const { navigation } = this.props;
    const patient = navigation.getParam("patient");
    const observationID =
      patient.observations[patient.observations.length - 1]._id;
    const data = JSON.stringify({
      behaviours: this.mapToObject(checkedBehaviours),
      locations: Array.from(checkedLocations),
      contexts: Array.from(checkedContexts),
      comments,
      time: Math.floor(date.getTime() / 1000),
      patient_ID: patient.id,
      observation_ID: observationID
    });
    fetch("https://vast-savannah-47684.herokuapp.com/entry/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: data
    })
      .then(response => {
        if (response.ok) {
          this.setState({
            isSubmitting: false
          });
          const resetAction = StackActions.reset({
            index: 1,
            actions: [
              NavigationActions.navigate({ routeName: "AllPatients" }),
              NavigationActions.navigate({
                routeName: "Patient",
                params: { patient, showSubmitEntryToast: true }
              })
            ]
          });
          navigation.dispatch(resetAction);
        } else {
          console.log(response);
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  render() {
    const {
      comments,
      checkedLocations,
      checkedContexts,
      showDatePicker,
      date,
      isSubmitting
    } = this.state;
    const { navigation } = this.props;
    const lastEntryTime = navigation.getParam("lastEntryTime");
    const patient = navigation.getParam("patient");

    const formattedDate = format(date, "MMM d, yyyy h:mm:ss a");

    const behavourCheckboxes = [];
    BEHAVIOURS.forEach(behaviour => {
      behavourCheckboxes.push(
        <BehaviourCheckbox
          key={behaviour.label}
          label={behaviour.label}
          color={behaviour.color}
          subBehaviours={behaviour.subBehaviours}
          onBehaviourChecked={this.onBehaviourChecked}
          originallyChecked={null}
        />
      );
    });

    const customBehaviourEntries = new Map([
      [
        patient.observations[patient.observations.length - 1]
          .personalized_behaviour_1_title,
        "Personalized Behaviour 1"
      ],
      [
        patient.observations[patient.observations.length - 1]
          .personalized_behaviour_2_title,
        "Personalized Behaviour 2"
      ]
    ]);
    customBehaviourEntries.forEach((endpointName, behaviour) => {
      if (behaviour) {
        behavourCheckboxes.push(
          <BehaviourCheckbox
            key={endpointName}
            label={behaviour}
            endpointLabel={endpointName}
            color={colours.customBlue}
            subBehaviours={[]}
            onBehaviourChecked={this.onBehaviourChecked}
            originallyChecked={null}
          />
        );
      }
    });

    const contextCheckboxes = [];
    CONTEXTS.map(context =>
      contextCheckboxes.push(
        <CheckBox
          title={context}
          key={context}
          checked={checkedContexts.has(context)}
          onPress={() => this.handleContextChecked(context)}
          containerStyle={styles.checkBoxContainer}
          textStyle={styles.checkBoxLabel}
          iconType="feather"
          checkedIcon="check-square"
          uncheckedIcon="square"
          checkedColor={colours.primaryGrey}
          uncheckedColor={colours.primaryGrey}
        />
      )
    );

    const customContextEntries = new Map([
      [
        patient.observations[patient.observations.length - 1]
          .personalized_context_1_title,
        "Personalized Context 1"
      ],
      [
        patient.observations[patient.observations.length - 1]
          .personalized_context_2_title,
        "Personalized Context 2"
      ]
    ]);
    customContextEntries.forEach((endpointName, context) => {
      if (context) {
        contextCheckboxes.push(
          <CheckBox
            title={context}
            key={endpointName}
            checked={checkedContexts.has(endpointName)}
            onPress={() => this.handleContextChecked(endpointName)}
            containerStyle={styles.checkBoxContainer}
            textStyle={styles.checkBoxLabel}
            iconType="feather"
            checkedIcon="check-square"
            uncheckedIcon="square"
            checkedColor={colours.primaryGrey}
            uncheckedColor={colours.primaryGrey}
          />
        );
      }
    });

    return (
      <KeyboardAvoidingView behavior="position" style={styles.background}>
        <ScrollView>
          <View style={{ paddingBottom: 12 }}>
            <Card containerStyle={styles.cardStyle}>
              <View>
                <Text style={styles.h4Text}>Behaviours Observed</Text>
                {behavourCheckboxes}
              </View>
            </Card>
            <Card containerStyle={styles.cardStyle}>
              <View>
                <Text style={styles.h4Text}>Location</Text>
                {LOCATIONS.map(location => (
                  <CheckBox
                    title={location}
                    key={location}
                    checked={checkedLocations.has(location)}
                    onPress={() => this.handleLocationChecked(location)}
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
            <Card containerStyle={styles.cardStyle}>
              <View>
                <Text style={styles.h4Text}>Context</Text>
                {contextCheckboxes}
              </View>
            </Card>
            <Card containerStyle={styles.cardStyle}>
              <View>
                <Text style={styles.h4Text}>Comments</Text>
                <TextInput
                  style={styles.comments}
                  onChangeText={value => this.setState({ comments: value })}
                  value={comments}
                  multiline
                  height={100}
                />
              </View>
            </Card>
            <Card containerStyle={styles.cardStyle}>
              <View>
                <Text style={styles.h4Text}>Timestamp</Text>
                <View style={{ alignItems: "center", paddingTop: 4 }}>
                  <Text style={styles.date}>{formattedDate}</Text>
                  <Button
                    onPress={this.handleOpenDatePicker}
                    title="Edit Timestamp"
                    buttonStyle={styles.dateButton}
                    titleProps={{ style: styles.datePickerTitle }}
                  />
                </View>
                <DateTimePicker
                  isVisible={showDatePicker}
                  onConfirm={this.handleSetDate}
                  onCancel={this.handleCloseDatePicker}
                  mode="datetime"
                  is24Hour={false}
                  minimumDate={new Date(lastEntryTime)}
                  date={new Date()}
                />
              </View>
            </Card>
            <View style={styles.submitContainer}>
              <Button
                onPress={this.handleSubmit}
                title="Submit"
                buttonStyle={styles.dateButton}
                titleProps={{ style: styles.submitButtonTitle }}
                loading={isSubmitting}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
