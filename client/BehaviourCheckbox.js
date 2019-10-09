// @flow
import React from "react";
import { CheckBox } from "react-native-elements";

type Props = {
  label: string
};

type State = {
  isChecked: boolean
};

export default class NewEntryPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isChecked: false
    };
  }

  render() {
    const { isChecked } = this.state;
    return <CheckBox title="Click Here" checked={isChecked} />;
  }
}
