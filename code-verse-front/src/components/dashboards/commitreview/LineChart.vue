<script setup lang="ts">
import * as d3 from 'd3'
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import type { CommitReview } from '@/stores/commitreviews';

const props = defineProps<{
  reviews: CommitReview[]
  metric: keyof Pick<CommitReview,
    'adherence' | 'vulnerability' | 'singleResponsibility' | 'openClosed' |
    'liskovSubstitution' | 'interfaceSegregation' | 'dependencyInversion'>
  hue?: keyof CommitReview // <- Optional grouping key
}>()

const emit = defineEmits<{
  (e: 'point-clicked', data: CommitReview): void
}>()


const chartRef = ref<HTMLElement | null>(null)
const containerWidth = ref(800) // default fallback
const fixedHeight = 400

function drawChart() {
  if (!chartRef.value) return

  const hueKey = props.hue ?? 'reviewBy'

  const dataByHue = d3.group(
    props.reviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    d => String(d[hueKey]) // convert to string for consistent grouping
  )

  const margin = { top: 30, right: 30, bottom: 80, left: 50 }
  const width = Math.max(50, containerWidth.value - margin.left - margin.right)
  const height = fixedHeight - margin.top - margin.bottom

  d3.select(chartRef.value).selectAll('*').remove()

  const svg = d3.select(chartRef.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const allDates = Array.from(new Set(props.reviews.map(r => r.createdAt)))
  const x = d3.scalePoint()
    .domain(allDates)
    .range([0, width])
    .padding(0.5)

  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d => new Date(d as string).toLocaleDateString()))
    .selectAll("text")
    .attr("transform", "rotate(-35)")
    .style("text-anchor", "end")

  const y = d3.scaleLinear()
    .domain([0, 5])
    .range([height, 0])

  svg.append('g')
    .call(d3.axisLeft(y))

  const color = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(Array.from(dataByHue.keys()))

  for (const [hueGroup, items] of dataByHue) {
    const sortedItems = items.slice().sort((a, b) => {
      const dateDiff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (dateDiff !== 0) return dateDiff
      return a.sha.localeCompare(b.sha)
    })

    const line = d3.line<CommitReview>()
      .x(d => x(d.createdAt)!)
      .y(d => y(d[props.metric]))

    svg.append('path')
      .datum(sortedItems)
      .attr('fill', 'none')
      .attr('stroke', color(hueGroup)!)
      .attr('stroke-width', 2)
      .attr('d', line)

    // Draw clickable dots
    svg.selectAll(`.dot-${hueGroup}`)
      .data(sortedItems)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.createdAt)!)
      .attr('cy', d => y(d[props.metric]))
      .attr('r', 1)
      .attr('fill', color(hueGroup)!)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .on('mouseover', function () {
        d3.select(this)
          .attr('r', 5)
      })
      .on('mouseout', function () {
        d3.select(this)
          .attr('r', 1)
      })
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        emit('point-clicked', d)
      })


    const last = sortedItems[sortedItems.length - 1]
    svg.append('text')
      .attr('x', x(last.createdAt)! + 5)
      .attr('y', y(last[props.metric])!)
      .text(hueGroup)
      .style('fill', color(hueGroup)!)
      .style('font-size', '12px')
  }

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

watch(() => [props.reviews, props.metric], drawChart, { deep: true })
</script>

<template>
  <div ref="chartRef" class="linechart-container"></div>
</template>

<style scoped>
.linechart-container {
  width: 100%;
  overflow-x: auto;
}
</style>
