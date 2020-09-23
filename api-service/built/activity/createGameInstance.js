"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGameInstanceActivity = void 0;
const activity_1 = require("./activity");
const uuid_1 = require("uuid");
const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const ROOM_CODE_LENGTH = 6;
class CreateGameInstanceActivity extends activity_1.Activity {
    async execute(input) {
        const gameInstanceId = uuid_1.v4();
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
exports.CreateGameInstanceActivity = CreateGameInstanceActivity;
//# sourceMappingURL=createGameInstance.js.map