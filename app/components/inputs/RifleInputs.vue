<script setup lang="ts">
const store = useInputStore()
</script>

<template>
  <fieldset class="space-y-3">
    <legend class="section-label">Rifle</legend>

    <div class="grid grid-cols-2 gap-2">
      <label class="input-label">
        Caliber (in)
        <InputNumber
          v-model="store.rifle.caliberInches"
          :min="0.1" :max="1.0" :step="0.001"
          :min-fraction-digits="3" :max-fraction-digits="3"
          fluid
        />
      </label>

      <label class="input-label">
        Barrel (in)
        <InputNumber
          v-model="store.rifle.barrelLengthInches"
          :min="10" :max="36" :step="1"
          fluid
        />
      </label>

      <label class="input-label">
        Sight Height (in)
        <InputNumber
          v-model="store.rifle.sightHeightInches"
          :min="0.5" :max="5.0" :step="0.1"
          :min-fraction-digits="2" :max-fraction-digits="2"
          fluid
        />
      </label>

      <label class="input-label">
        Twist (in/turn)
        <InputNumber
          v-model="store.rifle.twistRateInchesPerTurn"
          :min="4" :max="20" :step="1"
          fluid
        />
      </label>
    </div>

    <!-- Cant angle slider -->
    <label class="input-label">
      <span>
        Rifle Cant
        <span class="text-accent font-mono text-xs ml-1">{{ store.rifle.cantAngleDegrees > 0 ? '+' : '' }}{{ store.rifle.cantAngleDegrees }}°</span>
      </span>
      <div class="flex items-center gap-2">
        <span class="text-xs text-text-muted">−90°</span>
        <input
          v-model.number="store.rifle.cantAngleDegrees"
          type="range" min="-90" max="90" step="1"
          class="flex-1 accent-primary"
        />
        <span class="text-xs text-text-muted">+90°</span>
      </div>
      <div class="text-xs text-text-muted mt-0.5">
        0° = scope directly above bore · + = clockwise
      </div>
    </label>
  </fieldset>
</template>

<style>
.input-label {
  @apply flex flex-col gap-1 text-xs font-medium text-text-secondary;
}
</style>
