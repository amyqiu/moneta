// @flow
import * as React from "react";
import { View, TextInput } from "react-native";
import { Card, Text, Header } from "react-native-elements";
import BehaviourCheckbox from "./BehaviourCheckbox";

type Props = {};

type State = {
  behaviours: Set<string>,
  locations: Set<string>,
  context: Set<string>,
  comments: string,
  time: Date
};

export default class NewEntryPage extends React.Component<Props, State> {
  constructor(props: Props) {
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
    const { comments } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Header
          backgroundColor="#808080"
          placement="left"
          leftComponent={{
            icon: "arrow-left",
            type: "feather",
            color: "#fff"
          }}
          centerComponent={{
            text: "New Entry",
            style: { color: "#fff" }
          }}
        />
        <Card>
          <Text h4>Behaviours Observed</Text>
          <BehaviourCheckbox
            label="Sleeping in Bed"
            subBehaviours={["test", "test2"]}
          />
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
          onChangeText={value => this.setState({ comments: value })}
          value={comments}
          multiline
          height={100}
        />
      </View>
    );
  }
}
