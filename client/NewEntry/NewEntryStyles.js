import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import colours from "../Colours";

export default StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colours.backgroundGrey
  },
  checkBoxContainer: {
    backgroundColor: colours.white,
    borderWidth: 0,
    padding: 0
  },
  checkBoxLabel: {
    fontSize: RFValue(16),
    fontWeight: "normal"
  },
  comments: {
    margin: 4,
    padding: 8,
    height: 64,
    borderColor: colours.primaryGrey,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: colours.white,
    textAlignVertical: "top",
    fontSize: RFValue(14)
  },
  submitContainer: {
    paddingTop: 16,
    paddingRight: 16,
    alignItems: "flex-end"
  },
  submitButton: {
    backgroundColor: colours.primaryGrey,
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  submitButtonTitle: {
    color: colours.white,
    fontWeight: "normal",
    fontSize: RFValue(18)
  },
  checkBoxRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    paddingLeft: 12
  },
  datePickerTitle: {
    color: colours.white,
    fontWeight: "normal",
    fontSize: RFValue(16)
  },
  date: {
    fontSize: RFValue(16),
    paddingBottom: 4
  },
  innerCheckboxText: {
    fontSize: RFValue(14),
    fontWeight: "normal"
  },
  warning: {
    color: colours.white,
    fontWeight: "normal",
    fontSize: RFValue(16),
    paddingHorizontal: 4,
    paddingVertical: 8,
    textAlign: "center"
  }
});
