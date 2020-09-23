import {AWSError, DynamoDB} from "aws-sdk";
import { Activity } from "./activity";
import {UpdateItemInput} from "aws-sdk/clients/dynamodb";
import {CreateGameInstanceActivity} from "./createGameInstance";

const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const ROOM_CODE_LENGTH = 6;

export interface StartGameActivityProps {
    createGameInstance: CreateGameInstanceActivity
    dynamo: DynamoDB
    tableName: string
}

export interface StartGameActivityResult {
    roomCode: string
    gameInstanceId: string
}

export class StartGameActivity extends Activity<StartGameActivityProps> {

    async createRoom(): Promise<string> {
        for (let retry = 0; retry < 3; retry++) {
            try {
                const roomCode = this.newRoomCode();
                await this.props.dynamo.putItem({
                    Item: {
                        "roomCode": {
                            S: roomCode
                        }
                    },
                    TableName: this.props.tableName,
                    ConditionExpression: "attribute_not_exists(roomCode)"
                }).promise();
                return roomCode;
            } catch (e) {
                // add handler
            }
        }
        throw new Error("Could not create room");
    }

    async attachGameInstanceToRoom(roomCode: string, gameInstanceId: string): Promise<void> {
        await this.props.dynamo.updateItem({
            Key: {
                "roomCode": {
                    S: roomCode
                }
            },
            ExpressionAttributeNames: {
                "#GII": "gameInstanceId"
            },
            ExpressionAttributeValues: {
                ":g": {
                    S: gameInstanceId
                }
            },
            UpdateExpression: "SET #GII = :g",
            TableName: this.props.tableName
        }).promise();
    }

    async execute(): Promise<StartGameActivityResult> {
        const roomCode = await this.createRoom();
        const { gameInstanceId } = await this.props.createGameInstance.execute({ roomCode });
        await this.attachGameInstanceToRoom(roomCode, gameInstanceId);

        return {
            roomCode,
            gameInstanceId
        };
    }

    newRoomCode(): string {
        return Array.from(new Array(ROOM_CODE_LENGTH), _ => {
            ROOM_CODE_CHARS.charAt(Math.floor(Math.random() * ROOM_CODE_CHARS.length))
        }).join();
    }
}
