import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { Card, Button, Icon, Text, Header, Input } from "react-native-elements";

export default class NewEntryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      behaviours: new Set(),
      locations: new Set(),
      context: new Set(),
      comments: "",
      time: new Date()
    };
  }

  render() {
    return (
      <View>
        <Header
          backgroundColor="#808080"
          placement="left"
          leftComponent={{
            icon: "arrow-left",
            type: "feather",
            color: "#fff"
          }}
          centerComponent={{ text: "New Entry", style: { color: "#fff" } }}
        />
        <Card>
          <Text h4>Behaviours Observed</Text>
        </Card>
        <Card>
          <Text h4>Location</Text>
        </Card>
        <Card>
          <Text h4>Context</Text>
        </Card>
        <TextInput
          style={{
            margin: 15,
            padding: 8,
            height: 40,
            borderColor: "#d3d3d3",
            borderWidth: 1
          }}
          onChangeText={comments => this.setState({ comments })}
          value={this.state.comments}
          multiline={true}
          height={100}
        />
      </View>
    );
  }
}
