// @flow

export type Patient = {
  name: string,
  id: string,
  displayId: string,
  room: string,
  imageUri: string,
  inObservation: boolean,
  observations: [Object]
};
