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
      class="w-full text-sm"
      :pt="{
        root: 'w-full',
        label: 'text-text-primary text-sm px-3 py-2 bg-bg-elevated border border-border-default rounded-l cursor-pointer',
        trigger: 'bg-bg-elevated border-l-0 border border-border-default rounded-r px-2 flex items-center',
        panel: 'bg-bg-elevated border border-border-default rounded shadow-xl mt-1',
        item: 'px-3 py-2 text-sm text-text-primary hover:bg-bg-overlay cursor-pointer',
      }"
      @change="apply(selected!)"
    />
  </div>
</template>
