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
    paddingHorizontal: 16
  },
  headerContainer: {
    paddingVertical: 8,
    paddingRight: 12
  },
  smallButton: {
    backgroundColor: colours.actionBlue,
    paddingVertical: 8,
    paddingHorizontal: isTablet() ? 16 : 8,
    shadowColor: colours.black,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.24,
    shadowRadius: 4.8,
    elevation: 6
  },
  smallButtonTitle: {
    color: colours.white,
    fontWeight: "normal",
    fontSize: isTablet() ? RFValue(16) : RFValue(14)
  },
  headerButtonTitle: {
    color: colours.primaryGrey,
    fontWeight: "normal",
    fontSize: isTablet() ? RFValue(16) : RFValue(12)
  },
  searchInput: {
    color: colours.primaryGrey,
    fontWeight: "normal",
    fontSize: RFValue(14)
  },
  patientDetailsText: {
    fontSize: isTablet() ? RFValue(16) : RFValue(14),
    paddingVertical: 4
  },
  patientLabelText: {
    fontSize: isTablet() ? RFValue(16) : RFValue(14),
    fontWeight: "600",
    paddingVertical: 4
  },
  obsDetailsText: {
    fontSize: isTablet() ? RFValue(16) : RFValue(14),
    paddingVertical: isTablet() ? 24 : 4
  },
  entryLink: {
    fontSize: RFValue(14),
    color: colours.link,
    textAlign: "center",
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center"
  },
  entryHeader: {
    fontSize: isTablet() ? RFValue(16) : RFValue(14),
    textAlign: "center",
    paddingVertical: 8
  },
  entrySeparator: {
    height: 1,
    width: "100%",
    backgroundColor: colours.secondaryGrey
  },
  entryItem: {
    flex: 1,
    flexDirection: "column",
    margin: 1
  },
  errorText: {
    fontSize: isTablet() ? RFValue(16) : RFValue(14),
    paddingBottom: isTablet() ? 12 : 4,
    paddingTop: 4
  },
  errorComparisonText: {
    fontSize: isTablet() ? RFValue(16) : RFValue(14),
    paddingTop: isTablet() ? 8 : 4
  },
  observationButtonContainer: {
    paddingVertical: 8,
    paddingHorizontal: isTablet() ? 0 : 12,
    width: isTablet() ? 240 : "100%"
  },
  toast: {
    backgroundColor: colours.successGreen,
    opacity: 0.9,
    borderRadius: 4,
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
    fontSize: RFValue(14)
  },
  dropdownConfirmText: {
    fontSize: isTablet() ? RFValue(16) : RFValue(14)
  },
  dropdownItemText: {
    fontSize: RFValue(14)
  },
  notesText: {
    fontSize: RFValue(14),
    paddingTop: 12
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
  comparisonErrorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: isTablet() ? 12 : 4
  },
  observationSelect: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  observationToggle: {
    width: isTablet() ? 320 : 142,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 12,
    borderRadius: 4,
    shadowColor: colours.black,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.24,
    shadowRadius: 4.8,
    elevation: 6
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
    borderColor: colours.secondaryGrey,
    borderWidth: 2,
    borderRadius: 4,
    backgroundColor: colours.white,
    textAlignVertical: "top",
    fontSize: RFValue(14),
    flex: 1
  },
  modalButton: {
    backgroundColor: colours.actionBlue,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: colours.black,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.24,
    shadowRadius: 4.8,
    elevation: 6
  },
  modalButtonTitle: {
    color: colours.white,
    fontWeight: "normal",
    fontSize: RFValue(isTablet() ? 16 : 14)
  },
  modalCancelButton: {
    backgroundColor: colours.primaryGrey,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: colours.black,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.24,
    shadowRadius: 4.8,
    elevation: 6
  },
  modalSubHeading: {
    fontSize: RFValue(20)
  },
  startModalSubHeading: {
    fontSize: RFValue(20),
    paddingTop: 12,
    paddingBottom: 8
  },
  obsSubHeading: {
    fontSize: isTablet() ? RFValue(16) : RFValue(14),
    fontWeight: "600",
    paddingVertical: 4
  },
  obsDetails: {
    paddingVertical: isTablet() ? 6 : 2
  },
  modalHeading: {
    fontSize: RFValue(20),
    paddingBottom: 12
  },
  modalContainer: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colours.secondaryGrey,
    backgroundColor: colours.white,
    shadowColor: colours.black,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.24,
    shadowRadius: 4.8,
    elevation: 6,
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
    margin: 8,
    fontSize: isTablet() ? RFValue(16) : RFValue(14)
  },
  tableText: {
    margin: 8,
    fontSize: RFValue(14)
  },
  endModalView: {
    paddingBottom: 48
  },
  observationStart: {
    fontSize: isTablet() ? RFValue(16) : RFValue(14),
    paddingBottom: 12
  },
  singleObservation: {
    paddingBottom: 12,
    paddingLeft: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  carouselContainer: {
    alignItems: "center"
  },
  carouselMainText: {
    fontSize: isTablet() ? RFValue(16) : RFValue(14),
    fontWeight: "600",
    paddingVertical: 4
  },
  carouselSubText: {
    fontSize: RFValue(14),
    paddingVertical: isTablet() ? 8 : 2
  },
  carouselFootnote: {
    fontSize: RFValue(14),
    paddingTop: isTablet() ? 8 : 4,
    fontStyle: "italic"
  },
  behaviourCard: {
    borderWidth: 2,
    borderColor: colours.secondaryGrey,
    borderRadius: 4,
    paddingVertical: 12,
    backgroundColor: colours.white,
    paddingHorizontal: isTablet() ? 20 : 8,
    shadowColor: colours.black,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.24,
    shadowRadius: 4.8,
    elevation: 6
  },
  carouselPercentage: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "baseline",
    paddingVertical: 8
  },
  occurrenceLabel: {
    fontSize: isTablet() ? RFValue(16) : RFValue(14),
    paddingRight: 4,
    paddingVertical: 4
  },
  carouselSub: {
    paddingVertical: 12
  },
  carouselCorrelations: {
    paddingVertical: 12
  },
  selectText: {
    paddingTop: 8,
    fontSize: isTablet() ? RFValue(16) : RFValue(14)
  },
  downloadText: {
    fontSize: isTablet() ? RFValue(16) : RFValue(14),
    fontWeight: "600",
    paddingBottom: 12
  },
  downloadLink: {
    color: colours.link,
    fontSize: isTablet() ? RFValue(16) : RFValue(14),
    textDecorationLine: "underline"
  },
  warning: {
    color: colours.white,
    fontWeight: "normal",
    fontSize: isTablet() ? RFValue(16) : RFValue(14),
    paddingHorizontal: 4,
    paddingVertical: 8,
    textAlign: "center"
  },
  h2Text: {
    fontSize: RFValue(36)
  },
  h3Text: {
    fontSize: RFValue(24)
  },
  h4Text: {
    fontSize: RFValue(20)
  },
  card: {
    borderRadius: 4,
    shadowColor: colours.black,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.24,
    shadowRadius: 4.8,
    elevation: 6,
    borderColor: colours.secondaryGrey,
    borderWidth: 2
  },
  avatar: {
    shadowColor: colours.black,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.24,
    shadowRadius: 4.8,
    elevation: 6,
    marginRight: isTablet() ? 32 : 12
  },
  banner: {
    backgroundColor: colours.errorRed,
    shadowColor: colours.black,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.24,
    shadowRadius: 4.8,
    elevation: 6
  },
  searchContainer: {
    backgroundColor: colours.white,
    shadowColor: colours.black,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.24,
    shadowRadius: 4.8,
    elevation: 6
  }
});
