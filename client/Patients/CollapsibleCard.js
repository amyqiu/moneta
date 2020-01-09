// @flow
import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import colours from "../Colours";

type Props = {
  startExpanded: boolean,
  title: string,
  children: React.Element<any>
};

type State = {
  isExpanded: boolean
};

export default class StartObservationModal extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isExpanded: props.startExpanded
    };
  }

  toggleExpanded = () => {
    this.setState(previousState => ({
      isExpanded: !previousState.isExpanded
    }));
  };

  render() {
    const { isExpanded } = this.state;
    const { title, children } = this.props;
    return (
      <Card
        containerStyle={{
          borderRadius: 4,
          borderColor: colours.secondaryGrey,
          borderWidth: 2
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={this.toggleExpanded}
        >
          <Text h3 style={{ paddingBottom: 4 }}>
            {title}
          </Text>
          <Icon
            name={isExpanded ? "md-arrow-dropup" : "md-arrow-dropdown"}
            color={colours.primaryGrey}
            size={35}
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>
        <View style={isExpanded ? {} : { display: "none" }}>{children}</View>
      </Card>
    );
  }
}
