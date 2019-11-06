// @flow

export type Patient = {
  name: string,
  id: string,
  displayId: string,
  room: string,
  imageUri: string,
  date: string,
  inObservation: boolean,
  observations: [string]
};
