<template>
  <div v-if="visible" class="overlay" @click.self="close">
    <transition name="slide">
      <aside class="drawer" v-show="visible">
        <slot />
      </aside>
    </transition>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  visible: Boolean,
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>

<style scoped>
/* Fullscreen overlay */
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

/* Drawer panel */
.drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background-color: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  overflow-y: auto;
}

/* Slide-in transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
