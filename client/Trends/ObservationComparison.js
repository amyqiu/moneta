// @flow
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "react-native-elements";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLegend,
  VictoryGroup,
  VictoryLabel
} from "victory-native";
import { Table, Row, Rows } from "react-native-table-component";
import { RFValue } from "react-native-responsive-fontsize";
import styles from "../Patients/PatientStyles";
import type { Patient } from "../Patients/Patient";
import BEHAVIOURS from "../NewEntry/Behaviours";
import colours from "../Colours";
import {
  scaleWidth,
  isTablet,
  formatObservationDates,
  createDropdownPeriods,
  processObservationData,
  getLastObservation,
  getSecondLastObservation,
  SELECT_ICON,
  SELECT_COLOURS
} from "../Helpers";

type Props = {
  patient: Patient
};

type State = {
  firstSelectedPeriod: Array<string>,
  secondSelectedPeriod: Array<string>,
  firstObservation: ?Object,
  secondObservation: ?Object,
  firstObservationData: ?Object,
  secondObservationData: ?Object,
  isLoading: boolean
};

export default class ObservationComparison extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    const lastPeriod = getSecondLastObservation(props.patient);
    const secondLastPeriod = getLastObservation(props.patient);
    this.state = {
      firstSelectedPeriod: [lastPeriod],
      secondSelectedPeriod: [secondLastPeriod],
      firstObservation: null,
      secondObservation: null,
      firstObservationData: null,
      secondObservationData: null,
      isLoading: false
    };
  }

  async componentDidMount() {
    const { patient } = this.props;
    const lastPeriod = getSecondLastObservation(patient);
    const secondLastPeriod = getLastObservation(patient);
    if (lastPeriod != null && secondLastPeriod != null) {
      this.handleFirstPeriodChange([lastPeriod]);
      this.handleSecondPeriodChange([secondLastPeriod]);
    }
  }

  getObservation = async (observationID: string, isFirstPeriod: boolean) => {
    this.setState({ isLoading: true });
    try {
      const response = await fetch(
        `https://vast-savannah-47684.herokuapp.com/observation/${observationID}`
      );
      if (!response.ok) {
        console.log(response);
        throw Error(response.statusText);
      }
      const observation = await response.json();
      const observationData = processObservationData(observation);
      if (isFirstPeriod) {
        this.setState({
          firstObservation: observation,
          firstObservationData: observationData,
          isLoading: false
        });
      } else {
        this.setState({
          secondObservation: observation,
          secondObservationData: observationData,
          isLoading: false
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  calculateTrendChanges = () => {
    const { firstObservationData, secondObservationData } = this.state;
    if (firstObservationData == null || secondObservationData == null) {
      return null;
    }

    const data = [];
    BEHAVIOURS.forEach((_, behaviour) => {
      if (!behaviour.includes("Sleeping") && !behaviour.includes("Calm")) {
        const firstCount = firstObservationData.find(d => d.x === behaviour).y;
        const secondCount = secondObservationData.find(d => d.x === behaviour)
          .y;

        let text;
        if (firstCount === secondCount) {
          text = "No change";
        } else if (firstCount === 0) {
          text = `${secondCount} new occurences`;
        } else {
          const diff = (secondCount - firstCount) / (firstCount * 1.0);
          const displayDiff = Math.abs(diff * 100).toFixed(0);
          text = `${displayDiff}% ${diff > 0 ? "increase" : "decrease"}`;
        }

        data.push([behaviour, text]);
      }
    });

    return (
      <Table borderStyle={{ borderWidth: 1, borderColor: colours.primaryGrey }}>
        <Row
          data={["Behaviour", "Trend"]}
          style={styles.tableHeader}
          textStyle={styles.tableHeaderText}
        />
        <Rows data={data} textStyle={styles.tableText} />
      </Table>
    );
  };

  handleFirstPeriodChange = async (selectedPeriods: Array<Object>) => {
    this.setState({ firstSelectedPeriod: selectedPeriods });
    if (selectedPeriods.length > 0) {
      // Will only be one selected period
      this.getObservation(selectedPeriods[0], true);
    }
  };

  handleSecondPeriodChange = async (selectedPeriods: Array<Object>) => {
    this.setState({ secondSelectedPeriod: selectedPeriods });
    if (selectedPeriods.length > 0) {
      // Will only be one selected period
      this.getObservation(selectedPeriods[0], false);
    }
  };

  render() {
    const {
      firstSelectedPeriod,
      secondSelectedPeriod,
      firstObservation,
      secondObservation,
      firstObservationData,
      secondObservationData,
      isLoading
    } = this.state;
    const { patient } = this.props;
    const items = createDropdownPeriods(patient.observations);

    const selectStyles = {
      selectToggleText: styles.dropdownToggleText,
      chipText: styles.dropdownChipText,
      confirmText: styles.dropdownConfirmText,
      itemText: styles.dropdownItemText
    };

    const width = scaleWidth(0.95);
    const height = width * (isTablet() ? 1 : 1.6);

    const legendData = [
      {
        name: formatObservationDates(firstObservation),
        symbol: { fill: colours.compareRed }
      },
      {
        name: formatObservationDates(secondObservation),
        symbol: { fill: colours.compareBlue }
      }
    ];

    const barWidth = isTablet() ? 24 : 12;

    const xAxisLabel = (
      <VictoryLabel dx={isTablet() ? 0 : -20} dy={isTablet() ? 0 : -12} />
    );

    const trendChanges = this.calculateTrendChanges();

    if (!firstObservation || !secondObservation) {
      if (isLoading) {
        return <ActivityIndicator size="large" color={colours.primaryGrey} />;
      }
      return (
        <View style={styles.comparisonErrorContainer}>
          <Text style={styles.errorComparisonText}>
            Not enough observation periods for comparison.
          </Text>
        </View>
      );
    }

    return (
      <View style={{ paddingBottom: 12 }}>
        <View style={styles.observationSelect}>
          <View>
            <Text style={styles.selectText}>
              {isTablet() ? "1st Observation Period:" : "1st Period:"}
            </Text>
            <SectionedMultiSelect
              items={items}
              single
              uniqueKey="id"
              selectText="Select 1st observation period"
              onSelectedItemsChange={this.handleFirstPeriodChange}
              selectedItems={firstSelectedPeriod}
              styles={{
                ...selectStyles,
                selectToggle: {
                  ...styles.observationToggle,
                  backgroundColor: colours.compareRed
                }
              }}
              colors={SELECT_COLOURS}
              selectedIconComponent={SELECT_ICON}
              showCancelButton
            />
          </View>
          <View>
            <Text style={styles.selectText}>
              {isTablet() ? "2nd Observation Period:" : "2nd Period:"}
            </Text>
            <SectionedMultiSelect
              items={items}
              single
              uniqueKey="id"
              selectText="Select 2nd observation period"
              onSelectedItemsChange={this.handleSecondPeriodChange}
              selectedItems={secondSelectedPeriod}
              styles={{
                ...selectStyles,
                selectToggle: {
                  ...styles.observationToggle,
                  backgroundColor: colours.compareBlue
                }
              }}
              colors={SELECT_COLOURS}
              selectedIconComponent={SELECT_ICON}
              showCancelButton
            />
          </View>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color={colours.primaryGrey} />
        ) : (
          <View pointerEvents="none">
            <VictoryChart
              height={height}
              width={width}
              domainPadding={{ x: barWidth, y: 16 }}
              padding={{
                left: isTablet() ? 56 : 24,
                top: 12,
                right: 32,
                bottom: 120
              }}
              style={{ parent: { border: "1px solid black" } }}
            >
              <VictoryGroup
                colorScale={[colours.compareRed, colours.compareBlue]}
                offset={barWidth}
              >
                <VictoryBar
                  data={firstObservationData}
                  key="observation_1"
                  barWidth={barWidth}
                />
                <VictoryBar
                  data={secondObservationData}
                  key="observation_2"
                  barWidth={barWidth}
                />
              </VictoryGroup>
              <VictoryAxis
                dependentAxis
                label="Count"
                style={{
                  tickLabels: {
                    fontSize: RFValue(isTablet() ? 14 : 12),
                    fontFamily: "Arial",
                    padding: isTablet() ? 4 : 2
                  },
                  axisLabel: {
                    fontSize: RFValue(isTablet() ? 14 : 12),
                    fontFamily: "Arial",
                    padding: isTablet() ? 24 : 12
                  }
                }}
                tickFormat={t => (Math.round(t) !== t ? undefined : t)}
              />
              <VictoryAxis
                tickLabelComponent={xAxisLabel}
                tickFormat={t => t.split(" ").filter(c => c !== "-")}
                style={{
                  tickLabels: {
                    fontSize: RFValue(11),
                    fontFamily: "Arial",
                    angle: isTablet() ? 0 : -90
                  }
                }}
              />
              <VictoryLegend
                x={16}
                y={height - 50}
                gutter={64}
                data={legendData}
                itemsPerRow={isTablet() ? 2 : 1}
                symbolSpacer={isTablet() ? 12 : 8}
                padding={{ bottom: 0 }}
                style={{
                  labels: { fontSize: RFValue(14), fontFamily: "Arial" }
                }}
                orientation="horizontal"
              />
            </VictoryChart>
            <Text
              style={{ ...styles.h4Text, paddingVertical: isTablet() ? 16 : 8 }}
            >
              Behaviour Trends
            </Text>
            <View style={{ paddingLeft: isTablet() ? 16 : 4 }}>
              {trendChanges}
            </View>
          </View>
        )}
      </View>
    );
  }
}
