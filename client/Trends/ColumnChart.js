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
import BEHAVIOURS from "../NewEntry/Behaviours";

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

    return (
      <View pointerEvents="none">
        <VictoryChart
          height={560}
          width={330}
          domainPadding={{ x: 16, y: 16 }}
          padding={{ left: 44, top: 64, right: 32, bottom: 200 }}
          style={{
            parent: {
              border: "1px solid black"
            }
          }}
        >
          <VictoryLabel
            text="Observation Period Behaviour Overview"
            x={165}
            y={32}
            textAnchor="middle"
            style={{ fontSize: 16, fontWeight: "bold" }}
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
          <VictoryAxis dependentAxis label="Count" />
          <VictoryAxis
            tickLabelComponent={<VictoryLabel angle={45} dx={20} />}
          />
          <VictoryLegend
            x={4}
            y={430}
            data={legendData}
            itemsPerRow={5}
            gutter={12}
            symbolSpacer={8}
            padding={{ bottom: 0 }}
          />
        </VictoryChart>
      </View>
    );
  }
}
