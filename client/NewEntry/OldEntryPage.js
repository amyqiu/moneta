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
    const formattedDate = moment(entryDate).format("MMMM Do YYYY, h:mm:ss a");

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
                <Text style={styles.date}>{entry.comments}</Text>
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
