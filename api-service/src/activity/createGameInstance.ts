import { DynamoDB } from "aws-sdk";
import { Activity } from "./activity";
import { v4 } from "uuid";

const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const ROOM_CODE_LENGTH = 6;

export interface CreateGameInstanceActivityProps {
    dynamo: DynamoDB
    tableName: string
}

export interface CreateGameInstanceActivityInput {
    roomCode: string
}

export interface CreateGameInstanceActivityResult {
    gameInstanceId: string
}

export class CreateGameInstanceActivity extends Activity<CreateGameInstanceActivityProps> {

    async execute(input: CreateGameInstanceActivityInput): Promise<CreateGameInstanceActivityResult> {
        const gameInstanceId = v4();
        await this.props.dynamo.putItem({
            Item: {
                "id": {
                    S: gameInstanceId
                },
                "roomCode": {
                    S: input.roomCode
                }
            },
            TableName: this.props.tableName
        }).promise();

        return {
            gameInstanceId
        };
    }
}
