<script setup lang="ts">
import Multiselect from '@vueform/multiselect'
import { ref, watch, computed } from 'vue'

const today = new Date().toISOString().split('T')[0]
const maxStartDate = computed(() => {
  return endDate.value ?? today
})
const minEndDate = computed(() => {
  return startDate.value ?? ''
})

const selectedRepos = ref<string[]>([])
const selectedUsers = ref<string[]>([])
const startDate = ref<string | null>(null)
const endDate = ref<string | null>(null)

const props = defineProps<{
  repoOptions: string[]
  userOptions: string[]
}>()


export type filters = {
  selectedRepos: string[]
  selectedUsers: string[]
  startDate: string | null
  endDate: string | null
}
const emit = defineEmits<{
  (e: 'update:filters', payload: {
    selectedRepos: string[]
    selectedUsers: string[]
    startDate: string | null
    endDate: string | null
  }): void
}>()

// Auto-emit on any change
watch([selectedRepos, selectedUsers, startDate, endDate], () => {
  emit('update:filters', {
    selectedRepos: selectedRepos.value,
    selectedUsers: selectedUsers.value,
    startDate: startDate.value,
    endDate: endDate.value,
  })
})
</script>

<template>
  <div class="filters">
    <!-- Date Filters -->
    <div class="filters-group">
      <label class="font-semibold">Start Date</label>
      <input type="date" v-model="startDate" class="date" :max="maxStartDate ? maxStartDate : today" />

      <span>-</span>

      <label class="font-semibold">End Date</label>
      <input type="date" v-model="endDate" class="date" :max="today" :min="minEndDate"/>
    </div>

    <!-- Repos & Users -->
    <div class="filters-group">
      <div>
        <label class="block text-sm font-semibold text-white mb-1">Repositories</label>
        <Multiselect
            v-model="selectedRepos"
            :options="repoOptions"
            mode="tags"
            searchable
            placeholder="Select..."
            class="multiselect text-black"
            :closeOnSelect="false"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-white mb-1">Users</label>
        <Multiselect
          v-model="selectedUsers"
          :options="userOptions"
          mode="tags"
          searchable
          placeholder="Select..."
          class="multiselect text-black"
          :closeOnSelect="false"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters {
  background-color: var(--color-background-soft);
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filters-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  align-items: flex-end;
}

label {
  font-size: 0.85rem;
  color: var(--color-heading);
  margin-bottom: 0.25rem;
  display: block;
}

.date {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  color: var(--color-text);
}

.multiselect {
  width: 600px;
  color: black;
}

::v-deep(.multiselect-wrapper) {
  border-radius: 0.5rem;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
}

::v-deep(.multiselect-tags) {
  overflow-y: auto;
  max-height: 50px;
}


</style>
