<script setup lang="ts">
const settings = useSettingsStore()

const unitOptions = [
  { label: 'Imperial', value: 'imperial' },
  { label: 'Metric', value: 'metric' },
]

const angleOptions = [
  { label: 'MOA', value: 'MOA' },
  { label: 'MRAD', value: 'MRAD' },
]
</script>

<template>
  <div class="flex items-center gap-2">
    <SelectButton
      v-model="settings.unitSystem"
      :options="unitOptions"
      option-label="label"
      option-value="value"
      size="small"
    />
    <SelectButton
      v-model="settings.angleUnit"
      :options="angleOptions"
      option-label="label"
      option-value="value"
      size="small"
    />
  </div>
</template>
