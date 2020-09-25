<template>
    <div class="debug">
        <h1>Debug Page</h1>
        <b-tabs content-class="mt-3">
            <b-tab title="Game Room">
                <b-form-input
                    class="m-1"
                    v-model="roomCode"
                    placeholder="Room Code"
                />
                <b-button class="mx-1" v-on:click="testGameRoom">
                    Test Game Room
                </b-button>
                <div>{{ gameRoomResult }}</div>
            </b-tab>
            <b-tab title="Game Instance">
                <b-form-input
                    class="m-1"
                    v-model="gameInstanceId"
                    placeholder="Game Instance Id"
                />
                <b-button class="mx-1" v-on:click="testGameInstance">
                    Test Game Instance
                </b-button>
                <div>{{ gameInstanceResult }}</div>
            </b-tab>
            <b-tab title="Start Game">
                <b-button class="mx-1" v-on:click="testStartGame">
                    Start Game
                </b-button>
                <div>{{ startGameResult }}</div>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ApiHelper } from '@/client/api'

@Component
export default class Debug extends Vue {
    roomCode = ''
    gameRoomResult = ''

    gameInstanceId = ''
    gameInstanceResult = ''

    startGameResult = ''

    async testGameRoom() {
        try {
            const result = await ApiHelper.instance.gameRoom({
                roomCode: this.roomCode
            })
            this.gameRoomResult = JSON.stringify(result)
        } catch (e) {
            this.gameRoomResult = 'err: ' + JSON.stringify(e)
        }
    }

    async testGameInstance() {
        try {
            const result = await ApiHelper.instance.gameInstance({
                id: this.gameInstanceId
            })
            this.gameInstanceResult = JSON.stringify(result)
        } catch (e) {
            this.gameInstanceResult = 'err: ' + JSON.stringify(e)
        }
    }

    async testStartGame() {
        try {
            const result = await ApiHelper.instance.startGame({})
            this.startGameResult = JSON.stringify(result)
        } catch (e) {
            this.startGameResult = 'err: ' + JSON.stringify(e)
        }
    }
}
</script>
