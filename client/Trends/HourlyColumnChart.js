// @flow
import React from "react";
import { View } from "react-native";
import {
  VictoryBar,
  VictoryChart,
  VictoryStack,
  VictoryAxis,
  VictoryLabel,
  VictoryLegend
} from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import BEHAVIOURS from "../NewEntry/Behaviours";
import { scaleWidth, isTablet } from "../Helpers";

type Props = {
  graphData: Array<Array<Object>>,
  selectedBehaviours: Set<string>,
  periodStart: ?string,
  periodEnd: ?string
};

type State = {};

export default class HourlyColumnChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      graphData,
      selectedBehaviours,
      periodStart,
      periodEnd
    } = this.props;

    const legendData = [];
    BEHAVIOURS.forEach(behaviour => {
      if (selectedBehaviours.has(behaviour.label)) {
        legendData.push({
          name: behaviour.label,
          symbol: { fill: behaviour.color }
        });
      }
    });

    const width = scaleWidth(0.95);
    const height = width * (isTablet() ? 1.2 : 1.6);

    return (
      <View pointerEvents="none">
        <VictoryChart
          height={height} // 560
          width={width} // 330
          domainPadding={{ x: 32, y: 16 }}
          padding={{
            left: isTablet() ? 56 : 24,
            top: 64,
            right: 32,
            bottom: 220
          }}
          style={{
            parent: {
              border: "1px solid black"
            }
          }}
        >
          <VictoryLabel
            text="Observation Period Hourly Behaviour"
            x={scaleWidth(0.45)}
            y={32}
            textAnchor="middle"
            style={{ fontSize: RFValue(16) }}
          />
          <VictoryLabel
            text={
              periodStart && periodEnd ? `(${periodStart} - ${periodEnd})` : ""
            }
            x={scaleWidth(0.45)}
            y={isTablet() ? 56 : 48}
            textAnchor="middle"
            style={{ fontSize: RFValue(14) }}
          />
          <VictoryStack>
            {graphData.map(data => {
              return (
                <VictoryBar
                  style={{ data: { fill: data[0].color } }}
                  data={data}
                  key={data[0].color}
                  alignment="start"
                />
              );
            })}
          </VictoryStack>
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
            tickLabelComponent={
              <VictoryLabel angle={-45} dx={isTablet() ? -8 : -1} />
            }
            padding={{ right: isTablet() ? 32 : 8 }}
            style={{ tickLabels: { fontSize: RFValue(12) } }}
            tickCount={isTablet() ? 24 : 12}
            label={isTablet() ? null : "Hour"}
          />
          <VictoryLegend
            x={4}
            y={height - 150}
            data={legendData}
            itemsPerRow={isTablet() ? 3 : 2}
            gutter={isTablet() ? 20 : 4}
            symbolSpacer={isTablet() ? 12 : 8}
            padding={{ bottom: 0 }}
            style={{
              labels: { fontSize: RFValue(14) }
            }}
            orientation="horizontal"
          />
        </VictoryChart>
      </View>
    );
  }
}
