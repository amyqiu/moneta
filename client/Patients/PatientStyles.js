import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import colours from "../Colours";
import { isTablet } from "../Helpers";

export default StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colours.backgroundGrey,
    paddingBottom: 8
  },
  buttonContainer: {
    paddingVertical: 8,
    paddingRight: 4
  },
  headerButton: {
    backgroundColor: colours.white,
    paddingVertical: 4,
    paddingHorizontal: 14
  },
  headerContainer: {
    paddingVertical: 8,
    paddingRight: 10
  },
  smallButton: {
    backgroundColor: colours.primaryGrey,
    paddingVertical: 8,
    paddingHorizontal: 14
  },
  smallButtonTitle: {
    color: colours.white,
    fontWeight: "normal",
    fontSize: RFValue(14)
  },
  headerButtonTitle: {
    color: colours.primaryGrey,
    fontWeight: "normal",
    fontSize: isTablet() ? RFValue(10) : RFValue(14)
  },
  searchInput: {
    color: colours.primaryGrey,
    fontWeight: "normal",
    fontSize: RFValue(14)
  },
  patientDetailsText: {
    fontSize: RFValue(14)
  },
  entryLink: {
    fontSize: RFValue(14),
    color: colours.link,
    textAlign: "center",
    paddingBottom: 2
  },
  entryHeader: {
    fontSize: RFValue(16),
    textAlign: "center",
    paddingBottom: 4
  },
  entrySeparator: {
    height: 1,
    width: "100%",
    backgroundColor: colours.secondaryGrey
  },
  errorText: {
    padding: 16,
    fontSize: RFValue(16)
  },
  observationButtonContainer: {
    paddingVertical: 8,
    paddingHorizontal: isTablet() ? 0 : 16
  },
  toast: {
    backgroundColor: colours.successGreen,
    opacity: 0.9,
    borderRadius: 5,
    padding: 16
  },
  toastText: {
    color: colours.white,
    fontSize: RFValue(14)
  },
  tabletCalendar: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
