import { RFValue } from "react-native-responsive-fontsize";
import { isTablet } from "./Helpers";

export default {
  headerStyle: {
    backgroundColor: "#393939"
  },
  headerTintColor: "#ffffff",
  headerTitleStyle: {
    fontWeight: "normal",
    fontSize: isTablet() ? RFValue(14) : RFValue(16)
  }
};
