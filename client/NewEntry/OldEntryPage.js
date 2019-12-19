// @flow
import * as React from "react";
import { View, ScrollView, KeyboardAvoidingView } from "react-native";
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

export default class NewEntryPage extends React.Component<Props, {}> {
  static navigationOptions = ({ navigation }: { navigation: Object }) => {
    return {
      ...navigationStyles,
      title: "Old Entry",
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

  render() {
    const { navigation } = this.props;
    const entry = navigation.getParam("entry");
    // TODO: replace checkedBehaviours with entry.behaviours
    const checkedBehaviours = new Map([
      ["Awake/Calm", new Set()],
      ["Restless", new Set(["Exploring/Searching"])]
    ]);
    const comment = "previously entered comment";
    const formattedDate = moment(entry.time).format("MMMM d, YYYY H:mm:ss a");

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
          originallyChecked={checkedBehaviours.has(behaviour.label)}
          originallyCheckedSubBehaviours={
            checkedBehaviours.has(behaviour.label)
              ? checkedBehaviours.get(behaviour.label)
              : new Set()
          }
        />
      );
    });

    return (
      <KeyboardAvoidingView behavior="position">
        <View style={{ backgroundColor: "#b30000" }}>
          <Text style={styles.warning}>
            You are reviewing an old entry: you cannot edit this page.
          </Text>
        </View>
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
            <Card containerStyle={{ borderRadius: 4 }}>
              <View>
                <Text h4>Context</Text>
                {CONTEXTS.map(context => (
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
                ))}
              </View>
            </Card>
            <Card containerStyle={{ borderRadius: 4 }}>
              <View>
                <Text h4>Comments</Text>
                <Text style={styles.date}>{comment}</Text>
              </View>
            </Card>
            <Card containerStyle={{ borderRadius: 4, paddingBottom: 100 }}>
              <View>
                <Text h4 style={{ paddingBottom: 4 }}>
                  Timestamp
                </Text>
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.date}>{formattedDate}</Text>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
