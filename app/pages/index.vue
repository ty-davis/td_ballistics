<script setup lang="ts">
const settings = useSettingsStore()
const inputStore = useInputStore()
const { setupAutoCalculate, calculate } = useBallisticsCalculator()
const { loadAll: loadProfiles } = useProfileManager()
const { loadAll: loadEnvironments } = useEnvironmentManager()
const { loadState, persistState } = useAppState()

useHead({
  title: 'TD Ballistics',
  meta: [{ name: 'description', content: 'Precision ballistics calculator with 3D trajectory visualization' }],
  link: [{ rel: 'preconnect', href: 'https://fonts.bunny.net' }],
})

const debouncedPersist = useDebounce(persistState, 800)

onMounted(async () => {
  // Load persisted state — order matters: app state first, then profiles/environments in parallel
  await loadState()
  settings.initTheme()
  await Promise.all([loadProfiles(), loadEnvironments()])

  setupAutoCalculate()
  calculate()

  // Auto-save inputs and settings 800ms after any change
  watch(() => inputStore.allInputs, debouncedPersist, { deep: true })
  watch(
    () => ({
      unitSystem: settings.unitSystem,
      angleUnit: settings.angleUnit,
      theme: settings.theme,
      activeResultTab: settings.activeResultTab,
      trajectoryStep: settings.trajectoryStep,
    }),
    debouncedPersist,
    { deep: true },
  )
})
</script>

<template>
  <div class="flex flex-col h-dvh overflow-hidden">
    <TopBar />
    <div class="flex flex-1 min-h-0 overflow-hidden">
      <SidePanel />
      <ResultsPanel />
    </div>
  </div>
</template>
