<script setup lang="ts">
const activeChart = ref<'trajectory' | 'velocity' | 'wind'>('trajectory')
</script>

<template>
  <div class="card space-y-3">
    <div class="flex gap-1">
      <button
        v-for="c in ['trajectory', 'velocity', 'wind'] as const"
        :key="c"
        :class="[
          'px-3 py-1 rounded text-xs font-medium transition-colors capitalize',
          activeChart === c
            ? 'bg-primary text-white'
            : 'bg-bg-elevated text-text-secondary hover:text-text-primary border border-border-default',
        ]"
        @click="activeChart = c"
      >
        {{ c === 'trajectory' ? 'Drop' : c === 'velocity' ? 'Vel / Energy' : 'Wind Drift' }}
      </button>
    </div>

    <div class="h-72">
      <TrajectoryChart2D v-if="activeChart === 'trajectory'" />
      <VelocityEnergyChart v-else-if="activeChart === 'velocity'" />
      <WindDriftChart v-else />
    </div>
  </div>
</template>
