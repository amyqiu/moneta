// @flow
import * as React from "react";
import {
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import { Card, Text, Header, CheckBox } from "react-native-elements";
import BehaviourCheckbox from "./BehaviourCheckbox";
import BEHAVIOURS from "./Behaviours";
import CONTEXTS from "./Contexts";
import LOCATIONS from "./Locations";

type Props = {};

type State = {
  checkedBehaviours: Map<string, Set<string>>,
  checkedLocations: Set<string>,
  checkedContexts: Set<string>,
  comments: string,
  time: Date
};

export default class NewEntryPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      checkedBehaviours: new Map(),
      checkedLocations: new Set(),
      checkedContexts: new Set(),
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

  render() {
    const { comments, checkedLocations, checkedContexts } = this.state;

    return (
      <KeyboardAvoidingView behavior="position">
        <ScrollView>
          <View
            style={{ flex: 1, backgroundColor: "#f4f4f4", paddingBottom: 16 }}
          >
            <Header
              backgroundColor="#393939"
              placement="left"
              leftComponent={{
                icon: "arrow-left",
                type: "feather",
                color: "#ffffff"
              }}
              centerComponent={{
                text: "New Entry",
                style: { color: "#ffffff", fontSize: 18 }
              }}
            />
            <Card containerStyle={{ borderRadius: 4 }}>
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
            <Card containerStyle={{ borderRadius: 4 }}>
              <View>
                <Text h4>Location</Text>
                {LOCATIONS.map(location => (
                  <CheckBox
                    title={location}
                    key={location}
                    checked={checkedLocations.has(location)}
                    onPress={() => this.handleLocationChecked(location)}
                    containerStyle={{
                      backgroundColor: "#ffffff",
                      borderWidth: 0,
                      padding: 0
                    }}
                    textStyle={{
                      fontSize: 16,
                      fontWeight: "normal"
                    }}
                    iconType="feather"
                    checkedIcon="check-square"
                    uncheckedIcon="square"
                    checkedColor="#525252"
                    uncheckedColor="#525252"
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
                    containerStyle={{
                      backgroundColor: "#ffffff",
                      borderWidth: 0,
                      padding: 0
                    }}
                    textStyle={{
                      fontSize: 16,
                      fontWeight: "normal"
                    }}
                    iconType="feather"
                    checkedIcon="check-square"
                    uncheckedIcon="square"
                    checkedColor="#525252"
                    uncheckedColor="#525252"
                  />
                ))}
              </View>
            </Card>
            <Card containerStyle={{ borderRadius: 4 }}>
              <View>
                <Text h4>Comments</Text>
                <TextInput
                  style={{
                    margin: 4,
                    padding: 8,
                    height: 64,
                    borderColor: "#393939",
                    borderWidth: 1,
                    borderRadius: 4,
                    backgroundColor: "#ffffff",
                    textAlignVertical: "top"
                  }}
                  onChangeText={value => this.setState({ comments: value })}
                  value={comments}
                  multiline
                  height={100}
                />
              </View>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      // TODO: Make time selector and submit button
    );
  }
}
