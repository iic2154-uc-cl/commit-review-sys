<template>
  <div class="commit-card">
    <h2 class="title">
      Commit Review Summary
      <a :href="`https://github.com/${review.repoOnUser.repoName}/commit/${review.sha}`" target="_blank" class="sha">[{{ review.sha.slice(0, 7) }}]</a>
    </h2>

    <table class="summary-table">
      <thead>
        <tr>
          <th>Author</th>
          <th>Provided Message</th>
          <th>Generated Message</th>
          <th>Adherence Score</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <a :href="`https://github.com/${review.repoOnUser.gitName}`" target="_blank">
              @{{ review.repoOnUser.gitName }}
            </a>
          </td>
          <td>{{ review.message }}</td>
          <td>{{ review.suggested }}</td>
          <td>{{ review.adherence }}</td>
        </tr>
      </tbody>
    </table>

    <section class="section">
      <h3 @click="toggleSection('complexity')" class="section-title clickable">
        Code Complexity
        <span class="toggle-icon">{{ openSections.complexity ? '▾' : '▸' }}</span>
      </h3>
      <div v-if="openSections.complexity" class="section-box">
        <strong>Comment</strong>
        <p>{{ review.complexity_comment }}</p>
      </div>
    </section>

    <section class="section">
      <h3 @click="toggleSection('vulnerability')" class="section-title clickable">
        Code Vulnerability
        <span class="toggle-icon">{{ openSections.vulnerability ? '▾' : '▸' }}</span>
      </h3>
      <div v-if="openSections.vulnerability" class="section-box">
        <strong>Score</strong>: {{ review.vulnerability }} 
        <p><strong>Comment</strong>: {{ review.vulnerability_comment }}</p>
      </div>
    </section>

    <section class="section">
      <h3 @click="toggleSection('solid')" class="section-title clickable">
        SOLID Principles
        <span class="toggle-icon">{{ openSections.solid ? '▾' : '▸' }}</span>
      </h3>
      <div v-if="openSections.solid">
        <table class="solid-table">
          <thead>
            <tr>
              <th>Principle</th>
              <th>Score</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="principle in solidPrinciples" :key="principle.name">
              <td>{{ principle.label }}</td>
              <td>{{ review[principle.name as keyof CommitReview] }}</td>
              <td>{{ review[`${principle.name}_comment` as keyof CommitReview] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { CommitReview } from '@/stores/commitreviews';

const props = defineProps<{ review: CommitReview }>()

const solidPrinciples = [
  { name: 'singleResponsibility', label: 'Single Responsibility' },
  { name: 'openClosed', label: 'Open/Closed' },
  { name: 'liskovSubstitution', label: 'Liskov Substitution' },
  { name: 'interfaceSegregation', label: 'Interface Segregation' },
  { name: 'dependencyInversion', label: 'Dependency Inversion' },
] as const;

const openSections = reactive({
  complexity: false,
  vulnerability: false,
  solid: false
})

function toggleSection(section: keyof typeof openSections) {
  openSections[section] = !openSections[section]
}
</script>

<style scoped>
.commit-card {
  background-color: var(--color-background);
  color: var(--color-text);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
}

.sha {
  font-size: 1rem;
  color: #4ea2f0;
  margin-left: 0.5rem;
}

.summary-table, .solid-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.summary-table th, .summary-table td,
.solid-table th, .solid-table td {
  border: 1px solid var(--color-border);
  padding: 0.75rem;
  text-align: left;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}

.section-box {
  background-color: var(--color-background-soft);
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  font-size: 0.95rem;
}

.toggle-icon {
  font-size: 0.9rem;
  color: var(--color-text);
  margin-left: 0.5rem;
}
</style>
