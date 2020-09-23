/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const gameRoom = /* GraphQL */ `
  query GameRoom($roomCode: String!) {
    gameRoom(roomCode: $roomCode) {
      roomCode
      gameInstanceId
    }
  }
`;
export const gameInstance = /* GraphQL */ `
  query GameInstance($id: ID!) {
    gameInstance(id: $id) {
      id
      roomCode
    }
  }
`;
