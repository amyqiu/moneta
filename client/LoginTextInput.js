// @flow
import * as React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import styles from "./LoginStyles";
import colours from "./Colours";

type Props = TextInputProps & {
  error?: string
};

export default class LoginTextInput extends React.Component<Props> {
  textInputRef = React.createRef<TextInput>();

  focus = () => {
    if (this.textInputRef.current) {
      this.textInputRef.current.focus();
    }
  };

  render() {
    const { error, style, ...otherProps } = this.props;
    return (
      <View style={[styles.textContainer, style]}>
        <TextInput
          ref={this.textInputRef}
          selectionColor={colours.activeBlue}
          style={styles.textInput}
          {...otherProps}
        />
        <Text style={styles.errorText}>{error || ""}</Text>
      </View>
    );
  }
}
