<script setup lang="ts">
import CodeFilter from '@/components/filters/code.vue';
import { useCommitReviewStore, type CommitReview } from '@/stores/commitreviews';
import { ref, computed, onMounted } from 'vue';
import type { filters } from '@/components/filters/code.vue';
import LineChart from '@/components/dashboards/commitreview/LineChart.vue';
import BoxPlotChart from '@/components/dashboards/commitreview/BoxPlotChart.vue';
import Modal from '@/components/Modal.vue';
import ReviewCard from '@/components/commit/ReviewCard.vue';
import Multiselect from '@vueform/multiselect'

const metricS = ref<'adherence' | 'vulnerability' | 'singleResponsibility' | 'openClosed' |
'liskovSubstitution' | 'interfaceSegregation' | 'dependencyInversion' | null>(null)
const metricList = [
  'adherence',
  'vulnerability',
  'singleResponsibility',
  'openClosed',
  'liskovSubstitution',
  'interfaceSegregation',
  'dependencyInversion'
]

const commitReviewStore = useCommitReviewStore();
onMounted(() => {
  commitReviewStore.setCommitReviews();
});

const seleccion = ref<filters>({
  selectedRepos: [] as string[],
  selectedUsers: [] as string[],
  startDate: null,
  endDate: null,
});

const commitReviews = computed(() => {
  return commitReviewStore.getFilteredCommitReviews(
    seleccion.value.selectedRepos,
    seleccion.value.selectedUsers,
    seleccion.value.startDate ?? undefined,
    seleccion.value.endDate ?? undefined
  )
});

const selectedReview = ref<CommitReview | null>(null)

function handlePointClicked(review: CommitReview) {
  selectedReview.value = review
}
const handleFilterUpdate = (payload: filters) => {
  seleccion.value = payload
}
</script>

<template>
  <div class="main-page">
    <Modal v-if="selectedReview" @close="selectedReview = null">
      <ReviewCard :review="selectedReview" />
    </Modal>
    <CodeFilter
      :repo-options="commitReviewStore.getRepos.map(repo => repo.value)"
      :user-options="commitReviewStore.getGitNames.map(user => user.value)"
      @update:filters="handleFilterUpdate"
    />

    <template v-if="commitReviews.length">
      <div class="chart-section">
        <Multiselect
          v-model="metricS"
          :options="metricList"
          searchable
          placeholder="Select..."
          class="multiselect text-black"
        />
        <LineChart v-if="metricS" :reviews="commitReviews" :metric="metricS" hue="reviewer" @point-clicked="handlePointClicked"/>
        
      </div>

      <div class="chart-section">
        <h3 class="chart-title">Metric Distribution</h3>
        <BoxPlotChart :reviews="commitReviews" hue="reviewer" />
      </div>
    </template>
    <template v-else>
      <div class="empty-state">No data matches your current filters.</div>
    </template>
  </div>
</template>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  scrollbar-width: thin;
  padding: 1rem;
  gap: 1rem;
}

.chart-section {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.chart-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}

.go-code {
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

.go-code:hover {
  background-color: #1f2e40;
}
.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--color-text);
  font-style: italic;
}

</style>
