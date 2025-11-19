<script setup lang="ts">
import * as d3 from 'd3'
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import type { CommitReview } from '@/stores/commitreviews';

const props = defineProps<{
  reviews: CommitReview[]
  hue?: keyof CommitReview
}>()

const chartRef = ref<HTMLElement | null>(null)
  const containerWidth = ref(800) // default fallback

const metrics = [
  'adherence',
  'vulnerability',
  'singleResponsibility',
  'openClosed',
  'liskovSubstitution',
  'interfaceSegregation',
  'dependencyInversion'
] as const

function getBoxPlotStats(values: number[]) {
  const sorted = values.slice().sort(d3.ascending)
  return {
    min: d3.min(sorted)!,
    q1: d3.quantile(sorted, 0.25)!,
    median: d3.quantile(sorted, 0.5)!,
    q3: d3.quantile(sorted, 0.75)!,
    max: d3.max(sorted)!
  }
}

function getChartColors() {
  const styles = getComputedStyle(document.documentElement);
  const stroke = styles.getPropertyValue('--color-chart-stroke').trim() || '#ffffff'
  const axis = styles.getPropertyValue('--color-text').trim() || '#dddddd'
  return { stroke, axis }
}

function drawChart() {
  if (!chartRef.value || props.reviews.length === 0) return

  const { stroke, axis } = getChartColors()
  const hueKey = props.hue ?? 'reviewBy'

  const grouped = d3.group(props.reviews, r => String(r[hueKey]))
  const hueGroups = Array.from(grouped.entries())

  const data: {
    group: string
    metric: string
    min: number
    q1: number
    median: number
    q3: number
    max: number
  }[] = []

  for (const [group, items] of hueGroups) {
    for (const metric of metrics) {
      const values = items.map(r => r[metric])
      if (values.length === 0) continue
      const stats = getBoxPlotStats(values)
      data.push({ group, metric, ...stats })
    }
  }

  const margin = { top: 30, right: 30, bottom: 100, left: 50 }
  const bounds = chartRef.value.getBoundingClientRect()
  const width = Math.max(50, containerWidth.value - margin.left - margin.right)
  const height = bounds.height > 0 ? bounds.height - margin.top - margin.bottom : 400

  d3.select(chartRef.value).selectAll('*').remove()

  const svg = d3.select(chartRef.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const xDomain = data.map(d => `${d.metric}-${d.group}`)
  const x = d3.scaleBand()
    .domain(xDomain)
    .range([0, width])
    .padding(0.3)

  const y = d3.scaleLinear()
    .domain([0, 6])
    .range([height, 0])

  const color = d3.scaleOrdinal(d3.schemeTableau10)
    .domain(hueGroups.map(([key]) => key))

  // X Axis with formatted labels
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat((d: any) => {
      const [metric, group] = d.split('-')
      return `${metric} (${group})`
    }))
    .selectAll('text')
    .attr('transform', 'rotate(-35)')
    .style('text-anchor', 'end')
    .style('fill', axis)

  // Y Axis
  svg.append('g')
    .call(d3.axisLeft(y))
    .selectAll('text')
    .style('fill', axis)

  // Boxes
  svg.selectAll('.box')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'box')
    .attr('x', d => x(`${d.metric}-${d.group}`)!)
    .attr('y', d => y(d.q3))
    .attr('width', x.bandwidth())
    .attr('height', d => y(d.q1) - y(d.q3))
    .attr('fill', d => color(d.group)!)
    .attr('stroke', stroke)

  // Median lines
  svg.selectAll('.median-line')
    .data(data)
    .enter()
    .append('line')
    .attr('class', 'median-line')
    .attr('x1', d => x(`${d.metric}-${d.group}`)!)
    .attr('x2', d => x(`${d.metric}-${d.group}`)! + x.bandwidth())
    .attr('y1', d => y(d.median))
    .attr('y2', d => y(d.median))
    .attr('stroke', stroke)
    .attr('stroke-width', 2)

  // Whiskers
  svg.selectAll('.whisker-min')
    .data(data)
    .enter()
    .append('line')
    .attr('x1', d => x(`${d.metric}-${d.group}`)! + x.bandwidth() / 2)
    .attr('x2', d => x(`${d.metric}-${d.group}`)! + x.bandwidth() / 2)
    .attr('y1', d => y(d.min))
    .attr('y2', d => y(d.q1))
    .attr('stroke', stroke)

  svg.selectAll('.whisker-max')
    .data(data)
    .enter()
    .append('line')
    .attr('x1', d => x(`${d.metric}-${d.group}`)! + x.bandwidth() / 2)
    .attr('x2', d => x(`${d.metric}-${d.group}`)! + x.bandwidth() / 2)
    .attr('y1', d => y(d.q3))
    .attr('y2', d => y(d.max))
    .attr('stroke', stroke)
}


onMounted(() => {
  if (!chartRef.value) return

  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      containerWidth.value = entry.contentRect.width
    }
  })

  resizeObserver.observe(chartRef.value)

  drawChart()

  onBeforeUnmount(() => {
    resizeObserver.disconnect()
  })
})

watch(containerWidth, drawChart)

watch(() => [props.reviews, props.hue], drawChart, { deep: true })
</script>

<template>
  <div class="boxplot-container">
    <div ref="chartRef" class="chart" style="height: 400px;"></div>
    <p v-if="!reviews.length" class="empty">No data available</p>
  </div>
</template>

<style scoped>
.boxplot-container {
  align-items: center;
  width: 100%;
  overflow-x: auto;
  background-color: var(--color-background);
  padding: 1rem;
}

.empty {
  text-align: center;
  font-style: italic;
  color: var(--color-text);
  margin-top: 1rem;
}
</style>
