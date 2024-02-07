<script setup lang="ts">

</script>

<template>
  <div id="app">
    <div 
      v-for="flower in flowers" class="flower" 
      :style="{'bottom': flower.bottom, 'left': flower.left }"
    >
      <div class="wiggle-wrapper">
        {{ flower.type }}
      </div>
    </div>
    <div class="body" v-if="auth">
      <nav class="nav">
        <RouterLink to="/add" class="nav-item" :class="{ 'disabled': navinuse == 'add' }">Add Photo</RouterLink>
        <RouterLink to="/" class="nav-item" :class="{ 'disabled': navinuse == 'home' }">Home</RouterLink>
        <RouterLink to="/scrapbook" class="nav-item" :class="{ 'disabled': navinuse == 'scrapbook' }">Scrapbook</RouterLink>
      </nav>
      <RouterView class="main" :passcode="passcode" :key="$route.fullPath"/>
    </div>
    <div v-else>
      <h1 @click="unlock" class="lock">🔒</h1>
    </div>
  </div>
</template>

<style>

.lock {
  background: #fdfdfd;
  position: relative;
  padding: 1.68rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  border: 1px solid #262626;
  z-index: 2;
  cursor: pointer;
}

.flower {
  position: fixed;
  animation: grow 120s 1 forwards;
  z-index: 1;
  font-size: 1rem;
}

.wiggle-wrapper:hover {
  animation: wiggle 240ms 2 forwards ease-in-out;
}

@keyframes grow {
  0%, 100% {
    font-size: 1rem;
  }
  20%, 80% {
    font-size: 4rem;
  }
}

@keyframes wiggle {
  0%, 50%, 100% { rotate: 0deg; }
  25% { rotate: -30deg; }
  75% { rotate: 30deg; }
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
      flowers: [] as Array<{bottom: string, left: string, type: string}>
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
        const pass = window.prompt("what is the password?") as string;
        this.passcode = sha256(pass);
        const res = await fetch(`https://dearpriya-api.0xtimmy.workers.dev/verify?passcode=${this.passcode}`, { method: "GET" });
        this.auth = (await res.text()) == "true";
      }
      login();
    },
    spawnflower: function() {
      const types = ["🌹", "🌹", "🌹", "🌷", "🌷", "🪻", "🌺", "🌻", "🌼", "☘️"] 
      this.flowers.push({
        bottom: `${Math.random()*110-5}vh`,
        left: `${Math.random()*110-5}vw`,
        type: types[Math.floor(Math.random()*types.length)]
      })
      setTimeout(() => {
        this.spawnflower();
      }, 2000);
      setTimeout(() => {
        this.flowers.splice(0,1);
      }, 120000);
    }
  },
  mounted: function() {
    this.spawnflower();
  }
}

</script>

<style scoped>

</style>
