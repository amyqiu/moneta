// @flow
import React from "react";
import { CheckBox } from "react-native-elements";
import { View } from "react-native";

// TODO: add handlers for when behaviours are checked
type Props = {
  label: string,
  subBehaviours: Array<string>
};

type State = {
  checked: boolean,
  subBehavioursChecked: Map<string, boolean>
};

export default class BehaviourCheckbox extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      checked: false,
      subBehavioursChecked: new Map(props.subBehaviours.map(b => [b, false]))
    };
  }

  onSubBehaviourChecked(subBehaviour: string) {
    const { subBehavioursChecked } = this.state;
    const currentlyChecked = subBehavioursChecked.get(subBehaviour);
    this.setState({
      subBehavioursChecked: subBehavioursChecked.set(
        subBehaviour,
        !currentlyChecked
      )
    });
  }

  render() {
    const { checked, subBehavioursChecked } = this.state;
    const { label, subBehaviours } = this.props;

    return (
      <View>
        <CheckBox
          title={label}
          checked={checked}
          onPress={() => this.setState({ checked: !checked })}
          containerStyle={{ backgroundColor: "#fff", borderWidth: 0 }}
        />
        {subBehaviours.length >= 1 && checked ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "flex-start",
              paddingLeft: 30
            }}
          >
            {subBehaviours.map(subBehaviour => (
              <View
                key={subBehaviour}
                style={{
                  width: "50%"
                }}
              >
                <CheckBox
                  title={subBehaviour}
                  checked={subBehavioursChecked.get(subBehaviour)}
                  onPress={() => this.onSubBehaviourChecked(subBehaviour)}
                  containerStyle={{ backgroundColor: "#fff", borderWidth: 0 }}
                />
              </View>
            ))}
          </View>
        ) : null}
      </View>
    );
  }
}
