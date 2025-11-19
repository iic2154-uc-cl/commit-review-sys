<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <button @click="emit('close')" class="close-icon"><font-awesome-icon :icon="['fas', 'fa-times']" /></button>
    <div class="modal-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: var(--color-background);
  padding: 1rem;
  border-radius: 8px;
  width: 90%;
  max-width: 90vw; /* Limit width */
  max-height: 85vh;  /* Limit height */
  overflow-y: auto;  /* Enable scroll inside */
  color: var(--color-text);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Optional: add scroll bars inside the modal only */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: rgba(150, 150, 150, 0.3);
  border-radius: 3px;
}

@media (max-width: 500px) {
  .modal-content {
    max-height: 90vh;
    padding: 1rem;
  }
}

/* Close icon styling */
.close-icon {
  position: fixed;
  top: 3rem;
  right: 4rem;
  font-size: 1.4rem;
  color: var(--color-text);
  cursor: pointer;
  z-index: 2000;
  border-radius: 50%;
  padding: 0.5rem;
  transition: color 0.3s;
}

.close-icon:hover {
  color: red;
}

</style>
