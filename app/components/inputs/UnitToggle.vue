<script setup lang="ts">
const settings = useSettingsStore()
</script>

<template>
  <div class="flex items-center gap-2 text-xs">
    <button
      :class="[
        'px-2 py-1 rounded border transition-colors',
        settings.unitSystem === 'imperial'
          ? 'bg-primary border-primary text-white'
          : 'border-border-default text-text-secondary hover:text-text-primary',
      ]"
      @click="settings.setUnitSystem('imperial')"
    >
      Imperial
    </button>
    <button
      :class="[
        'px-2 py-1 rounded border transition-colors',
        settings.unitSystem === 'metric'
          ? 'bg-primary border-primary text-white'
          : 'border-border-default text-text-secondary hover:text-text-primary',
      ]"
      @click="settings.setUnitSystem('metric')"
    >
      Metric
    </button>
    <div class="w-px h-4 bg-border-default" />
    <button
      :class="[
        'px-2 py-1 rounded border transition-colors',
        settings.angleUnit === 'MOA'
          ? 'bg-bg-elevated border-border-strong text-text-primary'
          : 'border-border-default text-text-secondary hover:text-text-primary',
      ]"
      @click="settings.setAngleUnit('MOA')"
    >
      MOA
    </button>
    <button
      :class="[
        'px-2 py-1 rounded border transition-colors',
        settings.angleUnit === 'MRAD'
          ? 'bg-bg-elevated border-border-strong text-text-primary'
          : 'border-border-default text-text-secondary hover:text-text-primary',
      ]"
      @click="settings.setAngleUnit('MRAD')"
    >
      MRAD
    </button>
  </div>
</template>
