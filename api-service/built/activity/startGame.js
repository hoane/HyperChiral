"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartGameActivity = void 0;
const activity_1 = require("./activity");
const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const ROOM_CODE_LENGTH = 6;
class StartGameActivity extends activity_1.Activity {
    async createRoom() {
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
            }
            catch (e) {
                // add handler
            }
        }
        throw new Error("Could not create room");
    }
    async attachGameInstanceToRoom(roomCode, gameInstanceId) {
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
    async execute() {
        const roomCode = await this.createRoom();
        const { gameInstanceId } = await this.props.createGameInstance.execute({ roomCode });
        await this.attachGameInstanceToRoom(roomCode, gameInstanceId);
        return {
            roomCode,
            gameInstanceId
        };
    }
    newRoomCode() {
        return Array.from(new Array(ROOM_CODE_LENGTH), _ => {
            ROOM_CODE_CHARS.charAt(Math.floor(Math.random() * ROOM_CODE_CHARS.length));
        }).join();
    }
}
exports.StartGameActivity = StartGameActivity;
//# sourceMappingURL=startGame.js.map