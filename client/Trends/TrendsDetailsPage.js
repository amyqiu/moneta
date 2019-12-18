// @flow
import React from "react";
import { View, ScrollView } from "react-native";
import { Text, Card } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLegend,
  VictoryGroup,
  VictoryLabel
} from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import navigationStyles from "../NavigationStyles";
import styles from "../Patients/PatientStyles";
import CorrelationsView from "./CorrelationsView";
import BEHAVIOURS from "../NewEntry/Behaviours";
import {
  scaleWidth,
  isTablet,
  formatObservationDates,
  createObservationDropdown,
  processObservationData,
  SELECT_ICON,
  SELECT_COLOURS
} from "../Helpers";

type Props = NavigationScreenProps & {};

type State = {
  firstSelectedPeriod: Array<string>,
  secondSelectedPeriod: Array<string>,
  firstObservation: ?Object,
  secondObservation: ?Object,
  firstObservationData: ?Object,
  secondObservationData: ?Object
};

export default class TrendsDetailsPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      firstSelectedPeriod: [],
      secondSelectedPeriod: [],
      firstObservation: null,
      secondObservation: null,
      firstObservationData: null,
      secondObservationData: null
    };
  }

  getObservation = async (observationID: string, isFirstPeriod: boolean) => {
    try {
      const response = await fetch(
        `https://vast-savannah-47684.herokuapp.com/observation/${observationID}`
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const observation = await response.json();
      const observationData = processObservationData(observation);
      if (isFirstPeriod) {
        this.setState({
          firstObservation: observation,
          firstObservationData: observationData
        });
      } else {
        this.setState({
          secondObservation: observation,
          secondObservationData: observationData
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

    const trends = [];
    BEHAVIOURS.forEach((_, behaviour) => {
      if (!behaviour.includes("Sleeping") && !behaviour.includes("Calm")) {
        const firstCount = firstObservationData.find(d => d.x === behaviour).y;
        const secondCount = secondObservationData.find(d => d.x === behaviour)
          .y;

        let text;
        if (firstCount === secondCount) {
          text = `○ ${behaviour}: No change`;
        } else if (firstCount === 0) {
          text = `○ ${behaviour}: ${secondCount} new occurences`;
        } else {
          const diff = (secondCount - firstCount) / (firstCount * 1.0);
          const displayDiff = Math.abs(diff * 100).toFixed(0);
          text = `○ ${behaviour}: ${displayDiff}% ${
            diff > 0 ? "increase" : "decrease"
          }`;
        }

        trends.push(
          <Text style={{ paddingBottom: 4, fontSize: RFValue(14) }} key={text}>
            {text}
          </Text>
        );
      }
    });
    return trends;
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

  static navigationOptions = {
    ...navigationStyles,
    title: "Trends"
  };

  render() {
    const {
      firstSelectedPeriod,
      secondSelectedPeriod,
      firstObservation,
      secondObservation,
      firstObservationData,
      secondObservationData
    } = this.state;
    const { navigation } = this.props;
    const patient = navigation.getParam("patient");
    const items = createObservationDropdown(patient.observations);

    const selectStyles = {
      selectToggle: styles.observationToggle,
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
        symbol: { fill: "tomato" }
      },
      {
        name: formatObservationDates(secondObservation),
        symbol: { fill: "blue" }
      }
    ];

    const barWidth = isTablet() ? 25 : 12;

    const xAxisLabel = (
      <VictoryLabel dx={isTablet() ? 0 : -20} dy={isTablet() ? 0 : -12} />
    );

    const trendChanges = this.calculateTrendChanges();

    return (
      <View style={styles.background}>
        <ScrollView>
          <Card containerStyle={{ borderRadius: 4, marginBottom: 8 }}>
            <Text h3 style={{ paddingBottom: 4 }}>
              Observation Period Comparisons
            </Text>
            <View style={styles.observationSelect}>
              <SectionedMultiSelect
                items={items}
                single
                uniqueKey="id"
                selectText="Select 1st observation period"
                onSelectedItemsChange={this.handleFirstPeriodChange}
                selectedItems={firstSelectedPeriod}
                styles={selectStyles}
                colors={SELECT_COLOURS}
                selectedIconComponent={SELECT_ICON}
              />
              <SectionedMultiSelect
                items={items}
                single
                uniqueKey="id"
                selectText="Select 2nd observation period"
                onSelectedItemsChange={this.handleSecondPeriodChange}
                selectedItems={secondSelectedPeriod}
                styles={selectStyles}
                colors={SELECT_COLOURS}
                selectedIconComponent={SELECT_ICON}
              />
            </View>
            {firstObservationData && secondObservationData ? (
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
                    colorScale={["tomato", "blue"]}
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
                        padding: isTablet() ? 6 : 2
                      },
                      axisLabel: {
                        fontSize: RFValue(isTablet() ? 14 : 12),
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
                        fontSize: RFValue(12),
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
                    style={{ labels: { fontSize: RFValue(14) } }}
                    orientation="horizontal"
                  />
                </VictoryChart>
                <Text h4 style={{ paddingBottom: isTablet() ? 16 : 8 }}>
                  Behaviour Trends
                </Text>
                <View style={{ paddingLeft: isTablet() ? 16 : 4 }}>
                  {trendChanges}
                </View>
              </View>
            ) : null}
          </Card>
          <CorrelationsView observations={patient.observations} />
        </ScrollView>
      </View>
    );
  }
}
