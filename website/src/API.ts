/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type GameInput = {
  name: string,
};

export type GameInstanceInput = {
  gameId: string,
  roomCode: string,
};

export type PlayerInput = {
  gameInstanceId: string,
  name: string,
};

export type EventInput = {
  gameInstanceId: string,
  playerId?: string | null,
  value: string,
};

export type AddGameMutationVariables = {
  input: GameInput,
};

export type AddGameMutation = {
  addGame:  {
    __typename: "Game",
    id: string,
    name: string,
  },
};

export type AddGameInstanceMutationVariables = {
  input: GameInstanceInput,
};

export type AddGameInstanceMutation = {
  addGameInstance:  {
    __typename: "GameInstance",
    id: string,
    gameId: string,
    roomCode: string,
  },
};

export type AddPlayerMutationVariables = {
  input: PlayerInput,
};

export type AddPlayerMutation = {
  addPlayer:  {
    __typename: "Player",
    id: string,
    gameInstanceId: string,
  },
};

export type AddEventMutationVariables = {
  input: EventInput,
};

export type AddEventMutation = {
  addEvent:  {
    __typename: "Event",
    id: string,
    gameInstanceId: string,
    playerId: string | null,
    value: string,
  },
};

export type GameQueryVariables = {
  id: string,
};

export type GameQuery = {
  game:  {
    __typename: "Game",
    id: string,
    name: string,
  } | null,
};

export type GameInstanceByRoomCodeQueryVariables = {
  roomCode: string,
};

export type GameInstanceByRoomCodeQuery = {
  gameInstanceByRoomCode:  {
    __typename: "GameInstance",
    id: string,
    gameId: string,
    roomCode: string,
  } | null,
};

export type PlayerQueryVariables = {
  id: string,
};

export type PlayerQuery = {
  player:  {
    __typename: "Player",
    id: string,
    gameInstanceId: string,
  } | null,
};

export type NewPlayerSubscription = {
  newPlayer:  {
    __typename: "Player",
    id: string,
    gameInstanceId: string,
  } | null,
};
