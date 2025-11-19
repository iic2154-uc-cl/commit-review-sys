<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const loginMessage = ref('')
const loading = ref(false)
const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  if (userStore.isLoggedIn) {
    router.push('/')
  }
})

const handleCasLogin = () => {
  loading.value = true
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/login`
}

const onHelpClick = () => {
  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">Commit Review</h2>
      <p class="login-subtitle">Please log in to continue</p>

      <!-- Error Message -->
      <div v-if="loginMessage" class="error-message">
        {{ loginMessage }}
      </div>

      <!-- Login Button -->
      <button 
        @click="handleCasLogin" 
        :disabled="loading" 
        class="login-btn"
      >
        <span v-if="loading" class="loading-indicator">Loading...</span>
        Login with UC
      </button>

      <hr class="divider">

      <button @click="onHelpClick" class="help-btn">
        Need help?
      </button>
    </div>
  </div>
</template>
<style scoped>
/* Main container */
.login-container {
  display: flex;
  color: black;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f4f4f4;
}

/* Login card */
.login-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  height: 300px;
  text-align: center;
}

.login-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.login-subtitle {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 2rem;
}

.error-message {
  color: red;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.login-btn {
  background-color: #4CAF50;
  color: white;
  font-size: 1rem;
  padding: 10px 20px;
  width: 100%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.login-btn:disabled {
  background-color: #ccc;
}

.loading-indicator {
  margin-right: 10px;
}

.divider {
  margin: 20px 0;
}

.help-btn {
  background: none;
  border: none;
  color: #007bff;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: underline;
}
</style>
