<script setup lang="ts">
const store = useInputStore()
</script>

<template>
  <fieldset class="space-y-3">
    <legend class="section-label">Shot Parameters</legend>

    <div class="grid grid-cols-2 gap-2">
      <label class="input-label">
        Muzzle Velocity (fps)
        <InputNumber
          v-model="store.shot.muzzleVelocityFps"
          :min="500" :max="5000" :step="10"
          fluid
        />
      </label>

      <label class="input-label">
        Zero Distance (yds)
        <InputNumber
          v-model="store.shot.zeroDistanceYards"
          :min="25" :max="1000" :step="25"
          fluid
        />
      </label>

      <label class="input-label col-span-2">
        Target Distance (yds)
        <InputNumber
          v-model="store.shot.targetDistanceYards"
          :min="25" :max="3000" :step="25"
          fluid
        />
      </label>

      <label class="input-label">
        Azimuth (°)
        <InputNumber
          v-model="store.shot.azimuthDegrees"
          :min="0" :max="360" :step="1"
          fluid
        />
      </label>

      <label class="input-label">
        Table Step (yds)
        <InputNumber
          v-model="store.shot.trajectoryStepYards"
          :min="10" :max="100" :step="5"
          fluid
        />
      </label>
    </div>

    <!-- Shot elevation angle -->
    <label class="input-label">
      <span>
        Shot Angle
        <span class="text-accent font-mono text-xs ml-1">{{ store.shot.shotElevationAngleDegrees > 0 ? '+' : '' }}{{ store.shot.shotElevationAngleDegrees }}°</span>
      </span>
      <div class="flex items-center gap-2">
        <span class="text-xs text-text-muted">−90°</span>
        <input
          v-model.number="store.shot.shotElevationAngleDegrees"
          type="range" min="-90" max="90" step="1"
          class="flex-1 accent-primary"
        />
        <span class="text-xs text-text-muted">+90°</span>
      </div>
      <div class="text-xs text-text-muted">0° = level · + = uphill · − = downhill</div>
    </label>
  </fieldset>
</template>
