<script setup lang="ts">
const resultsStore = useResultsStore()
const settings = useSettingsStore()
const { fmtVelocity, fmtEnergy, fmtAngle, fmtInches } = useUnitConversion()

const isMOA = computed(() => settings.angleUnit === 'MOA')
</script>

<template>
  <div class="card overflow-hidden">
    <h3 class="section-label mb-3">Trajectory Data</h3>
    <div class="overflow-x-auto -mx-4 px-4">
      <table class="w-full text-xs font-mono min-w-[600px]">
        <thead>
          <tr class="text-text-muted border-b border-border-subtle">
            <th class="text-left py-1.5 pr-3 font-medium">Dist</th>
            <th class="text-right py-1.5 pr-3 font-medium">Drop"</th>
            <th class="text-right py-1.5 pr-3 font-medium">{{ isMOA ? 'MOA' : 'MRAD' }}</th>
            <th class="text-right py-1.5 pr-3 font-medium">Wind"</th>
            <th class="text-right py-1.5 pr-3 font-medium">{{ isMOA ? 'MOA' : 'MRAD' }}</th>
            <th class="text-right py-1.5 pr-3 font-medium">Vel</th>
            <th class="text-right py-1.5 font-medium">Energy</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="point in resultsStore.points"
            :key="point.distanceYards"
            :class="[
              'border-b border-border-subtle hover:bg-bg-elevated transition-colors',
              Math.abs(point.dropFromZeroInches) < 0.5 ? 'bg-primary/5' : '',
            ]"
          >
            <td class="py-1.5 pr-3 text-text-secondary">{{ Math.round(point.distanceYards) }}</td>
            <td class="py-1.5 pr-3 text-right text-status-error">{{ point.dropFromZeroInches.toFixed(1) }}</td>
            <td class="py-1.5 pr-3 text-right text-text-primary">
              {{ isMOA ? point.dropMOA.toFixed(2) : point.dropMRAD.toFixed(3) }}
            </td>
            <td class="py-1.5 pr-3 text-right text-chart-wind">{{ point.windDriftInches.toFixed(1) }}</td>
            <td class="py-1.5 pr-3 text-right text-text-primary">
              {{ isMOA ? point.windDriftMOA.toFixed(2) : point.windDriftMRAD.toFixed(3) }}
            </td>
            <td class="py-1.5 pr-3 text-right text-chart-velocity">{{ Math.round(point.velocityFps) }}</td>
            <td class="py-1.5 text-right text-chart-energy">{{ Math.round(point.remainingEnergyFtLbs) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
