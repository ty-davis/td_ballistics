<script setup lang="ts">
import type { ComeUpRow } from '../../types/results'

const resultsStore = useResultsStore()
const settings = useSettingsStore()

const rows = computed<ComeUpRow[]>(() =>
  resultsStore.points.map(p => ({
    distanceYards: p.distanceYards,
    elevationMOA: -p.dropMOA,   // negated: positive = dial up
    elevationMRAD: -p.dropMRAD,
    windageMOA: p.windDriftMOA,
    windageMRAD: p.windDriftMRAD,
    velocityFps: p.velocityFps,
    energyFtLbs: p.remainingEnergyFtLbs,
    timeOfFlightSeconds: p.timeOfFlightSeconds,
  })),
)
</script>

<template>
  <div class="card overflow-hidden">
    <h3 class="section-label mb-3">Come-Up / Firing Data</h3>
    <div class="overflow-x-auto -mx-4 px-4">
      <table class="w-full text-xs font-mono min-w-[560px]">
        <thead>
          <tr class="text-text-muted border-b border-border-subtle">
            <th class="text-left py-1.5 pr-3 font-medium">Dist</th>
            <th class="text-right py-1.5 pr-3 font-medium">Elev MOA</th>
            <th class="text-right py-1.5 pr-3 font-medium">Elev MRAD</th>
            <th class="text-right py-1.5 pr-3 font-medium">Wind MOA</th>
            <th class="text-right py-1.5 pr-3 font-medium">Wind MRAD</th>
            <th class="text-right py-1.5 pr-3 font-medium">TOF (s)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.distanceYards"
            class="border-b border-border-subtle hover:bg-bg-elevated transition-colors"
          >
            <td class="py-1.5 pr-3 text-text-secondary">{{ Math.round(row.distanceYards) }}</td>
            <td class="py-1.5 pr-3 text-right text-text-primary">{{ row.elevationMOA.toFixed(2) }}</td>
            <td class="py-1.5 pr-3 text-right text-text-primary">{{ row.elevationMRAD.toFixed(3) }}</td>
            <td class="py-1.5 pr-3 text-right text-chart-wind">
              {{ row.windageMOA >= 0 ? '+' : '' }}{{ row.windageMOA.toFixed(2) }}
            </td>
            <td class="py-1.5 pr-3 text-right text-chart-wind">
              {{ row.windageMRAD >= 0 ? '+' : '' }}{{ row.windageMRAD.toFixed(3) }}
            </td>
            <td class="py-1.5 text-right text-text-secondary">{{ row.timeOfFlightSeconds.toFixed(3) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
