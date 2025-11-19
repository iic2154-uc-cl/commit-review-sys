<template>
  <div class="container">
    <div class="top-controls">
      <Multiselect
        v-model="selectedSha"
        :options="commitReviewStore.getSha"
        searchable
        placeholder="Select SHA..."
        class="multiselect"
      />
      <button @click="showRightComponent = !showRightComponent" class="toggle-button">
        {{ showRightComponent ? 'Ocultar Review Cards' : 'Mostrar Review Cards' }}
      </button>
    </div>

    <div class="analisis-container">
      <div :class="['left-component', { 'full-width': !showRightComponent }]">
        <CommitDiff :diffs="diffs" />
      </div>
      <div v-show="showRightComponent" class="right-component">
        <div v-for="review in reviews" :key="review.id" class="card">
          <ReviewCard :review="review" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Multiselect from '@vueform/multiselect'
import { useCommitReviewStore, type CommitReview } from '@/stores/commitreviews'
import axios from 'axios'
import CommitDiff from '@/components/commit/CommitDiff.vue'
import ReviewCard from '@/components/commit/ReviewCardShort.vue'

// Type definitions
interface CommitDiffFile {
  filename: string;
  additions: number;
  deletions: number;
  patch: string;
}

const commitReviewStore = useCommitReviewStore()

// Reactive references
const selectedSha = ref<string | null>(null)
const reviews = ref<CommitReview[]>([])
const diffs = ref<CommitDiffFile[]>([])
const showRightComponent = ref(false) // Set to false for investigation purposes

// Vue router
const route = useRoute()
const router = useRouter()

onMounted(() => {
  const sha = route.query.sha as string | undefined
  if (sha) selectedSha.value = sha
})

const fetchCommitDiff = async (sha: string) => {
  const repo = reviews.value[0].repoOnUser.repoName

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${repo}/commits/${sha}`,
      {
        headers: {
          Authorization: `token ${import.meta.env.VITE_GIT_TOKEN}`,
        },
      }
    )
    diffs.value = response.data.files
  } catch (err) {
    console.error('Error fetching commit diff:', err)
  }
}

watch(selectedSha, (newSha) => {
  if (newSha) {
    router.replace({ query: { ...route.query, sha: newSha } })
    reviews.value = commitReviewStore.getCommitReviewsBySha(newSha)
    fetchCommitDiff(newSha)
  }
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  padding: 5px;
  gap: 1rem;
}

.analisis-container {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.left-component {
  border-right: 1px solid #ddd;
  width: 50%;
  padding: 10px;
  overflow-y: auto;
  transition: width 0.3s ease;
}

.left-component.full-width {
  width: 100%;
  border-right: none;
}


.right-component {
  background-color: #f9f9f9;
  flex: 1;
  margin: 2px;
  padding: 1px;
  box-sizing: border-box;
  overflow-y: auto;
  transition: opacity 0.3s ease;
}

.message {
  color: var(--text-color, #000);
}

.styled-label {
  margin-top: 20px;
  font-weight: bold;
  color: var(--text-color, #000);
  display: flex;
  flex-direction: row;
}

.top-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 0.5rem;
}

.multiselect {
  min-width: 250px;
  flex: 1;
  max-width: 600px;
  color: black;
}

.toggle-button {
  padding: 6px 14px;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.toggle-button:hover {
  background-color: #666;
}


.toggle-button {
  align-self: center;
  padding: 6px 16px;
  border: none;
  background-color: #444;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.toggle-button:hover {
  background-color: #666;
}

</style>
