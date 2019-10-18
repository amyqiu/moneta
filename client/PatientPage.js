// @flow
import React from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";

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
  static navigationOptions = {
    title: "Patient",
    headerStyle: {
      backgroundColor: "#393939"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "normal"
    }
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ padding: 16 }}>
        <Button
          onPress={() => navigation.navigate("NewEntry", { patientID: "test" })}
          title="New Entry"
          buttonStyle={{
            backgroundColor: "#393939",
            paddingVertical: 8,
            paddingHorizontal: 16
          }}
          titleProps={{
            style: {
              color: "#ffffff",
              fontWeight: "normal",
              fontSize: 18
            }
          }}
        />
      </View>
    );
  }
}
