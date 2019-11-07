// @flow
import * as React from "react";
import { View } from "react-native";
import { Button, Text, Avatar } from "react-native-elements";
import styles from "./PatientStyles";
import type { Patient } from "./Patient";
import { isTablet } from "../Helpers";
import colours from "../Colours";

type Props = {
  patient: Patient,
  onNavigatePatient: ?() => void,
  extraButton: React.Node,
  onAddEntry: () => void,
  observationButton: ?React.Node
};

const PatientInfo = (props: Props) => {
  const {
    patient,
    onNavigatePatient,
    extraButton,
    onAddEntry,
    observationButton
  } = props;

  const buttons = (
    <View style={{ flexDirection: "row" }}>
      <Button
        buttonStyle={styles.smallButton}
        containerStyle={styles.buttonContainer}
        onPress={onAddEntry}
        title="+ Add Entry"
        titleProps={{ style: styles.smallButtonTitle }}
        underlayColor="white"
        disabled={!patient.inObservation || patient.observations.length < 1}
        disabledStyle={{ backgroundColor: colours.disabled }}
      />
      {extraButton}
    </View>
  );

  const name = (
    <Text
      h4
      style={{ paddingBottom: 4, fontWeight: "bold" }}
      onPress={onNavigatePatient}
    >
      {patient.name}
    </Text>
  );

  const tabletHeader = (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      {name}
      {buttons}
    </View>
  );

  return (
    <View>
      {isTablet() ? tabletHeader : name}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Avatar
          size={isTablet() ? 150 : 100}
          rounded
          source={{ uri: patient.imageUri }}
          containerStyle={{ marginRight: isTablet() ? 32 : 16 }}
          onPress={onNavigatePatient}
        />
        <View>
          <Text style={styles.patientDetailsText}>
            <Text style={{ fontWeight: "bold" }}>ID: </Text>
            {patient.displayId}
          </Text>
          <Text style={styles.patientDetailsText}>
            <Text style={{ fontWeight: "bold" }}>Room #: </Text>
            {patient.room}
          </Text>
          <Text style={styles.patientDetailsText}>
            <Text style={{ fontWeight: "bold" }}>Next Entry: </Text>
            {patient.date}
          </Text>
          {isTablet() ? observationButton : buttons}
        </View>
      </View>
      {isTablet() ? null : observationButton}
    </View>
  );
};

export default PatientInfo;
