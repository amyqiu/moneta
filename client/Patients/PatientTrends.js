// @flow
import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "react-native-elements";
import moment from "moment";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import HourlyColumnChart from "../Trends/HourlyColumnChart";
import BEHAVIOURS from "../NewEntry/Behaviours";
import type { Patient } from "./Patient";
import styles from "./PatientStyles";
import colours from "../Colours";
import {
  isTablet,
  createDropdownBehaviours,
  SELECT_COLOURS,
  SELECT_ICON
} from "../Helpers";

type Props = {
  patient: Patient,
  multiselect: Object,
  observationID: ?string
};

type State = {
  isLoading: boolean,
  selectedBehaviours: Array<Object>,
  aggregatedBehaviours: ?Map<string, Array<number>>,
  entryTimes: ?Array<moment>,
  observation: ?Object
};

export default class EndObservationModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
      selectedBehaviours: [...BEHAVIOURS.keys()],
      aggregatedBehaviours: null,
      entryTimes: null,
      observation: null
    };
  }

  async componentDidMount() {
    this.getTrendData();
  }

  async componentDidUpdate(prevProps: Props) {
    const { observationID } = this.props;
    if (observationID !== prevProps.observationID) {
      this.getTrendData();
    }
  }

  getTrendData = async () => {
    const { observationID } = this.props;
    // No observation selected
    if (observationID == null) {
      return;
    }

    this.setState({ isLoading: true });

    try {
      const response = await fetch(
        `https://vast-savannah-47684.herokuapp.com/observation/${observationID}`
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      const aggregatedBehaviours = new Map<string, Array<number>>();
      const selectedBehaviours = [...BEHAVIOURS.keys()];
      Object.keys(json.aggregated_behaviours).forEach(behaviour => {
        aggregatedBehaviours.set(
          behaviour,
          json.aggregated_behaviours[behaviour]
        );
      });
      if (json.personalized_behaviour_1_title) {
        selectedBehaviours.push(json.personalized_behaviour_1_title);
        aggregatedBehaviours.set(
          json.personalized_behaviour_1_title,
          json.aggregated_behaviours["Personalized Behaviour 1"]
        );
      }
      if (json.personalized_behaviour_2_title) {
        selectedBehaviours.push(json.personalized_behaviour_2_title);
        aggregatedBehaviours.set(
          json.personalized_behaviour_2_title,
          json.aggregated_behaviours["Personalized Behaviour 2"]
        );
      }
      const entryTimes = json.entry_times.map(entryTime => moment(entryTime));
      this.setState({
        isLoading: false,
        aggregatedBehaviours,
        selectedBehaviours,
        entryTimes,
        observation: json
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  processHourlyTrends = () => {
    const { aggregatedBehaviours, entryTimes, selectedBehaviours } = this.state;
    if (
      aggregatedBehaviours == null ||
      entryTimes == null ||
      entryTimes.length === 0
    ) {
      return [];
    }

    const filteredBehaviours = new Set(selectedBehaviours);

    const processedData = [];
    aggregatedBehaviours.forEach((data, behaviour) => {
      if (filteredBehaviours.has(behaviour)) {
        const hourlyData = new Array(24).fill(0);
        for (let i = 0; i < entryTimes.length; i += 1) {
          const hour = entryTimes[i].hour();
          hourlyData[hour] += data[i];
        }

        const dataPoints = [];
        for (let i = 0; i < 24; i += 1) {
          dataPoints.push({
            x: isTablet() ? `${i}h` : i,
            y: hourlyData[i],
            color: BEHAVIOURS.get(behaviour)
              ? BEHAVIOURS.get(behaviour).color
              : colours.customBlue
          });
        }
        processedData.push(dataPoints);
      }
    });
    return processedData;
  };

  handleSelectedBehavioursChange = (selectedBehaviours: Array<Object>) => {
    this.setState({ selectedBehaviours });
  };

  render() {
    const { patient, multiselect, observationID } = this.props;
    const {
      isLoading,
      aggregatedBehaviours,
      entryTimes,
      selectedBehaviours,
      observation
    } = this.state;

    if (patient.observations.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>No observation periods yet.</Text>
        </View>
      );
    }

    const processedData = this.processHourlyTrends();
    const dropdownBehaviours = createDropdownBehaviours(
      observation ? observation.personalized_behaviour_1_title : "",
      observation ? observation.personalized_behaviour_2_title : ""
    );

    let periodStart = null;
    let periodEnd = null;
    if (observationID) {
      const selectedObservation = patient.observations.find(
        o => o._id === observationID
      );
      if (selectedObservation) {
        periodStart = moment(selectedObservation.start_time);
        periodEnd = moment(selectedObservation.end_time || new Date());
      }
    }

    const spinner = (
      <ActivityIndicator size="large" color={colours.primaryGrey} />
    );

    const behaviourSelectStyle = {
      ...styles.observationToggle,
      width: isTablet() ? 420 : 180,
      borderColor: colours.actionBlue,
      borderWidth: 2
    };

    const data =
      aggregatedBehaviours == null ||
      entryTimes == null ||
      entryTimes.length === 0 ||
      observationID == null ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            No entries available for selected observation period.
          </Text>
        </View>
      ) : (
        <View>
          <SectionedMultiSelect
            items={dropdownBehaviours}
            uniqueKey="id"
            selectText="Select behaviours"
            onSelectedItemsChange={this.handleSelectedBehavioursChange}
            selectedItems={selectedBehaviours}
            hideSearch
            styles={{
              selectToggle: {
                ...behaviourSelectStyle,
                backgroundColor: colours.actionBlue
              },
              selectToggleText: styles.dropdownToggleText,
              chipText: styles.dropdownChipText,
              confirmText: styles.dropdownConfirmText,
              itemText: styles.dropdownItemText
            }}
            colors={SELECT_COLOURS}
            selectedIconComponent={SELECT_ICON}
            showCancelButton
          />
          <HourlyColumnChart
            graphData={processedData}
            selectedBehaviours={new Set(selectedBehaviours)}
            periodStart={periodStart ? periodStart.format("MMM D, YYYY") : null}
            periodEnd={periodEnd ? periodEnd.format("MMM D, YYYY") : null}
          />
        </View>
      );

    return (
      <View>
        <View style={styles.singleObservation}>{multiselect}</View>
        {observation != null ? (
          <View>
            <Text style={{ ...styles.h4Text, paddingBottom: 8 }}>Notes</Text>
            <Text style={styles.obsDetails}>
              <Text style={styles.obsSubHeading}>Starting Reasons: </Text>
              <Text style={styles.obsDetailsText}>
                {observation.reasons.length > 0
                  ? observation.reasons.join(", ")
                  : "None"}
              </Text>
            </Text>
            <Text style={styles.obsDetails}>
              <Text style={styles.obsSubHeading}>Starting Notes: </Text>
              <Text style={styles.obsDetailsText}>
                {observation.starting_notes || "None"}
              </Text>
            </Text>
            {observation.end_time ? (
              <View>
                <Text style={styles.obsDetails}>
                  <Text style={styles.obsSubHeading}>Next Steps: </Text>
                  <Text style={styles.obsDetailsText}>
                    {observation.next_steps.length > 0
                      ? observation.next_steps.join(", ")
                      : "None"}
                  </Text>
                </Text>
                <Text style={styles.obsDetails}>
                  <Text style={styles.obsSubHeading}>Ending Notes: </Text>
                  <Text style={styles.obsDetailsText}>
                    {observation.ending_notes || "None"}
                  </Text>
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
        <Text
          style={{
            ...styles.h4Text,
            paddingBottom: 8,
            paddingTop: isTablet() ? 28 : 12
          }}
        >
          Hourly Trends
        </Text>
        {isLoading ? spinner : data}
      </View>
    );
  }
}
