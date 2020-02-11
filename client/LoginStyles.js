import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import colours from "./Colours";
import { isTablet } from "./Helpers";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.white,
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    width: "30%",
    height: "30%",
    resizeMode: "center"
  },
  form: {
    width: isTablet() ? "50%" : "75%"
  },
  background: {
    flex: 1,
    padding: 18,
    justifyContent: "center",
    alignItems: "center"
  },
  textContainer: {
    marginBottom: 10
  },
  textInput: {
    height: 50,
    fontSize: RFValue(14),
    borderColor: colours.primaryGrey,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  errorText: {
    height: 30,
    fontSize: RFValue(14),
    color: colours.errorRed
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colours.actionBlue,
    marginTop: isTablet() ? 48 : 24,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colours.secondaryGrey
  },
  buttonContainerEnabled: {
    opacity: 1
  },
  buttonContainerDisabled: {
    opacity: 0.3
  },
  buttonText: {
    color: colours.white,
    textAlign: "center",
    fontSize: RFValue(16)
  }
});
