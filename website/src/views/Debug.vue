<template>
  <div class="debug">
    <h1>Debug Page</h1>
    <p>{{ message }}</p>
    <p>{{ room }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  getGameInstanceByRoomCode,
  getCognitoCredentials
} from "../client/api";

@Component
export default class Debug extends Vue {
  room = "None"

  async mounted() {
    try {
      const creds = await getCognitoCredentials(this.$store.getters.cognitoId);
      const result = await getGameInstanceByRoomCode({ roomCode: "ABCD" }, creds);
      this.room = JSON.stringify(result);
    } catch(e) {
      console.error(e);
      this.room = "error: "+JSON.stringify(e);
    }
  }

  get message(): string {
    return this.$store.getters.cognitoId;
  }

}
</script>
