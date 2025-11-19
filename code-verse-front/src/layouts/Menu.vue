<template>
  <div class="content-layout">
    <header class="topbar">
      <div class="right-icons">
        <slot name="header-icons" />
      </div>
    </header>

    <div class="main-area">
      <aside class="sidebar-container" :style="{ width: props.expanded ? '140px' : '40px' }">
        <!-- Minimal Sidebar -->
        <div class="sidebar minimal">
          <slot name="minimal-sidebar" />
          <button class="toggle-button" @click="toggle">
            <font-awesome-icon :icon="props.expanded ? ['fas', 'arrow-left'] : ['fas', 'arrow-right']" />
          </button>
        </div>
        <!-- Main Sidebar -->
        <div v-if="props.expanded" class="sidebar main">
          <slot name="main-sidebar" />
        </div>
      </aside>

      <!-- Page Content -->
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>


<script setup lang="ts">

const props = defineProps({
  expanded: Boolean,
})

const emit = defineEmits(['update:expanded'])

function toggle() {
  emit('update:expanded', !props.expanded)
}
</script>

<style scoped>
.content-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* Top white header */
.topbar {
  height: 40px;
  background-color: white;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.right-icons {
  display: flex;
  gap: 1rem;
  align-items: center;
  color: #333;
}

/* Main content area including sidebars */
.main-area {
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.main-content {
  flex: 1;
  height: 100%;
  overflow: auto;
}


.sidebar-container {
  display: flex;
  flex-direction: row;
  color: white;
  height: 100%;
  overflow: hidden;
  flex-shrink: 0;
  width: calc(40px + 100px); /* or 40px only if collapsed */
  transition: width 0.2s ease;
}

/* Shared sidebar base styles */
.sidebar {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
}

/* Minimal Sidebar */
.minimal {
  width: 40px;
  background-color: #003877;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.minimal svg {
  margin: 1rem 0;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.minimal svg:hover {
  color: #cccccc;
}

.toggle-button {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-top: auto;
  margin-bottom: 0.5rem;
}

/* Main Sidebar */
.main {
  width: 100px;
  color: white;
  background-color: #0264d6;
  padding-top: 1rem;
}

.main a {
  color: white;
  text-decoration: none;
  font-size: 14px;
  padding: 10px 12px;
  margin: 6px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.main button {
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 10px 12px;
  margin: 6px 8px;
  color: white;
  text-align: left;
  border-radius: 4px;
  width: calc(100% - 16px);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.main button:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

</style>
