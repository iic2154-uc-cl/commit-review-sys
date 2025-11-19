<template>
  <component :is="layout" v-model:expanded="isSidebarExpanded">
    <!-- Slot for header icons -->
    <template #header-icons>
      <!-- <RouterLink to="/about"><font-awesome-icon :icon="['fas', 'question']" /></RouterLink> -->
      <button @click="showAside = true" class="users"><font-awesome-icon :icon="['fas', 'circle-user']" /></button>
    </template>

    <!-- Minimal Sidebar -->
    <template #minimal-sidebar>
      <font-awesome-icon :icon="['fas', 'house']" />
    </template>

    <!-- Main Sidebar -->
    <template #main-sidebar>
      <RouterLink to="/" style="color: white;">Home</RouterLink>
      <RouterLink to="/code" style="color: white;">Analisis</RouterLink>
    </template>

    <!-- Main Content Area -->
    <template #default>
      <RouterView />
    </template>
  </component>

  <!-- Right Aside Component -->
  <RightAside :visible="showAside" @close="showAside = false">
    <!-- User info and  button to logout-->
    <div class="user-info">
      <InfoCard :user="userStore.getUser" />
      <button @click="logout" class="logout">Logout</button>
    </div>
  </RightAside>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useUserStore, type User } from '@/stores/user'
import InfoCard from '@/components/user/InfoCard.vue'
import Menu from '@/layouts/Menu.vue'
import Authless from '@/layouts/Public.vue'
import RightAside from '@/components/user/RightAside.vue'

const userStore = useUserStore()

onMounted(() => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(window.location.search);
  const tokenParam = params.get('token');

  if (tokenParam) {
    localStorage.setItem('token', tokenParam)
    userStore.setUser()
    const cleanUrl = url.origin + url.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }

})

const logout = () => {
  if (userStore.getLoginStatus) {
    localStorage.removeItem('token');
    userStore.logout()
  }
}
// Manage the layout based on user's login state
const layout = computed(() => userStore.isLoggedIn ? Menu : Authless)

const isSidebarExpanded = ref(true)
const showAside = ref(false)
</script>

<style>
.logout {
  background-color: var(--vt-c-indigo);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: background-color 0.3s ease;
}

.logout:hover {
  background-color: #1f2e40;
}
</style>
