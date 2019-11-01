import { Dimensions } from "react-native";

export function scaleWidth(percent: number) {
  const deviceWidth = Dimensions.get("window").width;
  return deviceWidth * percent;
}

export function isTablet() {
  const deviceWidth = Dimensions.get("window").width;
  return deviceWidth > 700;
}
