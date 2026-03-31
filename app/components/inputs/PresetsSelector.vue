<script setup lang="ts">
import { CARTRIDGE_PRESETS } from '../../constants/presets'

const inputStore = useInputStore()
const selected = ref<string | null>(null)

function apply(id: string) {
  const preset = CARTRIDGE_PRESETS.find(p => p.id === id)
  if (preset) {
    inputStore.applyPreset(preset)
    selected.value = id
  }
}
</script>

<template>
  <div>
    <p class="section-label">Quick Load Preset</p>
    <Select
      v-model="selected"
      :options="CARTRIDGE_PRESETS"
      option-label="label"
      option-value="id"
      placeholder="Select a cartridge preset..."
      class="w-full"
      @change="apply(selected!)"
    />
  </div>
</template>
