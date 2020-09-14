/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addGame = /* GraphQL */ `
  mutation AddGame($input: GameInput!) {
    addGame(input: $input) {
      id
      name
    }
  }
`;
export const addGameInstance = /* GraphQL */ `
  mutation AddGameInstance($input: GameInstanceInput!) {
    addGameInstance(input: $input) {
      id
      gameId
      roomCode
    }
  }
`;
export const addPlayer = /* GraphQL */ `
  mutation AddPlayer($input: PlayerInput!) {
    addPlayer(input: $input) {
      id
      gameInstanceId
    }
  }
`;
export const addEvent = /* GraphQL */ `
  mutation AddEvent($input: EventInput!) {
    addEvent(input: $input) {
      id
      gameInstanceId
      playerId
      value
    }
  }
`;
