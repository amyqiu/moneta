// @flow
import * as React from "react";
import { View, ScrollView } from "react-native";
import { Card, Text, CheckBox } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import BehaviourCheckbox from "./BehaviourCheckbox";
import BEHAVIOURS from "./Behaviours";
import CONTEXTS from "./Contexts";
import LOCATIONS from "./Locations";
import styles from "./NewEntryStyles";
import navigationStyles from "../NavigationStyles";
import colours from "../Colours";

type Props = NavigationScreenProps & {};

export default class OldEntryPage extends React.Component<Props, {}> {
  static navigationOptions = ({ navigation }: { navigation: Object }) => {
    return {
      ...navigationStyles,
      title: "Old Entry",
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

  render() {
    const { navigation } = this.props;
    const entry = navigation.getParam("entry");
    const entryDate = new Date(entry.time);
    const formattedDate = moment(entryDate).format("MMM D, YYYY h:mm:ss a");

    // TODO: refactor BehaviourCheckbox and make this list a shared component with NewEntry
    const behavourCheckboxes = [];
    BEHAVIOURS.forEach(behaviour => {
      behavourCheckboxes.push(
        <BehaviourCheckbox
          key={behaviour.label}
          label={behaviour.label}
          color={behaviour.color}
          subBehaviours={behaviour.subBehaviours}
          onBehaviourChecked={() => {}}
          originallyChecked={behaviour.label in entry.behaviours}
          originallyCheckedSubBehaviours={
            behaviour.label in entry.behaviours
              ? new Set(entry.behaviours[behaviour.label])
              : new Set()
          }
        />
      );
    });

    const customBehaviourEntries = new Map([
      [entry.personalized_behaviour_1_title, "Personalized Behaviour 1"],
      [entry.personalized_behaviour_2_title, "Personalized Behaviour 2"]
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
            onBehaviourChecked={() => {}}
            originallyChecked={endpointName in entry.behaviours}
          />
        );
      }
    });

    const contextCheckboxes = [];
    CONTEXTS.forEach(context =>
      contextCheckboxes.push(
        <CheckBox
          title={context}
          key={context}
          checked={entry.contexts.includes(context)}
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
      [entry.personalized_context_1_title, "Personalized Context 1"],
      [entry.personalized_context_2_title, "Personalized Context 2"]
    ]);
    customContextEntries.forEach((endpointName, context) => {
      if (context) {
        contextCheckboxes.push(
          <CheckBox
            title={context}
            key={endpointName}
            checked={entry.contexts.includes(endpointName)}
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
      <View style={styles.background}>
        <View style={styles.banner}>
          <Text style={styles.warning}>
            You are reviewing an old entry: you cannot edit this page.
          </Text>
        </View>
        <ScrollView style={{ marginBottom: 12 }}>
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
                    checked={entry.locations.includes(location)}
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
                <Text style={styles.date}>{entry.comments}</Text>
              </View>
            </Card>
            <Card containerStyle={styles.cardStyle}>
              <View>
                <Text style={{ ...styles.h4Text, paddingBottom: 4 }}>
                  Timestamp
                </Text>
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.date}>{formattedDate}</Text>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }
}
