<script setup lang="ts">
const settings = useSettingsStore()
const { setupAutoCalculate, calculate } = useBallisticsCalculator()
const { loadAll } = useProfileManager()

useHead({
  title: 'TD Ballistics',
  meta: [{ name: 'description', content: 'Precision ballistics calculator with 3D trajectory visualization' }],
  link: [{ rel: 'preconnect', href: 'https://fonts.bunny.net' }],
})

onMounted(async () => {
  settings.initTheme()
  await loadAll()
  setupAutoCalculate()
  // Run initial calculation with defaults
  calculate()
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
