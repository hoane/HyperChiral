<template>
  <div class="debug">
    <h1>Debug Page</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Debug extends Vue {
  get message(): string {
    return this.$store.getters.cognitoId;
  }
}
</script>
