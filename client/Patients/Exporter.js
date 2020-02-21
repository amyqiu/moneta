// @flow
import * as React from "react";
import { Share, View, ActivityIndicator } from "react-native";
import { Text } from "react-native-elements";
import * as FileSystem from "expo-file-system";
import colours from "../Colours";
import styles from "./PatientStyles";

type Props = {
  multiselect: Object,
  observationID: ?string
};

type State = {
  isLoading: boolean,
  downloadLink: ?string
};

export default class Exporter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
      downloadLink: null
    };
  }

  async componentDidMount() {
    this.getDownloadLink();
  }

  async componentDidUpdate(prevProps: Props) {
    const { observationID } = this.props;
    if (observationID !== prevProps.observationID) {
      this.getDownloadLink();
    }
  }

  getDownloadLink = async () => {
    const { observationID } = this.props;
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
    const { observationID } = this.props;
    console.log("download link:");
    console.log(downloadLink);

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
    const { multiselect } = this.props;
    const { isLoading, downloadLink } = this.state;

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
        {multiselect}
        {isLoading ? spinner : download}
      </View>
    );
  }
}
