// @flow
import React from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";

type Props = NavigationScreenProps & {};

type State = {};

export default class AllPatientsPage extends React.Component<Props, State> {
  handlePatientNavigation = () => {
    const { navigation } = this.props;
    navigation.navigate("Patient", {
      patientID: "test",
      patientName: "Sally Jacobs"
    });
  };

  static navigationOptions = {
    title: "Patients",
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
          onPress={this.handlePatientNavigation}
          title="Test Patient 1"
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
          containerStyle={{ paddingBottom: 16 }}
        />
        <Button
          onPress={() => navigation.navigate("Patient", { patientID: "test2" })}
          title="Test Patient 2"
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
