// @flow
import React from "react";
import { View } from "react-native";
import { Text, Card } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import Carousel from "react-native-snap-carousel";
import navigationStyles from "../NavigationStyles";
import styles from "../Patients/PatientStyles";
import {
  scaleWidth,
  createObservationDropdown,
  SELECT_COLOURS,
  SELECT_ICON
} from "../Helpers";

type Props = NavigationScreenProps & {
  observations: [Object]
};

type State = {
  selectedPeriod: Array<string>,
  correlations: ?Object
};

export default class CorrelationsView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedPeriod: [],
      correlations: null
    };
  }

  getObservation = async (observationID: string) => {
    try {
      const response = await fetch(
        `https://vast-savannah-47684.herokuapp.com/observation/get-correlations/?id=${observationID}`
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const result = await response.json();
      this.setState({ correlations: result });
    } catch (error) {
      console.log(error);
    }
  };

  handleObservationChange = async (selectedPeriods: Array<Object>) => {
    this.setState({ selectedPeriod: selectedPeriods });
    if (selectedPeriods.length > 0) {
      // Will only be one selected period
      this.getObservation(selectedPeriods[0]);
    }
  };

  renderCarouselItem = ({ item }: { item: string }) => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: "#000000",
          padding: 12,
          backgroundColor: "white"
          // shadowColor: "#000",
          // shadowOffset: { width: 1, height: 1 },
          // shadowOpacity: 0.8,
          // shadowRadius: 1
        }}
      >
        <Text h4>Verbal Expression of Risk</Text>
        <Text>{item}</Text>
      </View>
    );
  };

  static navigationOptions = {
    ...navigationStyles,
    title: "Trends"
  };

  render() {
    const { observations } = this.props;
    const { selectedPeriod } = this.state;
    const items = createObservationDropdown(observations);

    const selectStyles = {
      selectToggle: styles.observationToggle,
      selectToggleText: styles.dropdownToggleText,
      chipText: styles.dropdownChipText,
      confirmText: styles.dropdownConfirmText,
      itemText: styles.dropdownItemText
    };

    return (
      <Card containerStyle={{ borderRadius: 4, marginBottom: 8 }}>
        <Text h3 style={{ paddingBottom: 4 }}>
          Behaviour Correlations
        </Text>
        <View style={styles.singleObservation}>
          <SectionedMultiSelect
            items={items}
            single
            uniqueKey="id"
            selectText="Select observation period"
            onSelectedItemsChange={this.handleObservationChange}
            selectedItems={selectedPeriod}
            styles={selectStyles}
            colors={SELECT_COLOURS}
            selectedIconComponent={SELECT_ICON}
          />
        </View>
        <Carousel // Should only show if observation period is selected
          data={["test", "test1", "test2"]}
          renderItem={this.renderCarouselItem}
          sliderWidth={scaleWidth(0.92)}
          itemWidth={400}
          removeClippedSubviews={false}
        />
      </Card>
    );
  }
}
