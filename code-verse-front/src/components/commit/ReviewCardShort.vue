<template>
  <div class="commit-card-mini">
    <div class="header">
      <div class="left">
        <a :href="`https://github.com/${review.repoOnUser.repoName}/commit/${review.sha}`" target="_blank" class="sha">
          {{ review.sha.slice(0, 7) }}
        </a>
        <span class="reviewer">👤 {{ review.reviewer }}</span>
      </div>
      <a :href="`https://github.com/${review.repoOnUser.gitName}`" target="_blank" class="author">@{{ review.repoOnUser.gitName }}</a>
    </div>

    <div class="messages">
      <div class="message-label">Message:</div>
      <div class="message-text">{{ review.message }}</div>
      <div class="message-label">Suggested:</div>
      <div class="message-text">{{ review.suggested }}</div>
    </div>

    <div class="metrics">
      <div class="metric">
        A: {{ review.adherence }}
        <span class="tooltip">Adherence<br>{{ review.adherence_comment || 'No comment' }}</span>
      </div>
      <div class="metric">
        V: {{ review.vulnerability }}
        <span class="tooltip">Vulnerability<br>{{ review.vulnerability_comment || 'No comment' }}</span>
      </div>
      <div
        v-for="p in solidPrinciples"
        :key="p.name"
        class="metric"
      >
        {{ p.abbr }}: {{ review[p.name as keyof CommitReview] }}
        <span class="tooltip">{{ p.label }}<br>{{ review[`${p.name}_comment` as keyof CommitReview] || 'No comment' }}</span>
      </div>
    </div>

    <button v-if="review.complexity_comment" class="complexity-button" @click="showComplexity = !showComplexity">
      {{ showComplexity ? 'Hide' : 'Read' }} Complexity Comment
    </button>
    <div v-if="showComplexity" class="complexity-box">
      <strong>Complexity Comment:</strong>
      <p>{{ review.complexity_comment }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CommitReview } from '@/stores/commitreviews';

const props = defineProps<{ review: CommitReview }>()

const showComplexity = ref(false)

const solidPrinciples: { name: keyof CommitReview; abbr: string; label: string }[] = [
  { name: 'singleResponsibility', abbr: 'SR', label: 'Single Responsibility' },
  { name: 'openClosed', abbr: 'OC', label: 'Open/Closed' },
  { name: 'liskovSubstitution', abbr: 'LS', label: 'Liskov Substitution' },
  { name: 'interfaceSegregation', abbr: 'IS', label: 'Interface Segregation' },
  { name: 'dependencyInversion', abbr: 'DI', label: 'Dependency Inversion' },
]
</script>

<style scoped>
.commit-card-mini {
  background-color: var(--color-background);
  color: var(--color-text);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: bold;
}

.header .left {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.sha {
  color: #4ea2f0;
  text-decoration: none;
}

.author {
  color: var(--color-text);
}

.reviewer {
  background-color: var(--color-background-soft);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.messages {
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.message-label {
  font-weight: 600;
  color: var(--color-text);
}

.message-text {
  background-color: var(--color-background-soft);
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

.metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.metric {
  background-color: var(--color-background-soft);
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  position: relative;
  cursor: help;
  white-space: nowrap;
}

.tooltip {
  position: absolute;
  bottom: 110%;
  left: 0;
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 0.75rem;
  white-space: normal;
  display: none;
  width: max-content;
  max-width: 250px;
  z-index: 10;
}

.metric:hover .tooltip {
  display: block;
}

.complexity-button {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  align-self: start;
}

.complexity-box {
  font-size: 0.85rem;
  background-color: var(--color-background-soft);
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}
</style>
