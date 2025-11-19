<template>
    <div class="user-card-container">
      <div class="user-card">
        <h3>Email</h3>
        <p>{{ user.email }}</p>
      </div>
  
      <div v-if="user.gitUser" class="user-card">
        <h3>GitHub</h3>
        <a :href="`https://github.com/${user.gitUser.gitName}`" target="_blank" class="github-link">
          <p>{{ user.gitUser.gitName }}</p>
        </a>
      </div>
  
    </div>
  </template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { User } from '@/stores/user';

const props = defineProps({
  user: {
    type: Object as () => User,
    required: true,
  },
});
</script>

<style scoped>
.user-card-container {
  max-width: 400px;
  margin: 0 auto;
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-card {
  background-color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 0.5rem;
}

.user-card p {
  font-size: 14px;
  color: #555;
}

.github-link {
  text-decoration: none;
  color: #0366d6;
}

.github-link:hover {
  text-decoration: underline;
}

.logout-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  text-align: center;
}

.logout-btn:hover {
  background-color: #0056b3;
}
</style>