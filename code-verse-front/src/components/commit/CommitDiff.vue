<template>
  <div class="git-diff-container">
    <div v-if="!diffs.length" class="empty-message">
      No diffs found for this commit.
    </div>

    <div v-else class="diff-controls">
      <button class="diff-button" @click="expandAll">Expand All</button>
      <button class="diff-button" @click="collapseAll">Collapse All</button>
    </div>

    <div
      v-for="(change, index) in diffs"
      :key="index"
      class="file-diff"
    >
      <div class="file-info" @click="togglePatchVisibility(index)">
        <h3>{{ change.filename }}</h3>
        <div class="meta-mod">
          <h4 class="add">Added: {{ change.additions }}</h4>
          <h4 class="del">Deleted: {{ change.deletions }}</h4>
        </div>
      </div>

      <div
        v-if="isPatchVisible(index) && formattedPatches[index]"
        class="patch-container"
      >
        <div class="patch-content">
          <div
            v-for="(line, i) in formattedPatches[index]"
            :key="i"
            :class="['line', line.class]"
          >
            {{ line.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, reactive } from 'vue'

interface Diff {
  filename: string
  additions: number
  deletions: number
  patch: string | null
}

interface PatchLine {
  text: string
  class: 'added' | 'deleted' | 'context'
}

const props = defineProps<{
  diffs: Diff[]
}>()

const visiblePatches = ref<number[]>([])
const formattedPatches = reactive<Record<number, PatchLine[]>>({})

const togglePatchVisibility = (index: number): void => {
  if (visiblePatches.value.includes(index)) {
    visiblePatches.value = visiblePatches.value.filter((i) => i !== index)
  } else {
    visiblePatches.value.push(index)
  }
}

const isPatchVisible = (index: number): boolean =>
  visiblePatches.value.includes(index)

const expandAll = () => {
  visiblePatches.value = props.diffs.map((_, idx) => idx)
}

const collapseAll = () => {
  visiblePatches.value = []
}

const formatPatchLines = (patch: string): PatchLine[] => {
  return patch.split('\n').map((line) => {
    if (line.startsWith('+')) {
      return { text: line, class: 'added' }
    } else if (line.startsWith('-')) {
      return { text: line, class: 'deleted' }
    } else {
      return { text: line, class: 'context' }
    }
  })
}

watchEffect(() => {
  Object.keys(formattedPatches).forEach((k) => delete formattedPatches[+k])
  props.diffs.forEach((diff, idx) => {
    if (diff.patch) {
      formattedPatches[idx] = formatPatchLines(diff.patch)
    }
  })
})
</script>

<style scoped>
.git-diff-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto;
  scrollbar-width: thin;
  height: 100%;
  max-height: 100vh;
  max-width: 100%;
}

.empty-message {
  padding: 1rem;
  color: #666;
  text-align: center;
  font-style: italic;
}

.diff-controls {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 5px 0;
  gap: 8px;
}

.diff-button {
  padding: 5px 12px;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.diff-button:hover {
  background-color: #666;
}

.file-diff {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  color: #333;
  text-align: left;
  box-sizing: border-box;
  width: 100%;
}

.file-info {
  font-size: 12px;
  margin-bottom: 5px;
  cursor: pointer;
  background: #f9f9f9;
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 5px;
  border-bottom: 1px solid #ccc;
}

.patch-container {
  background-color: #282c34;
  color: white;
  padding: 2px;
  display: block;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-family: monospace;
  width: 100%;
  border-left: 4px solid #888;
  margin-top: 5px;
}

.patch-content {
  white-space: pre-wrap;
  overflow: visible;
}

.meta-mod {
  display: flex;
  font-size: 12px;
  gap: 10px;
  flex-direction: row;
}

.meta-mod h4 {
  margin: 0;
}
.meta-mod .add {
  color: #2c662d;
  background-color: #e6ffed;
  border-radius: 5px;
  padding: 1px 5px;
}
.meta-mod .del {
  color: #ff4d4d;
  background-color: #ffcccc;
  border-radius: 5px;
  padding: 1px 5px;
}

.line.added {
  background-color: #e6ffed;
  color: #2c662d;
}

.line.deleted {
  background-color: #ffcccc;
  color: #ff4d4d;
}

.line.context {
  color: #ffffff;
}
</style>
