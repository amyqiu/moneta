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
import { NavigationScreenProps } from "react-navigation";
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
  showDatePicker: boolean
};

export default class NewEntryPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      checkedBehaviours: new Map(),
      checkedLocations: new Set(),
      checkedContexts: new Set(),
      comments: "",
      date: new Date(),
      showDatePicker: false
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
    const { navigation } = this.props;
    const patient = navigation.getParam("patient");
    const data = JSON.stringify({
      behaviours: this.mapToObject(checkedBehaviours),
      locations: Array.from(checkedLocations),
      contexts: Array.from(checkedContexts),
      comments,
      time: Math.floor(date.getTime() / 1000),
      patient_ID: patient.id,
      observation_ID: patient.observations[patient.observations.length - 1]._id
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
          navigation.navigate("Patient", { patient });
        }
      })
      .catch(error => {
        console.log("erorr", error);
      });
  };

  static navigationOptions = {
    ...navigationStyles,
    title: "New Entry"
  };

  // TODO: Do not allow timestamps before the start of the current observation period
  render() {
    const {
      comments,
      checkedLocations,
      checkedContexts,
      showDatePicker,
      date
    } = this.state;
    const formattedDate = format(date, "MMMM d, yyyy H:mm:ss a");

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

    return (
      <KeyboardAvoidingView behavior="position">
        <ScrollView>
          <View style={styles.background}>
            <Card containerStyle={{ borderRadius: 4 }}>
              <View>
                <Text h4>Behaviours Observed</Text>
                {behavourCheckboxes}
              </View>
            </Card>
            <Card containerStyle={{ borderRadius: 4 }}>
              <View>
                <Text h4>Location</Text>
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
            <Card containerStyle={{ borderRadius: 4 }}>
              <View>
                <Text h4>Context</Text>
                {CONTEXTS.map(context => (
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
                ))}
              </View>
            </Card>
            <Card containerStyle={{ borderRadius: 4 }}>
              <View>
                <Text h4>Comments</Text>
                <TextInput
                  style={styles.comments}
                  onChangeText={value => this.setState({ comments: value })}
                  value={comments}
                  multiline
                  height={100}
                />
              </View>
            </Card>
            <Card containerStyle={{ borderRadius: 4 }}>
              <View>
                <Text h4 style={{ paddingBottom: 4 }}>
                  Timestamp
                </Text>
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.date}>{formattedDate}</Text>
                  <Button
                    onPress={this.handleOpenDatePicker}
                    title="Edit Timestamp"
                    buttonStyle={{ backgroundColor: colours.primaryGrey }}
                    titleProps={{ style: styles.datePickerTitle }}
                  />
                </View>
                <DateTimePicker
                  isVisible={showDatePicker}
                  onConfirm={this.handleSetDate}
                  onCancel={this.handleCloseDatePicker}
                  mode="datetime"
                  is24Hour={false}
                />
              </View>
            </Card>
            <View style={styles.submitContainer}>
              <Button
                onPress={this.handleSubmit}
                title="Submit"
                buttonStyle={styles.submitButton}
                titleProps={{ style: styles.submitButtonTitle }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
