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
  <Drawer
    :visible="visible"
    position="right"
    header="Settings"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="space-y-6 p-1">
      <!-- Theme -->
      <div>
        <p class="section-label">Theme</p>
        <div class="space-y-2">
          <div
            v-for="theme in themes"
            :key="theme.value"
            :class="[
              'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
              settings.theme === theme.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800',
            ]"
            @click="settings.setTheme(theme.value)"
          >
            <RadioButton
              :model-value="settings.theme"
              :value="theme.value"
              :input-id="theme.value"
              @change="settings.setTheme(theme.value)"
            />
            <label :for="theme.value" class="cursor-pointer">
              <p class="text-sm font-medium">{{ theme.label }}</p>
              <p class="text-xs text-text-muted">{{ theme.description }}</p>
            </label>
          </div>
        </div>
      </div>

      <Divider />

      <!-- Units -->
      <div>
        <p class="section-label">Units</p>
        <SelectButton
          v-model="settings.unitSystem"
          :options="unitOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          @change="settings.setUnitSystem(settings.unitSystem)"
        />
      </div>

      <!-- Angular unit -->
      <div>
        <p class="section-label">Angular Corrections</p>
        <SelectButton
          v-model="settings.angleUnit"
          :options="angleOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          @change="settings.setAngleUnit(settings.angleUnit)"
        />
      </div>

      <Divider />

      <!-- About -->
      <div>
        <p class="section-label">About</p>
        <p class="text-xs text-text-muted leading-relaxed">
          TD Ballistics — point-mass solver using G1/G7 drag models,
          RK4 integration, Coriolis/Eötvös, and gyroscopic spin drift.
        </p>
      </div>
    </div>
  </Drawer>
</template>
