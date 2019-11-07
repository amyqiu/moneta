// @flow
import React from "react";
import { FlatList, View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import styles from "./PatientStyles";
import type { Patient } from "./Patient";
import { scaleWidth, isTablet } from "../Helpers";

type Props = {
  patient: Patient,
  onNavigateOldEntry: (entryID: string) => void
};

type State = {
  selectedStartDate: ?moment
};

export default class Calendar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedStartDate: null
    };
  }

  onDateChange = (date: Date) => {
    this.setState({
      selectedStartDate: date
    });
  };

  navigateOldEntry = (entryID: string) => {
    const { onNavigateOldEntry } = this.props;
    onNavigateOldEntry(entryID);
  };

  render() {
    const { selectedStartDate } = this.state;
    // TODO: replace with entries within month
    const today = new Date();
    const existingDates = [
      new Date(today.setDate(today.getDate() - 1)),
      new Date(today.setDate(today.getDate() - 6)),
      new Date(today.setDate(today.getDate() + 5))
    ];
    const customDatesStyles = [];
    existingDates.forEach(day => {
      customDatesStyles.push({
        date: day,
        style: { backgroundColor: "#ccffee" }
      });
    });

    let existingTimesList = null;
    if (selectedStartDate) {
      // TODO: replace with query for available times on this day
      const timelist = [moment(), moment(), moment()];
      timelist[0].add(5, "hours");
      timelist[1].add(3, "hours");

      const formattedDay = selectedStartDate.format("LL");
      const data = [];
      timelist.forEach(timestamp => {
        const formattedTime = timestamp.format("HH:mm A");
        data.push({ key: formattedTime, entryID: 12345 });
      });

      existingTimesList = (
        <FlatList
          key="data"
          data={data}
          ItemSeparatorComponent={() => <View style={styles.entrySeparator} />}
          ListHeaderComponent={() => (
            <Text style={styles.entryHeader} key={formattedDay}>
              {formattedDay}
            </Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => this.navigateOldEntry(item.entryID)}
            >
              <Text style={styles.entryLink}>{item.key}</Text>
            </TouchableOpacity>
          )}
        />
      );
    }

    const calendar = (
      <View style={{ marginBottom: -32 }}>
        <CalendarPicker
          onDateChange={this.onDateChange}
          customDatesStyles={customDatesStyles}
          width={scaleWidth(isTablet() ? 0.64 : 0.9)}
        />
      </View>
    );

    const entries = (
      <View>
        <ScrollView style={{ flexGrow: 0 }}>{existingTimesList}</ScrollView>
      </View>
    );

    return (
      <View style={isTablet() ? styles.tabletCalendar : {}}>
        {calendar}
        {entries}
      </View>
    );
  }
}
