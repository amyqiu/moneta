// @flow
import * as React from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { Table, Row, Rows } from "react-native-table-component";
import moment from "moment";
import styles from "./PatientStyles";
import BEHAVIOURS from "../NewEntry/Behaviours";

type Props = {
  observationID: string,
  observationData: ?Object
};

type State = {
  observationData: ?Object
};

const TABLE_HEADER = [
  "Behaviour",
  "Total 1/2\nHour Blocks",
  "Average Hours\nPer Day"
];

export default class ObservationSummaryTable extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      observationData: null
    };
  }

  async componentDidMount() {
    this.getObservation();
  }

  getObservation = async () => {
    const { observationID, observationData } = this.props;
    if (observationData != null) {
      this.setState({
        observationData
      });
      return;
    }
    try {
      const response = await fetch(
        `https://vast-savannah-47684.herokuapp.com/observation/${observationID}`
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const observation = await response.json();
      this.setState({
        observationData: observation
      });
    } catch (error) {
      console.log(error);
    }
  };

  generateTableData = (observationData: Object, daysPassed: number) => {
    const data = [];
    BEHAVIOURS.forEach((_, behaviour) => {
      const occurrences = observationData.aggregated_behaviours[
        behaviour
      ].reduce((a, b) => a + b, 0);
      const averageOccurrences = daysPassed
        ? ((occurrences * 0.5) / daysPassed).toFixed(2)
        : "N/A";
      data.push([behaviour, occurrences, averageOccurrences]);
    });

    const customBehaviourEntries = new Map([
      [
        observationData.personalized_behaviour_1_title,
        "Personalized Behaviour 1"
      ],
      [
        observationData.personalized_behaviour_2_title,
        "Personalized Behaviour 2"
      ]
    ]);
    customBehaviourEntries.forEach((endpointName, behaviour) => {
      if (behaviour) {
        const occurrences = observationData.aggregated_behaviours[
          endpointName
        ].reduce((a, b) => a + b, 0);
        const averageOccurrences = daysPassed
          ? ((occurrences * 0.5) / daysPassed).toFixed(2)
          : "N/A";
        data.push([behaviour, occurrences, averageOccurrences]);
      }
    });

    return data;
  };

  render() {
    const { observationData } = this.state;
    if (observationData == null) {
      return null;
    }

    const startDate = moment(observationData.start_time);
    const daysPassed = Math.round(moment().diff(startDate, "days", true));
    const tableData = this.generateTableData(observationData, daysPassed);

    return (
      <View style={styles.tableContainer}>
        <Text style={styles.observationStart}>
          {`Observation Started: ${startDate.format(
            "MMM D, YYYY"
          )} (${daysPassed} days)`}
        </Text>
        <Table borderStyle={{ borderWidth: 1 }}>
          <Row
            data={TABLE_HEADER}
            style={styles.tableHeader}
            textStyle={styles.tableHeaderText}
          />
          <Rows data={tableData} textStyle={styles.tableText} />
        </Table>
      </View>
    );
  }
}
