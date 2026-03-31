<script setup lang="ts">
import type { Theme } from '../../types/inputs'

defineProps<{ visible: boolean }>()
const emit = defineEmits<{ 'update:visible': [boolean] }>()

const settings = useSettingsStore()

const themes: { label: string; value: Theme; description: string }[] = [
  { label: 'Dark', value: 'dark', description: 'Default tactical dark' },
  { label: 'Light', value: 'light', description: 'Clean light mode' },
  { label: 'Military', value: 'military', description: 'High-contrast green' },
]
</script>

<template>
  <Drawer
    :visible="visible"
    position="right"
    header="Settings"
    :pt="{
      root: 'bg-bg-surface border-l border-border-default w-80',
      header: 'px-6 py-4 border-b border-border-subtle flex items-center justify-between',
      headerTitle: 'text-text-primary font-semibold',
      closeButton: 'text-text-muted hover:text-text-primary',
      content: 'px-6 py-4',
    }"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="space-y-6">
      <!-- Theme -->
      <div>
        <p class="section-label">Theme</p>
        <div class="space-y-1.5">
          <button
            v-for="theme in themes"
            :key="theme.value"
            :class="[
              'w-full flex items-center gap-3 p-3 rounded border transition-colors text-left',
              settings.theme === theme.value
                ? 'border-primary bg-primary/10'
                : 'border-border-default bg-bg-elevated hover:bg-bg-overlay',
            ]"
            @click="settings.setTheme(theme.value)"
          >
            <div :class="[
              'w-4 h-4 rounded-full border-2 flex-shrink-0',
              settings.theme === theme.value ? 'border-primary bg-primary' : 'border-border-strong',
            ]" />
            <div>
              <p class="text-sm font-medium text-text-primary">{{ theme.label }}</p>
              <p class="text-xs text-text-muted">{{ theme.description }}</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Units -->
      <div>
        <p class="section-label">Units</p>
        <div class="flex gap-2">
          <button
            v-for="u in ['imperial', 'metric'] as const"
            :key="u"
            :class="[
              'flex-1 py-2 rounded border text-sm transition-colors capitalize',
              settings.unitSystem === u
                ? 'bg-primary border-primary text-white'
                : 'border-border-default text-text-secondary hover:text-text-primary bg-bg-elevated',
            ]"
            @click="settings.setUnitSystem(u)"
          >
            {{ u }}
          </button>
        </div>
      </div>

      <!-- Angular unit -->
      <div>
        <p class="section-label">Angular Unit</p>
        <div class="flex gap-2">
          <button
            v-for="a in ['MOA', 'MRAD'] as const"
            :key="a"
            :class="[
              'flex-1 py-2 rounded border text-sm transition-colors',
              settings.angleUnit === a
                ? 'bg-primary border-primary text-white'
                : 'border-border-default text-text-secondary hover:text-text-primary bg-bg-elevated',
            ]"
            @click="settings.setAngleUnit(a)"
          >
            {{ a }}
          </button>
        </div>
      </div>

      <!-- About -->
      <div class="pt-4 border-t border-border-subtle">
        <p class="section-label">About</p>
        <p class="text-xs text-text-muted leading-relaxed">
          TD Ballistics — a point-mass ballistic solver using the G1/G7 drag models,
          RK4 integration, Coriolis and Eötvös effects, and gyroscopic spin drift.
        </p>
      </div>
    </div>
  </Drawer>
</template>
