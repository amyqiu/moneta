// @flow
import React from "react";
import { View } from "react-native";
import { VictoryPie } from "victory-native";
import BEHAVIOURS from "../NewEntry/Behaviours";
import { scaleWidth } from "../Helpers";

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

  parseData = (dataset: any) => {
    const parsedData = [];

    Object.keys(dataset).forEach(category => {
      const categoryData = dataset[category];
      let categoryOccurance = 0;
      for (let i = 0; i < categoryData.length; i += 1) {
        categoryOccurance += categoryData[i].value;
      }

      parsedData.push({
        x: " ", // BEHAVIOURS.get(category).label,
        y: categoryOccurance
      });
    });

    return parsedData;
  };

  render() {
    const exampleData = {
      b1: [{ time: today, value: 1 }, { time: yesterday, value: 1 }],
      b2: [{ time: today, value: 1 }, { time: yesterday, value: 1 }],
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

    const width = scaleWidth(0.7);
    const innerRadius = width / 2;
    const color = [];

    Object.keys(exampleData).forEach(category => {
      color.push(BEHAVIOURS.get(category).color);
    });

    return (
      <View
        pointerEvents="none"
        style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        <VictoryPie
          height={width} // 560
          width={width} // 330
          labelRadius={({ radius }) => radius - 5}
          innerRadius={innerRadius}
          colorScale={color}
          data={parsedData}
        />
      </View>
    );
  }
}
