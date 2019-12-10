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
  graphData: Array<Array<Object>>
};

type State = {
  // checked: boolean,
};

export default class ColumnChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      // checked: false,
    };
  }

  render() {
    const { graphData } = this.props;

    const legendData = [];
    BEHAVIOURS.forEach(behaviour => {
      legendData.push({
        name: behaviour.label,
        symbol: { fill: behaviour.color }
      });
    });

    const width = scaleWidth(0.95);
    const height = width * (isTablet() ? 1.2 : 1.6);

    return (
      <View pointerEvents="none">
        <VictoryChart
          height={height} // 560
          width={width} // 330
          domainPadding={{ x: 32, y: 16 }}
          padding={{ left: 56, top: 64, right: 32, bottom: 220 }}
          style={{
            parent: {
              border: "1px solid black"
            }
          }}
        >
          <VictoryLabel
            text="Observation Period Hourly Behaviour Overview"
            x={scaleWidth(0.45)}
            y={32}
            textAnchor="middle"
            style={{ fontSize: RFValue(16) }}
          />
          <VictoryStack>
            {graphData.map(data => {
              return (
                <VictoryBar
                  style={{ data: { fill: data[0].color } }}
                  data={data}
                  key={data[0].color}
                />
              );
            })}
          </VictoryStack>
          <VictoryAxis
            dependentAxis
            label="Count"
            style={{
              tickLabels: { fontSize: RFValue(14) },
              axisLabel: { fontSize: RFValue(14), padding: 24 }
            }}
            tickFormat={t => (Math.round(t) !== t ? undefined : t)}
          />
          <VictoryAxis
            tickLabelComponent={<VictoryLabel angle={45} dx={16} />}
            padding={{ right: 32 }}
            style={{ tickLabels: { fontSize: RFValue(12) } }}
          />
          <VictoryLegend
            x={4}
            y={height - 150}
            data={legendData}
            itemsPerRow={isTablet() ? 4 : 5}
            gutter={isTablet() ? 20 : 12}
            symbolSpacer={isTablet() ? 12 : 8}
            padding={{ bottom: 0 }}
            style={{
              labels: { fontSize: RFValue(14) }
            }}
          />
        </VictoryChart>
      </View>
    );
  }
}
