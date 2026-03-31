<script setup lang="ts">
const activeChart = ref<'trajectory' | 'velocity' | 'wind'>('trajectory')

const chartOptions = [
  { label: 'Drop', value: 'trajectory' },
  { label: 'Vel / Energy', value: 'velocity' },
  { label: 'Wind Drift', value: 'wind' },
]
</script>

<template>
  <div class="card space-y-3">
    <SelectButton
      v-model="activeChart"
      :options="chartOptions"
      option-label="label"
      option-value="value"
      size="small"
    />
    <div class="h-72">
      <TrajectoryChart2D v-if="activeChart === 'trajectory'" />
      <VelocityEnergyChart v-else-if="activeChart === 'velocity'" />
      <WindDriftChart v-else />
    </div>
  </div>
</template>
