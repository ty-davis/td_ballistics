<script setup lang="ts">
const resultsStore = useResultsStore()
const { fmtVelocity, fmtEnergy, fmtDistance, fmtAngle, fmtInches } = useUnitConversion()
const settings = useSettingsStore()

const at = computed(() => resultsStore.atTarget)
</script>

<template>
  <div v-if="at" class="card">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-text-primary">At Target</h3>
      <span class="text-xs text-text-muted">{{ fmtDistance(at.distanceYards) }}</span>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="stat-cell">
        <span class="stat-label">Drop</span>
        <span class="stat-value text-status-error">{{ fmtInches(at.dropFromZeroInches) }}</span>
        <span class="stat-sub">{{ fmtAngle(at.dropMOA, at.dropMRAD) }}</span>
      </div>
      <div class="stat-cell">
        <span class="stat-label">Wind Drift</span>
        <span class="stat-value text-chart-wind">{{ fmtInches(at.windDriftInches) }}</span>
        <span class="stat-sub">{{ fmtAngle(at.windDriftMOA, at.windDriftMRAD) }}</span>
      </div>
      <div class="stat-cell">
        <span class="stat-label">Velocity</span>
        <span class="stat-value text-chart-velocity">{{ fmtVelocity(at.velocityFps) }}</span>
        <span class="stat-sub">M{{ at.machNumber.toFixed(2) }}</span>
      </div>
      <div class="stat-cell">
        <span class="stat-label">Energy</span>
        <span class="stat-value text-chart-energy">{{ fmtEnergy(at.remainingEnergyFtLbs) }}</span>
        <span class="stat-sub">ToF {{ at.timeOfFlightSeconds.toFixed(3) }}s</span>
      </div>
    </div>

    <!-- Max ordinate -->
    <div v-if="resultsStore.result" class="mt-3 pt-3 border-t border-border-subtle flex gap-4 text-xs text-text-muted">
      <span>
        Max ordinate:
        <span class="text-text-secondary font-mono">{{ resultsStore.result.maxOrdinateInches.toFixed(1) }}"</span>
        at
        <span class="text-text-secondary font-mono">{{ Math.round(resultsStore.result.maxOrdinateDistanceYards) }} yds</span>
      </span>
      <span>
        Spin drift:
        <span class="text-text-secondary font-mono">{{ at.spinDriftInches.toFixed(2) }}"</span>
      </span>
    </div>
  </div>
</template>

<style>
.stat-cell { @apply flex flex-col gap-0.5; }
.stat-label { @apply text-xs text-text-muted; }
.stat-value { @apply text-lg font-bold font-mono; }
.stat-sub { @apply text-xs text-text-secondary font-mono; }
</style>
