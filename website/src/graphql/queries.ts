/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const game = /* GraphQL */ `
  query Game($id: ID!) {
    game(id: $id) {
      id
      name
    }
  }
`;
export const gameInstanceByRoomCode = /* GraphQL */ `
  query GameInstanceByRoomCode($roomCode: String!) {
    gameInstanceByRoomCode(roomCode: $roomCode) {
      id
      gameId
      roomCode
    }
  }
`;
export const player = /* GraphQL */ `
  query Player($id: ID!) {
    player(id: $id) {
      id
      gameInstanceId
    }
  }
`;
