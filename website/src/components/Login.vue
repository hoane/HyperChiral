<template>
    <div class="login">
        <b-container>
            <b-form-input
                class="m-1"
                v-model="nickname"
                placeholder="Nickname"
                maxlength="24"
            />
            <b-form-input
                class="m-1"
                v-model="roomCode"
                placeholder="Room Code"
                :formatter="roomCodeFormatter"
                maxlength="8"
            />
            <b-button variant="primary" class="mx-1">New Game</b-button>
            <b-button
                variant="success"
                v-bind:disabled="isEnterDisabled()"
                class="mx-1"
                >Enter Room</b-button
            >
            <div>Value: {{ nickname }}, {{ roomCode }}</div>
        </b-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Login extends Vue {
    nickname = ''
    roomCode = ''

    isEnterDisabled(): boolean {
        return this.roomCode.length < 4
    }

    roomCodeFormatter(value: string): string {
        return value.toUpperCase()
    }
}
</script>
