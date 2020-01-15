import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import colours from "../Colours";
import { isTablet } from "../Helpers";

export default StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colours.backgroundGrey
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
    color: colours.black,
    fontWeight: "normal",
    fontSize: RFValue(14)
  },
  patientDetailsText: {
    fontSize: RFValue(14)
  },
  obsDetailsText: {
    fontSize: RFValue(14),
    paddingVertical: isTablet() ? 24 : 6
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
    fontSize: RFValue(16),
    paddingBottom: isTablet() ? 12 : 4
  },
  observationButtonContainer: {
    paddingVertical: 8,
    paddingHorizontal: isTablet() ? 0 : 32,
    width: isTablet() ? 200 : "100%"
  },
  toast: {
    backgroundColor: colours.successGreen,
    opacity: 0.9,
    borderRadius: 5,
    padding: 8
  },
  toastText: {
    color: colours.white,
    fontSize: RFValue(14)
  },
  tabletCalendar: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  dropdownToggleText: {
    fontSize: RFValue(14)
  },
  dropdownChipText: {
    fontSize: RFValue(12)
  },
  dropdownConfirmText: {
    fontSize: RFValue(16)
  },
  dropdownItemText: {
    fontSize: RFValue(14)
  },
  centerContainer: {
    flexDirection: "row",
    justifyContent: "center"
  },
  viewMoreButtonContainer: {
    paddingVertical: 8,
    width: isTablet() ? "60%" : "90%"
  },
  errorContainer: {
    flexDirection: "row",
    justifyContent: "center"
  },
  observationSelect: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  observationToggle: {
    width: isTablet() ? 320 : 142,
    backgroundColor: colours.primaryGrey,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 12
  },
  observationModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16
  },
  checkBoxContainer: {
    backgroundColor: colours.white,
    borderWidth: 0,
    padding: 0
  },
  checkBoxLabel: {
    fontSize: RFValue(isTablet() ? 16 : 14),
    fontWeight: "normal",
    color: colours.black
  },
  comments: {
    margin: 4,
    padding: 8,
    borderColor: colours.primaryGrey,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: colours.white,
    textAlignVertical: "top",
    fontSize: RFValue(14)
  },
  modalButton: {
    backgroundColor: colours.actionBlue,
    paddingVertical: 8,
    paddingHorizontal: 14
  },
  modalButtonTitle: {
    color: colours.white,
    fontWeight: "normal",
    fontSize: RFValue(isTablet() ? 16 : 14)
  },
  modalCancelButton: {
    backgroundColor: colours.primaryGrey,
    paddingVertical: 8,
    paddingHorizontal: 14
  },
  modalSubHeading: {
    fontSize: RFValue(16),
    fontWeight: "bold"
  },
  obsSubHeading: {
    fontSize: RFValue(16),
    fontWeight: "bold"
  },
  obsDetails: {
    paddingVertical: isTablet() ? 6 : 2
  },
  modalHeading: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    paddingBottom: 12
  },
  modalContainer: {
    borderRadius: 4,
    backgroundColor: colours.white,
    padding: isTablet() ? 24 : 8
  },
  tableContainer: {
    backgroundColor: colours.white,
    paddingBottom: 12
  },
  tableHeader: {
    backgroundColor: colours.white
  },
  tableHeaderText: {
    margin: 6,
    fontSize: RFValue(14),
    fontWeight: "bold"
  },
  tableText: {
    margin: 6,
    fontSize: RFValue(12)
  },
  endModalView: {
    paddingBottom: 48
  },
  observationStart: {
    fontSize: RFValue(14),
    paddingBottom: 12
  },
  singleObservation: {
    paddingBottom: 8,
    paddingLeft: 18,
    alignItems: "center"
  },
  carouselContainer: {
    alignItems: "center"
  },
  carouselMainText: {
    fontSize: RFValue(16),
    fontWeight: "bold"
  },
  carouselSubText: {
    fontSize: RFValue(14),
    paddingVertical: isTablet() ? 6 : 2
  },
  carouselFootnote: {
    fontSize: RFValue(12),
    paddingTop: isTablet() ? 8 : 4,
    fontStyle: "italic"
  },
  behaviourCard: {
    borderWidth: 1,
    borderColor: colours.black,
    paddingVertical: 12,
    backgroundColor: colours.white,
    paddingHorizontal: 12,
    shadowColor: colours.black,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 4
  },
  carouselPercentage: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "baseline",
    paddingVertical: 8
  },
  occurrenceLabel: {
    fontSize: RFValue(16),
    paddingRight: 4
  },
  carouselSub: {
    paddingVertical: 12
  },
  carouselCorrelations: {
    paddingVertical: 12
  },
  selectText: {
    paddingTop: 8,
    fontSize: RFValue(16)
  }
});
