// @flow
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";
import Carousel from "react-native-snap-carousel";
import navigationStyles from "../NavigationStyles";
import styles from "../Patients/PatientStyles";
import { isTablet, scaleWidth } from "../Helpers";
import BEHAVIOURS from "../NewEntry/Behaviours";
import SUGGESTIONS from "./Suggestions";

type Props = NavigationScreenProps & {
  observationID: string
};

type State = {
  correlations: ?Map<string, Object>,
  processedBehaviours: ?Map<string, number>,
  totalOccurrences: ?number,
  observation: ?Object
};

export default class CorrelationsView extends React.Component<Props, State> {
  _isMounted = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      correlations: null,
      processedBehaviours: null,
      totalOccurrences: null,
      observation: null
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    this.updateData();
  }

  async componentDidUpdate(prevProps: Props) {
    const { observationID } = this.props;
    if (observationID !== prevProps.observationID) {
      this.updateData();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateData = () => {
    const { observationID } = this.props;
    this.getObservation(observationID);
    this.getObservationCorrelations(observationID);
  };

  getAllBehaviours = () => {
    const allBehaviours = new Map<string, Object>(BEHAVIOURS);
    allBehaviours.set("Personalized Behaviour 1", { subBehaviours: [] });
    allBehaviours.set("Personalized Behaviour 2", { subBehaviours: [] });
    return allBehaviours;
  };

  getObservationCorrelations = async (observationID: string) => {
    try {
      const response = await fetch(
        `https://vast-savannah-47684.herokuapp.com/observation/get-correlations/?id=${observationID}`
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      if (this._isMounted) {
        const results = await response.json();
        const correlations = new Map<string, Object>();
        results.forEach(correlation => {
          correlations.set(correlation.behaviour, {
            results: correlation.results,
            times: correlation.times
          });
        });
        this.setState({ correlations });
      }
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
      if (this._isMounted) {
        const observation = await response.json();

        let totalOccurrences = 0;
        const processedBehaviours = new Map<string, number>();

        const allBehaviours = this.getAllBehaviours();

        allBehaviours.forEach((_, behaviour) => {
          const entryData = observation.aggregated_behaviours[behaviour];
          if (entryData == null) {
            return;
          }
          const count = entryData.reduce((a, b) => a + b, 0);
          totalOccurrences += count;
          if (!behaviour.includes("Sleeping") && !behaviour.includes("Awake")) {
            processedBehaviours.set(behaviour, count);
          }
        });

        this.setState({ totalOccurrences, processedBehaviours, observation });
      }
    } catch (error) {
      console.log(error);
    }
  };

  renderCarouselItem = ({ item }: { item: string }) => {
    if (item.includes("Sleeping") || item.includes("Awake")) {
      return null;
    }

    const { observation } = this.state;
    const { processedBehaviours, totalOccurrences, correlations } = this.state;
    if (
      processedBehaviours == null ||
      totalOccurrences == null ||
      observation == null ||
      correlations == null
    ) {
      return null;
    }

    let itemLabel = item;
    if (item === "Personalized Behaviour 1") {
      itemLabel = observation.personalized_behaviour_1_title;
    } else if (item === "Personalized Behaviour 2") {
      itemLabel = observation.personalized_behaviour_2_title;
    }

    const correlation = correlations.get(itemLabel);
    if (correlation == null) {
      return null;
    }

    const count = processedBehaviours.get(item) || 0;
    const percentage = totalOccurrences
      ? `${((count * 100.0) / totalOccurrences).toFixed(0)}%`
      : "0%";

    const allBehaviours = this.getAllBehaviours();
    const subBehaviours = [];
    const itemDetails = allBehaviours.get(item);
    if (itemDetails) {
      itemDetails.subBehaviours.forEach(subBehaviour => {
        if (
          observation.aggregated_behaviours[subBehaviour].some(c => c !== 0)
        ) {
          subBehaviours.push(subBehaviour);
        }
      });
    }

    const correlationResults = correlation.results;
    const correlationTimes = correlation.times;

    return (
      <View style={styles.behaviourCard}>
        <View style={styles.carouselContainer}>
          <Text h4>{itemLabel}</Text>
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
            Top Correlations/Suggestions*:
          </Text>
          {correlationResults == null ? (
            <Text style={styles.carouselSubText}>
              Not enough data for correlations
            </Text>
          ) : (
            <View>
              {correlationResults.map(behaviour => {
                let triggerLabel = behaviour.trigger;
                if (behaviour.trigger === "Personalized Context 1") {
                  triggerLabel = observation.personalized_context_1_title;
                } else if (behaviour.trigger === "Personalized Context 2") {
                  triggerLabel = observation.personalized_context_2_title;
                }
                return (
                  <Text style={styles.carouselSubText} key={behaviour.trigger}>
                    {`${triggerLabel} (${behaviour.coeff.toFixed(
                      2
                    )}) - ${SUGGESTIONS.get(behaviour.trigger)}`}
                  </Text>
                );
              })}
              <Text style={styles.carouselFootnote}>
                * Correlations are calculated using Pearson Coefficients and may
                not be exact. All suggestions should be reviewed by a healthcare
                professional.
              </Text>
            </View>
          )}
        </View>
        <View style={styles.carouselCorrelations}>
          <Text style={styles.carouselMainText}>Most Frequent Times:</Text>
          {correlationResults == null ? (
            <Text style={styles.carouselSubText}>
              Not enough data for frequency analysis
            </Text>
          ) : (
            <View>
              {correlationTimes.map(time => {
                return (
                  <Text style={styles.carouselSubText} key={time.value}>
                    {`${time.value}: ${time.frequency} occurrences`}
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
    const { processedBehaviours, observation, correlations } = this.state;

    return (
      <View>
        <Text h4 style={{ paddingBottom: 12 }}>
          Behaviour Correlations
        </Text>
        {observation == null ||
        processedBehaviours == null ||
        correlations == null ||
        correlations.size === 0 ? (
          <Text style={styles.carouselSubText}>
            Not enough data for correlations
          </Text>
        ) : (
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
      </View>
    );
  }
}
