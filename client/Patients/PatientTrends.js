// @flow
import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "react-native-elements";
import moment from "moment";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import HourlyColumnChart from "../Trends/HourlyColumnChart";
import CorrelationsView from "../Trends/CorrelationsView";
import BEHAVIOURS from "../NewEntry/Behaviours";
import type { Patient } from "./Patient";
import styles from "./PatientStyles";
import colours from "../Colours";
import {
  isTablet,
  getLastObservation,
  createDropdownPeriods,
  createDropdownBehaviours,
  SELECT_COLOURS,
  SELECT_ICON
} from "../Helpers";

type Props = {
  patient: Patient
};

type State = {
  isLoading: boolean,
  selectedBehaviours: Array<Object>,
  selectedPeriods: Array<string>,
  aggregatedBehaviours: ?Map<string, Array<number>>,
  entryTimes: ?Array<moment>
};

export default class EndObservationModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const lastObservation = getLastObservation(props.patient);
    this.state = {
      isLoading: false,
      selectedBehaviours: [...BEHAVIOURS.keys()],
      selectedPeriods: lastObservation ? [lastObservation] : [],
      aggregatedBehaviours: null,
      entryTimes: null
    };
  }

  async componentDidMount() {
    this.getTrendData();
  }

  getSelectedObservation = () => {
    const { selectedPeriods } = this.state;
    if (selectedPeriods.length > 0) {
      return selectedPeriods[0];
    }
    return null;
  };

  getTrendData = async () => {
    const observationID = this.getSelectedObservation();
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
      Object.keys(json.aggregated_behaviours).forEach(behaviour => {
        aggregatedBehaviours.set(
          behaviour,
          json.aggregated_behaviours[behaviour]
        );
      });
      const entryTimes = json.entry_times.map(entryTime => moment(entryTime));
      this.setState({
        isLoading: false,
        aggregatedBehaviours,
        entryTimes
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
            color: BEHAVIOURS.get(behaviour).color
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

  handleObservationChange = async (selectedPeriods: Array<Object>) => {
    if (selectedPeriods.length > 0) {
      this.setState({ selectedPeriods }, this.getTrendData);
    }
  };

  render() {
    const { patient } = this.props;
    const { isLoading, selectedBehaviours, selectedPeriods } = this.state;

    const processedData = this.processHourlyTrends();
    const dropdownBehaviours = createDropdownBehaviours();
    const dropdownPeriods = createDropdownPeriods(patient.observations);
    const selectedObservationID = this.getSelectedObservation();

    let periodStart = null;
    let periodEnd = null;
    if (selectedObservationID) {
      const selectedObservation = patient.observations.find(
        o => o._id === selectedObservationID
      );
      if (selectedObservation) {
        periodStart = moment(selectedObservation.start_time);
        periodEnd = moment(selectedObservation.end_time);
      }
    }

    const spinner = (
      <ActivityIndicator size="large" color={colours.primaryGrey} />
    );

    const data =
      processedData.length === 0 || selectedObservationID == null ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            No entries available for selected observation period.
          </Text>
        </View>
      ) : (
        <View>
          <Text h4 style={{ paddingTop: 12 }}>
            Hourly Trends
          </Text>
          <SectionedMultiSelect
            items={dropdownBehaviours}
            uniqueKey="id"
            selectText="Select behaviours"
            onSelectedItemsChange={this.handleSelectedBehavioursChange}
            selectedItems={selectedBehaviours}
            hideSearch
            styles={{
              selectToggleText: styles.dropdownToggleText,
              chipText: styles.dropdownChipText,
              confirmText: styles.dropdownConfirmText,
              itemText: styles.dropdownItemText
            }}
            colors={SELECT_COLOURS}
            selectedIconComponent={SELECT_ICON}
          />
          <HourlyColumnChart
            graphData={processedData}
            selectedBehaviours={new Set(selectedBehaviours)}
            periodStart={periodStart ? periodStart.format("MMM D, YYYY") : null}
            periodEnd={periodEnd ? periodEnd.format("MMM D, YYYY") : null}
          />
          <View style={{ paddingTop: 8 }}>
            <CorrelationsView observationID={selectedObservationID} />
          </View>
        </View>
      );

    return (
      <View>
        <View style={styles.singleObservation}>
          <View style={styles.centerContainer}>
            <Text style={styles.selectText}>Select observation period:</Text>
          </View>
          <SectionedMultiSelect
            items={dropdownPeriods}
            single
            uniqueKey="id"
            selectText="Select observation period"
            onSelectedItemsChange={this.handleObservationChange}
            selectedItems={selectedPeriods}
            styles={{
              selectToggle: styles.observationToggle,
              selectToggleText: styles.dropdownToggleText,
              chipText: styles.dropdownChipText,
              confirmText: styles.dropdownConfirmText,
              itemText: styles.dropdownItemText
            }}
            colors={SELECT_COLOURS}
            selectedIconComponent={SELECT_ICON}
          />
        </View>
        {isLoading ? spinner : data}
      </View>
    );
  }
}
