<script setup lang="ts">
const store = useInputStore()

const clockOptions = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1} o'clock`,
  value: i + 1,
}))

const windModeOptions = [
  { label: 'Clock', value: 'clock' },
  { label: 'Degrees', value: 'degrees' },
]
</script>

<template>
  <fieldset class="space-y-3">
    <legend class="section-label">Environment</legend>

    <!-- Wind -->
    <div class="space-y-2">
      <p class="text-xs font-semibold text-text-secondary">Wind</p>

      <label class="input-label">
        Speed (mph)
        <InputNumber
          v-model="store.environment.windSpeedMph"
          :min="0" :max="100" :step="1"
          fluid
        />
      </label>

      <SelectButton
        v-model="store.environment.windInputMode"
        :options="windModeOptions"
        option-label="label"
        option-value="value"
        class="w-full"
      />

      <label v-if="store.environment.windInputMode === 'clock'" class="input-label">
        Direction
        <Select
          v-model="store.environment.windDirectionClock"
          :options="clockOptions"
          option-label="label"
          option-value="value"
          class="w-full"
        />
      </label>

      <label v-else class="input-label">
        Direction (°) — 0=tail 90=from-right 180=head
        <InputNumber
          v-model="store.environment.windDirectionDegrees"
          :min="0" :max="360" :step="1"
          fluid
        />
      </label>
    </div>

    <Divider />

    <!-- Atmosphere -->
    <div class="grid grid-cols-2 gap-2">
      <label class="input-label">
        Temperature (°F)
        <InputNumber
          v-model="store.environment.temperatureFahrenheit"
          :min="-60" :max="130" :step="1"
          fluid
        />
      </label>

      <label class="input-label">
        Altitude (ft)
        <InputNumber
          v-model="store.environment.altitudeFeet"
          :min="0" :max="20000" :step="100"
          fluid
        />
      </label>

      <label class="input-label">
        Pressure (inHg)
        <InputNumber
          v-model="store.environment.barometricPressureInHg"
          :min="25" :max="32" :step="0.01"
          :min-fraction-digits="2" :max-fraction-digits="2"
          fluid
        />
      </label>

      <label class="input-label">
        Humidity (%)
        <InputNumber
          v-model="store.environment.relativeHumidityPercent"
          :min="0" :max="100" :step="1"
          fluid
        />
      </label>

      <label class="input-label col-span-2">
        Latitude (°)
        <InputNumber
          v-model="store.environment.latitudeDegrees"
          :min="-90" :max="90" :step="1"
          fluid
        />
      </label>
    </div>
  </fieldset>
</template>
