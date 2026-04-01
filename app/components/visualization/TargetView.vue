<script setup lang="ts">
const resultsStore = useResultsStore()
const inputStore = useInputStore()
const settingsStore = useSettingsStore()

// USPSA Classic target dimensions in inches
const TW = 21
const TH = 35

// A-zone center (desired point of impact) in target-space inches
const ACX = 10.5
const ACY = 17.5

// The trajectory point we're displaying — always tracks atTarget (the configured target distance)
const pt = computed(() => resultsStore.hasResult ? resultsStore.atTarget : null)

// Where to AIM to have bullet hit A-zone center
// dropFromZeroInches is negative (below zero), so aim.y = ACY + drop < ACY → aim above center ✓
// totalLateralInches positive = drift right, so aim.x = ACX - lateral → aim left ✓
const aim = computed(() => {
  if (!pt.value) return { x: ACX, y: ACY }
  return {
    x: ACX - pt.value.totalLateralInches,
    y: ACY + pt.value.dropFromZeroInches,
  }
})

// Where bullet ACTUALLY hits if aimed at A-zone center (no correction)
// drop negative → impact.y = ACY - drop > ACY → below center ✓
// lateral positive → impact.x = ACX + lateral → right of center ✓
const impact = computed(() => {
  if (!pt.value) return { x: ACX, y: ACY }
  return {
    x: ACX + pt.value.totalLateralInches,
    y: ACY - pt.value.dropFromZeroInches,
  }
})

const PAD = 5

const vb = computed(() => {
  const xs = [0, TW, aim.value.x, impact.value.x]
  const ys = [0, TH, aim.value.y, impact.value.y]
  const minX = Math.min(...xs) - PAD
  const maxX = Math.max(...xs) + PAD
  const minY = Math.min(...ys) - PAD
  const maxY = Math.max(...ys) + PAD
  return {
    minX, minY,
    width: maxX - minX,
    height: maxY - minY,
    str: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
  }
})

// Dot radius scales with view size so it's always legible
const dr = computed(() => Math.max(vb.value.width, vb.value.height) * 0.014)
const fs = computed(() => dr.value * 1.4)

const aimOnTarget = computed(() =>
  aim.value.x >= -1 && aim.value.x <= TW + 1 &&
  aim.value.y >= -1 && aim.value.y <= TH + 1
)
const impactOnTarget = computed(() =>
  impact.value.x >= -1 && impact.value.x <= TW + 1 &&
  impact.value.y >= -1 && impact.value.y <= TH + 1
)

const useMetric = computed(() => settingsStore.unitSystem === 'metric')
const useMRAD = computed(() => settingsStore.angleUnit === 'MRAD')

function fmtLen(inches: number) {
  if (useMetric.value) return `${(inches * 2.54).toFixed(1)} cm`
  return `${Math.abs(inches).toFixed(1)}"`
}

function fmtAngle(moa: number, mrad: number) {
  return useMRAD.value ? `${Math.abs(mrad).toFixed(2)} MRAD` : `${Math.abs(moa).toFixed(1)} MOA`
}
</script>

