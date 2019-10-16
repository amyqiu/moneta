// @flow
import * as React from "react";
import { View, TextInput, ScrollView } from "react-native";
import { Card, Text, Header } from "react-native-elements";
import BehaviourCheckbox from "./BehaviourCheckbox";
import BEHAVIOURS from "./Behaviours";

type Props = {};

type State = {
  checkedBehaviours: Map<string, Set<string>>,
  locations: Set<string>,
  context: Set<string>,
  comments: string,
  time: Date
};

export default class NewEntryPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      checkedBehaviours: new Map(),
      locations: new Set(),
      context: new Set(),
      comments: "",
      time: new Date()
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

  render() {
    const { comments } = this.state;

    return (
      <ScrollView>
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
            <View>
              <Text h4>Behaviours Observed</Text>
              {BEHAVIOURS.map(behaviour => (
                <BehaviourCheckbox
                  key={behaviour.label}
                  label={behaviour.label}
                  color={behaviour.color}
                  subBehaviours={behaviour.subBehaviours}
                  onBehaviourChecked={this.onBehaviourChecked}
                />
              ))}
            </View>
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
      </ScrollView>
    );
  }
}
