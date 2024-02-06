<script setup lang="ts">

</script>

<template>
  <div id="app">
    <div class="body" v-if="auth">
      <nav class="nav">
        <RouterLink to="/add" class="nav-item" :class="{ 'disabled': navinuse == 'add' }">Add Photo</RouterLink>
        <RouterLink to="/" class="nav-item" :class="{ 'disabled': navinuse == 'home' }">Home</RouterLink>
        <RouterLink to="/scrapbook" class="nav-item" :class="{ 'disabled': navinuse == 'scrapbook' }">Scrapbook</RouterLink>
      </nav>
      <RouterView class="main" :passcode="passcode"/>
    </div>
    <div v-else>
      <h1 @click="unlock" class="lock">🔒</h1>
    </div>
  </div>
</template>

<style>

.lock {
  background: #fdfdfd;
  padding: 1.68rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  border: 1px solid #262626;
}

</style>

<script lang="ts">
import { sha256 } from "js-sha256"

export default {
  name: "Home",
  data() {
    return {
      passcode: "",
      auth: false,
    }
  },
  computed: {
    navinuse: function() {
      return this.$route.name;
    },
  },
  methods: {
    unlock: function() {
      const login = async () => {
        const pass = window.prompt("what the password?") as string;
        this.passcode = sha256(pass);
        const res = await fetch(`https://dearpriya-api.0xtimmy.workers.dev/verify?passcode=${this.passcode}`, { method: "GET" });
        this.auth = (await res.text()) == "true";
      }
      login();
    }
  }
}

</script>

<style scoped>

</style>