<template>
  <div class="card space-y-3">
    <!-- Header -->
    <div class="flex flex-wrap items-center gap-2 justify-between">
      <h3 class="text-sm font-semibold text-surface-200">Target View</h3>
      <!-- Distance input (synced with Target Distance in left panel) -->
      <div class="flex items-center gap-2 text-xs">
        <span class="text-surface-400">Distance:</span>
        <InputNumber
          v-model="inputStore.shot.targetDistanceYards"
          :min="1" :max="3000" :step="25"
          suffix=" yd"
          :input-style="{ width: '90px', fontSize: '0.75rem', fontFamily: 'monospace' }"
        />
      </div>
      <!-- Legend -->
      <div class="flex gap-3 text-xs text-surface-400">
        <span class="flex items-center gap-1.5">
          <svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#ef4444"/></svg>
          Aim point
        </span>
        <span class="flex items-center gap-1.5">
          <svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#4ade80"/></svg>
          Impact
        </span>
      </div>
    </div>

    <!-- No data -->
    <div v-if="!resultsStore.hasResult" class="flex items-center justify-center h-48 text-surface-500 text-sm">
      Run a calculation to see target view.
    </div>

    <template v-else>
      <!-- SVG target -->
      <div class="relative overflow-hidden rounded-lg bg-surface-950">
        <svg
          :viewBox="vb.str"
          preserveAspectRatio="xMidYMid meet"
          class="w-full max-h-[480px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Range backdrop -->
          <rect
            :x="vb.minX" :y="vb.minY"
            :width="vb.width" :height="vb.height"
            fill="#0f1923"
          />
          <!-- Ground strip -->
          <rect :x="vb.minX" :y="TH" :width="vb.width" height="4" fill="#1e2d14" opacity="0.8"/>

          <!-- ─── USPSA Target ─── -->

          <!-- Cardboard silhouette: torso body -->
          <rect x="0" y="9" :width="TW" height="26" rx="0.4" fill="#c9a05a" stroke="#7a5415" stroke-width="0.25"/>
          <!-- Head oval -->
          <ellipse cx="10.5" cy="4.5" rx="3.5" ry="4.5" fill="#c9a05a" stroke="#7a5415" stroke-width="0.25"/>
          <!-- Neck bridge -->
          <rect x="8.3" y="8.2" width="4.4" height="1.8" fill="#c9a05a"/>

          <!-- Shoulder bevel hints -->
          <line x1="8.3" y1="8.2" x2="0" y2="9" stroke="#7a5415" stroke-width="0.25"/>
          <line x1="12.7" y1="8.2" x2="21" y2="9" stroke="#7a5415" stroke-width="0.25"/>

          <!-- D-zone (outer scoring outline) -->
          <rect x="0.6" y="9.4" width="19.8" height="25" rx="0.3"
            fill="none" stroke="#6b4c18" stroke-width="0.2" stroke-dasharray="0.7 0.4"/>

          <!-- C-zone outline -->
          <rect x="3" y="10" width="15" height="20.5" rx="0.2"
            fill="none" stroke="#6b4c18" stroke-width="0.2" stroke-dasharray="0.7 0.4"/>

          <!-- A-zone (upper torso) — slightly lighter fill to distinguish -->
          <rect x="5" y="10.5" width="11" height="14"
            fill="rgba(220,180,100,0.15)" stroke="#4a3010" stroke-width="0.3"/>

          <!-- Head A-zone -->
          <ellipse cx="10.5" cy="4.5" rx="2.2" ry="2.8"
            fill="rgba(220,180,100,0.1)" stroke="#4a3010" stroke-width="0.25"/>

          <!-- Zone labels -->
          <text x="10.5" y="8.7" text-anchor="middle" font-size="1.1"
            fill="#6b4c18" font-family="monospace" font-weight="bold">A</text>
          <text x="10.5" y="29" text-anchor="middle" font-size="1.2"
            fill="#6b4c18" font-family="monospace" font-weight="bold">C</text>
          <text x="1.8" y="12" text-anchor="middle" font-size="1"
            fill="#6b4c18" font-family="monospace">D</text>
          <text x="19.2" y="12" text-anchor="middle" font-size="1"
            fill="#6b4c18" font-family="monospace">D</text>

          <!-- ─── Points ─── -->

          <!-- Dashed line: aim → impact -->
          <line
            :x1="aim.x" :y1="aim.y"
            :x2="impact.x" :y2="impact.y"
            stroke="#6b7280" stroke-width="0.2"
            stroke-dasharray="1 0.5" opacity="0.6"
          />

          <!-- A-zone center: desired impact (small fixed green dot) -->
          <circle :cx="ACX" :cy="ACY" :r="dr * 0.5" fill="#22c55e" opacity="0.85"/>
          <circle :cx="ACX" :cy="ACY" :r="dr * 0.9" fill="none" stroke="#16a34a" stroke-width="0.15" opacity="0.5"/>

          <!-- Aim point (red crosshair) -->
          <line :x1="aim.x - dr * 2.2" :y1="aim.y" :x2="aim.x + dr * 2.2" :y2="aim.y"
            stroke="#ef4444" :stroke-width="dr * 0.25" opacity="0.85"/>
          <line :x1="aim.x" :y1="aim.y - dr * 2.2" :x2="aim.x" :y2="aim.y + dr * 2.2"
            stroke="#ef4444" :stroke-width="dr * 0.25" opacity="0.85"/>
          <circle :cx="aim.x" :cy="aim.y" :r="dr * 0.7" fill="#ef4444" opacity="0.9"/>
          <text
            :x="aim.x + dr * 1.4" :y="aim.y - dr * 0.6"
            :font-size="fs" fill="#ef4444" font-family="monospace" font-weight="bold"
          >AIM</text>

          <!-- Bullet impact dot (green) -->
          <circle :cx="impact.x" :cy="impact.y" :r="dr" fill="#4ade80" opacity="0.9"/>
          <circle :cx="impact.x" :cy="impact.y" :r="dr * 1.5" fill="none" stroke="#4ade80"
            stroke-width="0.15" opacity="0.4"/>
          <text
            :x="impact.x + dr * 1.4" :y="impact.y - dr * 0.6"
            :font-size="fs" fill="#4ade80" font-family="monospace" font-weight="bold"
          >HIT</text>

          <!-- Off-target indicators -->
          <text
            v-if="!aimOnTarget"
            :x="aim.x" :y="aim.y + dr * 2.2"
            :font-size="fs * 0.85" fill="#ef4444" text-anchor="middle" font-family="monospace"
          >(off target)</text>
          <text
            v-if="!impactOnTarget"
            :x="impact.x" :y="impact.y + dr * 2.2"
            :font-size="fs * 0.85" fill="#4ade80" text-anchor="middle" font-family="monospace"
          >(off target)</text>
        </svg>
      </div>

      <!-- Stats row -->
      <div v-if="pt" class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div class="bg-surface-800 rounded p-2 space-y-0.5">
          <div class="text-surface-400">Drop from zero</div>
          <div class="font-mono font-semibold text-surface-100">{{ fmtLen(pt.dropFromZeroInches) }}</div>
          <div class="font-mono text-surface-400">{{ fmtAngle(pt.dropMOA, pt.dropMRAD) }}</div>
        </div>
        <div class="bg-surface-800 rounded p-2 space-y-0.5">
          <div class="text-surface-400">Wind drift</div>
          <div class="font-mono font-semibold text-surface-100">{{ fmtLen(pt.windDriftInches) }}</div>
          <div class="font-mono text-surface-400">{{ fmtAngle(pt.windDriftMOA, pt.windDriftMRAD) }}</div>
        </div>
        <div class="bg-surface-800 rounded p-2 space-y-0.5">
          <div class="text-surface-400">Spin drift</div>
          <div class="font-mono font-semibold text-surface-100">{{ fmtLen(pt.spinDriftInches) }}</div>
          <div class="font-mono text-surface-400">{{ fmtLen(pt.coriolisDriftInches) }} Coriolis</div>
        </div>
        <div class="bg-surface-800 rounded p-2 space-y-0.5">
          <div class="text-surface-400">Total lateral</div>
          <div class="font-mono font-semibold text-surface-100">{{ fmtLen(pt.totalLateralInches) }}</div>
          <div class="font-mono text-surface-400">{{ pt.velocityFps.toFixed(0) }} fps remaining</div>
        </div>
      </div>

      <!-- Aim correction summary -->
      <div v-if="pt" class="flex flex-wrap gap-3 text-xs text-surface-300 bg-surface-800 rounded p-3">
        <span class="text-surface-400 font-semibold">Aim correction to hit center:</span>
        <span>
          <span class="text-surface-400">Elevation </span>
          <span class="font-mono text-amber-400">{{ fmtAngle(Math.abs(pt.dropMOA), Math.abs(pt.dropMRAD)) }} UP</span>
        </span>
        <span>
          <span class="text-surface-400">Windage </span>
          <span class="font-mono text-amber-400">
            {{ fmtAngle(Math.abs(pt.windDriftMOA), Math.abs(pt.windDriftMRAD)) }}
            {{ pt.totalLateralInches >= 0 ? 'LEFT' : 'RIGHT' }}
          </span>
        </span>
      </div>
    </template>
  </div>
</template>
