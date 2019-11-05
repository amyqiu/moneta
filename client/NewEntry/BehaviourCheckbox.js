// @flow
import React from "react";
import { CheckBox } from "react-native-elements";
import { View } from "react-native";
import styles from "./NewEntryStyles";
import colours from "../Colours";

type Props = {
  label: string,
  color: string,
  subBehaviours: Array<string>,
  onBehaviourChecked: (string, boolean, Set<string>) => void,
  originallyChecked?: boolean,
  originallyCheckedSubBehaviours?: Set<string>
};

type State = {
  checked: boolean,
  checkedSubBehaviours: Set<string>
};

export default class BehaviourCheckbox extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      checked: false,
      checkedSubBehaviours: new Set()
    };
  }

  handleSubBehaviourChecked = (subBehaviour: string) => {
    const { checkedSubBehaviours } = this.state;
    const { onBehaviourChecked, label, originallyChecked } = this.props;

    if (originallyChecked !== null) {
      return;
    }
    const currentlyChecked = checkedSubBehaviours.has(subBehaviour);

    if (currentlyChecked) {
      checkedSubBehaviours.delete(subBehaviour);
    } else {
      checkedSubBehaviours.add(subBehaviour);
    }

    this.setState({
      checkedSubBehaviours
    });

    onBehaviourChecked(label, true, checkedSubBehaviours);
  };

  handleBehaviourChecked = () => {
    const { checked, checkedSubBehaviours } = this.state;
    const { onBehaviourChecked, label, originallyChecked } = this.props;

    if (originallyChecked !== null) {
      return;
    }
    if (checked) {
      onBehaviourChecked(label, false, new Set());
    } else {
      onBehaviourChecked(label, true, checkedSubBehaviours);
    }

    this.setState({ checked: !checked });
  };

  render() {
    const { checked, checkedSubBehaviours } = this.state;
    const {
      label,
      subBehaviours,
      color,
      originallyChecked,
      originallyCheckedSubBehaviours
    } = this.props;
    const isChecked = checked || originallyChecked;
    const allCheckedSubBehaviours = originallyChecked
      ? originallyCheckedSubBehaviours
      : checkedSubBehaviours;

    return (
      <View>
        <CheckBox
          title={label}
          checked={isChecked}
          onPress={this.handleBehaviourChecked}
          containerStyle={styles.checkBoxContainer}
          textStyle={styles.checkBoxLabel}
          iconType="feather"
          checkedIcon="check-square"
          uncheckedIcon="square"
          checkedColor={color}
          uncheckedColor={color}
        />
        {subBehaviours.length >= 1 && isChecked ? (
          <View style={styles.checkBoxRow}>
            {subBehaviours.map(subBehaviour => (
              <View key={subBehaviour} style={{ width: "50%" }}>
                <CheckBox
                  title={subBehaviour}
                  // $FlowFixMe: set is defined in defaultprops
                  checked={allCheckedSubBehaviours.has(subBehaviour)}
                  onPress={() => this.handleSubBehaviourChecked(subBehaviour)}
                  containerStyle={styles.checkBoxContainer}
                  textStyle={styles.innerCheckboxText}
                  iconType="feather"
                  checkedIcon="check-square"
                  uncheckedIcon="square"
                  checkedColor={colours.primaryGrey}
                  uncheckedColor={colours.primaryGrey}
                />
              </View>
            ))}
          </View>
        ) : null}
      </View>
    );
  }
}

// $FlowFixMe: suppressing this error because flow doesn't understand defaultprops
BehaviourCheckbox.defaultProps = {
  originallyChecked: false,
  originallyCheckedSubBehaviours: new Set()
};
