// @flow
import React from "react";
import { View } from "react-native";
import { Button, Card, Text, Avatar } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";
import { format } from "date-fns";
import styles from "./style";

type Props = NavigationScreenProps & {};

type State = {};

export default class PatientPage extends React.Component<Props, State> {
  getNextEntry = () => {
    const time = 1000 * 60 * 30;
    const fifteen = 1000 * 60 * 15;
    const date = new Date();
    const rounded = new Date(
      Math.round((date.getTime() + fifteen) / time) * time
    );
    return format(rounded, "H:mm MMM d, yyyy");
  };

  handleNewEntry = () => {
    const { navigation } = this.props;
    const patientID = navigation.getParam("patientID", "NO-ID");
    navigation.navigate("NewEntry", { patientID });
  };

  static navigationOptions = {
    title: "Patient Overview",
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
    const patientID = navigation.getParam("patientID", "NO-ID");
    const patientName = navigation.getParam("patientName", "Jane Doe");
    const patientRoom = "E5 6004";

    const formattedDate = this.getNextEntry();

    return (
      <View style={styles.background}>
        <Card containerStyle={{ borderRadius: 4 }}>
          <View>
            <Text h3 style={{ paddingBottom: 4 }}>
              {patientName}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Avatar
                size={100}
                rounded
                source={{
                  uri:
                    "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                }}
                containerStyle={{ marginRight: 16 }}
              />
              <View>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>ID: </Text>
                  {patientID}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Room #: </Text>
                  {patientRoom}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Next Entry: </Text>
                  {formattedDate}
                </Text>
                <Button
                  onPress={this.handleNewEntry}
                  title="+ Add Entry"
                  buttonStyle={styles.smallButton}
                  containerStyle={styles.buttonContainer}
                  titleProps={{
                    style: {
                      color: "#ffffff",
                      fontWeight: "normal",
                      fontSize: 18
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </Card>
        <Card containerStyle={{ borderRadius: 4 }}>
          <View>
            <Text h3 style={{ paddingBottom: 4 }}>
              Recent Activity
            </Text>
          </View>
        </Card>
      </View>
    );
  }
}
