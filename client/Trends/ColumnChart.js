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
import { format } from "date-fns";
import { RFValue } from "react-native-responsive-fontsize";
import BEHAVIOURS from "../NewEntry/Behaviours";
import { scaleWidth, isTablet } from "../Helpers";

type Props = {
  // label: string,
};

type State = {
  // checked: boolean,
};

const today = new Date();
const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

export default class ColumnChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      // checked: false,
    };
  }

  daysPassed = (firstDate: Date, secondDate: Date) => {
    return Math.round(
      (secondDate.getTime() - firstDate.getTime()) / (1000 * 3600 * 24)
    );
  };

  parseData = (dataset: any) => {
    const parsedData = [];

    // TODO: actually get start/end date from JSON
    const endDate = new Date();
    const startDate = new Date(new Date().setDate(endDate.getDate() - 5));

    const duration = this.daysPassed(startDate, endDate);

    Object.keys(dataset).forEach(category => {
      const categoryData = dataset[category];
      const pastDays = new Array(duration).fill(0);
      for (let i = 0; i < categoryData.length; i += 1) {
        const daysAgo = this.daysPassed(categoryData[i].time, endDate);
        if (daysAgo < duration) {
          pastDays[duration - daysAgo - 1] += categoryData[i].value;
        }
      }

      parsedData.push(
        pastDays.map<any>((day, index) => {
          const oldDate = new Date().setDate(
            endDate.getDate() - (pastDays.length - index - 1)
          );
          return {
            x: format(oldDate, "MM/dd"),
            y: day,
            color: BEHAVIOURS.get(category).color
          };
        })
      );
    });

    return parsedData;
  };

  render() {
    const exampleData = {
      b1: [{ time: today, value: 1 }, { time: yesterday, value: 1 }],
      b2: [{ time: today, value: 1 }, { time: yesterday, value: 0 }],
      b3: [{ time: today, value: 1 }, { time: yesterday, value: 1 }],
      b4: [{ time: today, value: 1 }, { time: yesterday, value: 0 }],
      b5: [{ time: today, value: 1 }, { time: yesterday, value: 1 }],
      b6: [{ time: today, value: 1 }, { time: yesterday, value: 0 }],
      b7: [{ time: today, value: 1 }, { time: yesterday, value: 0 }],
      b8: [{ time: today, value: 1 }, { time: yesterday, value: 1 }],
      b9: [{ time: today, value: 1 }, { time: yesterday, value: 0 }],
      b10: [{ time: today, value: 1 }, { time: yesterday, value: 1 }]
    };
    const parsedData = this.parseData(exampleData);

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
          padding={{ left: 44, top: 64, right: 32, bottom: 220 }}
          style={{
            parent: {
              border: "1px solid black"
            }
          }}
        >
          <VictoryLabel
            text="Observation Period Behaviour Overview"
            x={scaleWidth(0.45)}
            y={32}
            textAnchor="middle"
            style={{ fontSize: RFValue(16) }}
          />
          <VictoryStack>
            {parsedData.map(data => {
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
              axisLabel: { fontSize: RFValue(14) }
            }}
          />
          <VictoryAxis
            tickLabelComponent={<VictoryLabel angle={45} dx={16} />}
            padding={{ right: 32 }}
            style={{ tickLabels: { fontSize: RFValue(14) } }}
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
