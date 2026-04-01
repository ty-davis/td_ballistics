<script setup lang="ts">
const settingsStore = useSettingsStore()
const { calculate } = useBallisticsCalculator()
</script>

<template>
  <!-- Mobile overlay -->
  <Teleport to="body">
    <Transition name="overlay">
      <div
        v-if="settingsStore.sidePanelOpen"
        class="fixed inset-0 bg-black/60 z-30 lg:hidden"
        @click="settingsStore.toggleSidePanel()"
      />
    </Transition>
  </Teleport>

  <!-- Panel -->
  <aside
    :class="[
      'fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto',
      'w-80 lg:w-72 xl:w-80',
      'bg-bg-surface border-r border-border-subtle',
      'flex flex-col overflow-hidden',
      'transition-transform duration-300',
      settingsStore.sidePanelOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <PresetsSelector />
      <Divider />
      <RifleInputs />
      <BulletInputs />
      <ShotInputs />
      <EnvironmentInputs />
    </div>

    <!-- Calculate button -->
    <div class="p-4 border-t border-border-subtle">
      <Button
        label="Calculate Trajectory"
        class="w-full"
        @click="calculate()"
      />
    </div>
  </aside>
</template>

<style scoped>
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.2s; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
</style>
