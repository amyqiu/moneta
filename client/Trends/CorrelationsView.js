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
  isTablet,
  scaleWidth,
  createObservationDropdown,
  SELECT_COLOURS,
  SELECT_ICON
} from "../Helpers";
import BEHAVIOURS from "../NewEntry/Behaviours";
import SUGGESTIONS from "./Suggestions";

type Props = NavigationScreenProps & {
  observations: [Object]
};

type State = {
  selectedPeriod: Array<string>,
  correlations: ?Map<string, Object>,
  observation: ?Object,
  processedBehaviours: ?Map<string, number>,
  totalOccurrences: ?number
};

export default class CorrelationsView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedPeriod: [],
      correlations: null,
      observation: null,
      processedBehaviours: null,
      totalOccurrences: null
    };
  }

  getObservationCorrelations = async (observationID: string) => {
    try {
      const response = await fetch(
        `https://vast-savannah-47684.herokuapp.com/observation/get-correlations/?id=${observationID}`
      );
      console.log(observationID);
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const results = await response.json();
      const correlations = new Map<string, Object>();
      results.forEach(correlation => {
        correlations.set(correlation.behaviour, correlation.results);
      });
      this.setState({ correlations });
    } catch (error) {
      console.log(error);
    }
  };

  getObservation = async (observationID: string) => {
    try {
      const response = await fetch(
        `https://vast-savannah-47684.herokuapp.com/observation/${observationID}`
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const observation = await response.json();

      let totalOccurrences = 0;
      const processedBehaviours = new Map<string, number>();

      BEHAVIOURS.forEach((_, behaviour) => {
        const entryData = observation.aggregated_behaviours[behaviour];
        const count = entryData.reduce((a, b) => a + b, 0);
        totalOccurrences += count;
        if (!behaviour.includes("Sleeping") && !behaviour.includes("Awake")) {
          processedBehaviours.set(behaviour, count);
        }
      });

      this.setState({ observation, totalOccurrences, processedBehaviours });
    } catch (error) {
      console.log(error);
    }
  };

  handleObservationChange = async (selectedPeriods: Array<Object>) => {
    this.setState({ selectedPeriod: selectedPeriods });
    if (selectedPeriods.length > 0) {
      // Will only be one selected period
      this.getObservationCorrelations(selectedPeriods[0]);
      this.getObservation(selectedPeriods[0]);
    }
  };

  renderCarouselItem = ({ item }: { item: string }) => {
    if (item.includes("Sleeping") || item.includes("Awake")) {
      return null;
    }

    const {
      processedBehaviours,
      totalOccurrences,
      observation,
      correlations
    } = this.state;
    if (
      processedBehaviours == null ||
      totalOccurrences == null ||
      observation == null ||
      correlations == null
    ) {
      return null;
    }

    const count = processedBehaviours.get(item) || 0;
    const percentage = totalOccurrences
      ? `${((count * 100.0) / totalOccurrences).toFixed(0)}%`
      : "0%";

    const subBehaviours = [];
    BEHAVIOURS.get(item).subBehaviours.forEach(subBehaviour => {
      if (observation.aggregated_behaviours[subBehaviour].some(c => c !== 0)) {
        subBehaviours.push(subBehaviour);
      }
    });

    const correlationResults = correlations.get(item);

    return (
      <View style={styles.behaviourCard}>
        <View style={styles.carouselContainer}>
          <Text h4>{item}</Text>
          <View style={styles.carouselPercentage}>
            <Text style={styles.occurrenceLabel}>Occurrence: </Text>
            <Text style={styles.carouselMainText}>{percentage}</Text>
          </View>
        </View>
        <View style={styles.carouselSub}>
          <Text style={styles.carouselMainText}>Sub-Behaviours:</Text>
          {subBehaviours.length > 0 ? (
            <View>
              {subBehaviours.map(subBehaviour => {
                return (
                  <Text style={styles.carouselSubText} key={subBehaviour}>
                    {subBehaviour}
                  </Text>
                );
              })}
            </View>
          ) : (
            <Text style={styles.carouselSubText}>
              No associated sub-behaviours
            </Text>
          )}
        </View>
        <View style={styles.carouselCorrelations}>
          <Text style={styles.carouselMainText}>
            Top Correlations/Suggestions:
          </Text>
          {correlationResults == null ? (
            <Text style={styles.carouselSubText}>
              Not enough data for correlations
            </Text>
          ) : (
            <View>
              {correlationResults.map(correlation => {
                return (
                  <Text
                    style={styles.carouselSubText}
                    key={correlation.trigger}
                  >
                    {`${correlation.trigger} ${correlation.coeff.toFixed(
                      2
                    )} - ${SUGGESTIONS.get(correlation.trigger)}`}
                  </Text>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  };

  static navigationOptions = {
    ...navigationStyles,
    title: "Trends"
  };

  render() {
    const { observations } = this.props;
    const { selectedPeriod, observation, processedBehaviours } = this.state;
    const items = createObservationDropdown(observations);

    const selectStyles = {
      selectToggle: styles.observationToggle,
      selectToggleText: styles.dropdownToggleText,
      chipText: styles.dropdownChipText,
      confirmText: styles.dropdownConfirmText,
      itemText: styles.dropdownItemText
    };

    return (
      <Card containerStyle={{ borderRadius: 4, paddingBottom: 12 }}>
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
        {observation == null || processedBehaviours == null ? null : (
          <View style={{ marginBottom: 4 }}>
            <Carousel
              data={Array.from(processedBehaviours.keys()).sort(
                (a, b) =>
                  (processedBehaviours.get(b) || 0) -
                  (processedBehaviours.get(a) || 0)
              )}
              renderItem={this.renderCarouselItem}
              sliderWidth={isTablet() ? scaleWidth(0.92) : scaleWidth(0.82)}
              itemWidth={isTablet() ? 480 : 250}
              removeClippedSubviews={false}
            />
          </View>
        )}
      </Card>
    );
  }
}
