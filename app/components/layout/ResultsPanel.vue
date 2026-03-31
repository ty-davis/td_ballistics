<script setup lang="ts">
const settingsStore = useSettingsStore()
const resultsStore = useResultsStore()

const tabs = [
  { label: 'Data Table', key: 'table' },
  { label: 'Charts', key: 'charts' },
  { label: '3D View', key: '3d' },
]
</script>

<template>
  <main class="flex-1 flex flex-col min-h-0 overflow-hidden bg-surface-950">
    <!-- Tab bar -->
    <div class="flex items-center gap-1 px-3 py-2 bg-surface-900 border-b border-surface-700 flex-wrap">
      <Button
        v-for="tab in tabs"
        :key="tab.key"
        :label="tab.label"
        size="small"
        :severity="settingsStore.activeResultTab === tab.key ? 'primary' : 'secondary'"
        :outlined="settingsStore.activeResultTab !== tab.key"
        :text="settingsStore.activeResultTab !== tab.key"
        @click="settingsStore.setActiveResultTab(tab.key as 'table' | 'charts' | '3d')"
      />
      <div class="ml-auto">
        <UnitToggle />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="resultsStore.loading" class="flex-1 flex items-center justify-center">
      <ProgressSpinner style="width: 40px; height: 40px" />
    </div>

    <!-- Error -->
    <div v-else-if="resultsStore.error" class="flex-1 flex items-center justify-center p-8">
      <Message severity="error" :closable="false">{{ resultsStore.error }}</Message>
    </div>

    <!-- Empty state -->
    <div v-else-if="!resultsStore.hasResult" class="flex-1 flex items-center justify-center p-8">
      <div class="text-center text-surface-500">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p class="text-sm">Configure your rifle and ammo, then hit Calculate.</p>
      </div>
    </div>

    <!-- Results -->
    <template v-else>
      <div class="flex-1 overflow-auto p-4 space-y-4">
        <SummaryCard />

        <div v-show="settingsStore.activeResultTab === 'table'" class="space-y-4">
          <TrajectoryTable />
          <ComeUpTable />
        </div>

        <div v-show="settingsStore.activeResultTab === 'charts'">
          <ClientOnly>
            <ChartContainer />
          </ClientOnly>
        </div>

        <div v-show="settingsStore.activeResultTab === '3d'">
          <ClientOnly>
            <TrajectoryScene />
          </ClientOnly>
        </div>
      </div>
    </template>
  </main>
</template>
