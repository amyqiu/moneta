// @flow
/* global __DEV__ */

import * as React from "react";
import {
  Image,
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity
} from "react-native";
import {
  NavigationScreenProps,
  StackActions,
  NavigationActions
} from "react-navigation";
import styles from "./LoginStyles";
import LoginTextInput from "./LoginTextInput";
import logo from "./assets/logo.png";

type Props = NavigationScreenProps & {};

type State = {
  username: string,
  password: string,
  usernameTouched: boolean,
  passwordTouched: boolean,
  loginError: string
};

// Based off of login screen from https://github.com/mmazzarolo/the-starter-app

export default class LoginPage extends React.Component<Props, State> {
  passwordInputRef = React.createRef<LoginTextInput>();

  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      usernameTouched: false,
      passwordTouched: false,
      loginError: ""
    };
  }

  componentDidMount() {
    if (__DEV__) {
      this.navigateAllPatients();
    }
  }

  navigateAllPatients = () => {
    const { navigation } = this.props;
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "AllPatients" })]
    });
    navigation.dispatch(resetAction);
  };

  handleUsernameChange = (username: string) => {
    this.setState({ username, loginError: "" });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password, loginError: "" });
  };

  handleUsernameSubmitPress = () => {
    if (this.passwordInputRef.current) {
      this.passwordInputRef.current.focus();
    }
  };

  handleUsernameBlur = () => {
    this.setState({ usernameTouched: true });
  };

  handlePasswordBlur = () => {
    this.setState({ passwordTouched: true });
  };

  handleLoginPress = () => {
    const { username, password } = this.state;

    if (username === "psw24" && password === "test") {
      this.navigateAllPatients();
    } else {
      this.setState({ loginError: "Incorrect username/password." });
    }
  };

  render() {
    const {
      username,
      password,
      usernameTouched,
      passwordTouched,
      loginError
    } = this.state;

    // Show the validation errors only when the inputs
    // are empty AND have been blurred at least once
    const usernameError =
      !username && usernameTouched ? "Please enter a username." : undefined;
    const passwordError =
      !password && passwordTouched ? "Please enter a password" : undefined;

    const buttonDisabled = !username || !password;
    const buttonContainerStyle = {
      ...styles.buttonContainer,
      ...(buttonDisabled
        ? styles.buttonContainerDisabled
        : styles.buttonContainerEnabled)
    };

    return (
      <KeyboardAvoidingView style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <View style={styles.form}>
          <LoginTextInput
            value={username}
            onChangeText={this.handleUsernameChange}
            onSubmitEditing={this.handleUsernameSubmitPress}
            placeholder="Username"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            autoCapitalize="none"
            onBlur={this.handleUsernameBlur}
            error={usernameError}
          />
          <LoginTextInput
            ref={this.passwordInputRef}
            value={password}
            onChangeText={this.handlePasswordChange}
            placeholder="Password"
            secureTextEntry
            returnKeyType="done"
            onBlur={this.handlePasswordBlur}
            error={passwordError}
            onSubmitEditing={this.handleLoginPress}
          />
          <Text style={styles.errorText}>{loginError}</Text>
          <TouchableOpacity
            style={buttonContainerStyle}
            onPress={this.handleLoginPress}
            disabled={buttonDisabled}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
