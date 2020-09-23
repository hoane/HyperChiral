/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type StartGameMutation = {
  startGame:  {
    __typename: "GameRoom",
    roomCode: string,
    gameInstanceId: string | null,
  },
};

export type GameRoomQueryVariables = {
  roomCode: string,
};

export type GameRoomQuery = {
  gameRoom:  {
    __typename: "GameRoom",
    roomCode: string,
    gameInstanceId: string | null,
  } | null,
};

export type GameInstanceQueryVariables = {
  id: string,
};

export type GameInstanceQuery = {
  gameInstance:  {
    __typename: "GameInstance",
    id: string,
    roomCode: string,
  } | null,
};
