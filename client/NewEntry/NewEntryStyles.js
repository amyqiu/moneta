import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import colours from "../Colours";

export default StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingBottom: 16
  },
  checkBoxContainer: {
    backgroundColor: "#ffffff",
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
    borderColor: "#393939",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    textAlignVertical: "top",
    fontSize: RFValue(14)
  },
  submitContainer: {
    paddingTop: 16,
    paddingRight: 16,
    alignItems: "flex-end"
  },
  submitButton: {
    backgroundColor: "#393939",
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  submitButtonTitle: {
    color: "#ffffff",
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
  }
});
