<script setup lang="ts">
const store = useInputStore()

const inputPT = {
  root: 'w-full',
  input: 'w-full bg-input-bg border border-input-border text-input-text rounded px-2 py-1.5 text-sm focus:border-primary focus:outline-none font-mono',
}

const windModeOptions = [
  { label: 'Clock', value: 'clock' },
  { label: 'Degrees', value: 'degrees' },
]

const clockOptions = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1} o'clock`,
  value: i + 1,
}))
</script>

<template>
  <fieldset class="space-y-3">
    <legend class="section-label">Environment</legend>

    <!-- Wind section -->
    <div class="space-y-2">
      <p class="text-xs font-medium text-text-secondary">Wind</p>

      <div class="grid grid-cols-2 gap-2">
        <label class="input-label col-span-2">
          Speed (mph)
          <InputNumber
            v-model="store.environment.windSpeedMph"
            :min="0" :max="100" :step="1"
            :pt="inputPT"
          />
        </label>
      </div>

      <!-- Wind direction mode toggle -->
      <div class="flex gap-1">
        <button
          v-for="opt in windModeOptions"
          :key="opt.value"
          :class="[
            'flex-1 py-1 text-xs rounded border transition-colors',
            store.environment.windInputMode === opt.value
              ? 'bg-primary border-primary text-white'
              : 'bg-bg-elevated border-border-default text-text-secondary',
          ]"
          @click="store.updateEnvironment({ windInputMode: opt.value as 'clock' | 'degrees' })"
        >
          {{ opt.label }}
        </button>
      </div>

      <!-- Clock input -->
      <label v-if="store.environment.windInputMode === 'clock'" class="input-label">
        Direction
        <Select
          v-model="store.environment.windDirectionClock"
          :options="clockOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          :pt="{
            root: 'w-full',
            label: 'bg-input-bg border border-input-border text-input-text rounded-l px-2 py-1.5 text-sm',
            trigger: 'bg-input-bg border-l-0 border border-input-border rounded-r px-2 flex items-center',
            panel: 'bg-bg-elevated border border-border-default rounded shadow-xl mt-1 max-h-48 overflow-auto',
            item: 'px-3 py-1.5 text-sm text-text-primary hover:bg-bg-overlay cursor-pointer',
          }"
        />
      </label>

      <!-- Degrees input -->
      <label v-else class="input-label">
        Direction (°) — 0=tailwind 90=from-right 180=headwind
        <InputNumber
          v-model="store.environment.windDirectionDegrees"
          :min="0" :max="360" :step="1"
          :pt="inputPT"
        />
      </label>
    </div>

    <hr class="border-border-subtle" />

    <!-- Atmosphere -->
    <div class="grid grid-cols-2 gap-2">
      <label class="input-label">
        Temperature (°F)
        <InputNumber
          v-model="store.environment.temperatureFahrenheit"
          :min="-60" :max="130" :step="1"
          :pt="inputPT"
        />
      </label>

      <label class="input-label">
        Altitude (ft)
        <InputNumber
          v-model="store.environment.altitudeFeet"
          :min="0" :max="20000" :step="100"
          :pt="inputPT"
        />
      </label>

      <label class="input-label">
        Pressure (inHg)
        <InputNumber
          v-model="store.environment.barometricPressureInHg"
          :min="25" :max="32" :step="0.01"
          :min-fraction-digits="2" :max-fraction-digits="2"
          :pt="inputPT"
        />
      </label>

      <label class="input-label">
        Humidity (%)
        <InputNumber
          v-model="store.environment.relativeHumidityPercent"
          :min="0" :max="100" :step="1"
          :pt="inputPT"
        />
      </label>

      <label class="input-label col-span-2">
        Latitude (°)
        <InputNumber
          v-model="store.environment.latitudeDegrees"
          :min="-90" :max="90" :step="1"
          :pt="inputPT"
        />
      </label>
    </div>
  </fieldset>
</template>
