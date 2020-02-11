// @flow
import * as React from "react";
import { Share, View, ActivityIndicator } from "react-native";
import { Text } from "react-native-elements";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import * as FileSystem from "expo-file-system";
import colours from "../Colours";
import type { Patient } from "./Patient";
import styles from "./PatientStyles";
import {
  getSecondLastObservation,
  createDropdownPeriods,
  SELECT_COLOURS,
  SELECT_ICON
} from "../Helpers";

type Props = {
  patient: Patient
};

type State = {
  isLoading: boolean,
  selectedPeriods: Array<string>,
  downloadLink: ?string
};

export default class Exporter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const lastObservation = getSecondLastObservation(props.patient);
    this.state = {
      isLoading: false,
      selectedPeriods: lastObservation ? [lastObservation] : [],
      downloadLink: null
    };
  }

  async componentDidMount() {
    this.getDownloadLink();
  }

  getSelectedObservation = () => {
    const { selectedPeriods } = this.state;
    if (selectedPeriods.length > 0) {
      return selectedPeriods[0];
    }
    return null;
  };

  handleObservationChange = async (selectedPeriods: Array<Object>) => {
    if (selectedPeriods.length > 0) {
      this.setState({ selectedPeriods });
    }
  };

  getDownloadLink = async () => {
    const observationID = this.getSelectedObservation();
    // No observation selected
    if (observationID == null) {
      return;
    }

    this.setState({ isLoading: true });

    try {
      const response = await fetch(
        `https://vast-savannah-47684.herokuapp.com/observation/generate-pdf/?id=${observationID}`
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const downloadLink = await response.text();

      this.setState({
        isLoading: false,
        downloadLink
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  openPDFLink = async () => {
    const { downloadLink } = this.state;
    const observationID = this.getSelectedObservation();

    // No observation selected
    if (observationID == null || downloadLink == null) {
      return;
    }

    FileSystem.downloadAsync(
      downloadLink,
      `${FileSystem.cacheDirectory}${observationID}.pdf`
    )
      .then(async ({ uri }) => {
        try {
          await Share.share({ url: uri });
        } catch (error) {
          console.log(error.message);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    const { patient } = this.props;
    const { isLoading, selectedPeriods, downloadLink } = this.state;

    if (patient.observations.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>No observation periods yet.</Text>
        </View>
      );
    }

    const dropdownPeriods = createDropdownPeriods(patient.observations);

    const spinner = (
      <ActivityIndicator size="large" color={colours.primaryGrey} />
    );

    const download =
      downloadLink != null ? (
        <Text>
          <Text style={styles.downloadLink} onPress={this.openPDFLink}>
            Download PDF Here
          </Text>
        </Text>
      ) : (
        <Text style={styles.errorText}>Could not generate download link.</Text>
      );

    return (
      <View style={styles.singleObservation}>
        <Text style={styles.selectText}>Select observation period:</Text>
        <SectionedMultiSelect
          items={dropdownPeriods}
          single
          uniqueKey="id"
          selectText="Select observation period"
          onSelectedItemsChange={this.handleObservationChange}
          selectedItems={selectedPeriods}
          styles={{
            selectToggle: styles.observationToggle,
            selectToggleText: styles.dropdownToggleText,
            chipText: styles.dropdownChipText,
            confirmText: styles.dropdownConfirmText,
            itemText: styles.dropdownItemText
          }}
          colors={SELECT_COLOURS}
          selectedIconComponent={SELECT_ICON}
          showCancelButton
        />
        {isLoading ? spinner : download}
      </View>
    );
  }
}
