<script setup lang="ts">
const settingsStore = useSettingsStore()
const resultsStore = useResultsStore()

const tabs = [
  { key: 'table', label: 'Data Table' },
  { key: 'charts', label: 'Charts' },
  { key: '3d', label: '3D View' },
] as const
</script>

<template>
  <main class="flex-1 flex flex-col min-h-0 overflow-hidden">
    <!-- Tab bar -->
    <div class="flex items-center gap-1 px-4 py-2 bg-bg-surface border-b border-border-default">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="[
          'px-4 py-1.5 rounded text-sm font-medium transition-colors',
          settingsStore.activeResultTab === tab.key
            ? 'bg-primary text-white'
            : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
        ]"
        @click="settingsStore.setActiveResultTab(tab.key)"
      >
        {{ tab.label }}
      </button>

      <div class="ml-auto">
        <UnitToggle />
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="resultsStore.loading" class="flex-1 flex items-center justify-center">
      <div class="text-text-secondary text-sm animate-pulse">Calculating...</div>
    </div>

    <!-- Error state -->
    <div v-else-if="resultsStore.error" class="flex-1 flex items-center justify-center p-8">
      <div class="text-center">
        <p class="text-status-error text-sm">{{ resultsStore.error }}</p>
      </div>
    </div>

    <!-- No result yet -->
    <div v-else-if="!resultsStore.hasResult" class="flex-1 flex items-center justify-center p-8">
      <div class="text-center text-text-muted">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p class="text-sm">Configure your rifle and ammo, then hit Calculate.</p>
      </div>
    </div>

    <!-- Results -->
    <template v-else>
      <div class="flex-1 overflow-auto p-4">
        <!-- Summary card always visible -->
        <SummaryCard class="mb-4" />

        <!-- Tab content -->
        <div v-show="settingsStore.activeResultTab === 'table'" class="space-y-4">
          <TrajectoryTable />
          <ComeUpTable />
        </div>

        <div v-show="settingsStore.activeResultTab === 'charts'" class="space-y-4">
          <ChartContainer />
        </div>

        <div v-show="settingsStore.activeResultTab === '3d'">
          <TrajectoryScene />
        </div>
      </div>
    </template>
  </main>
</template>
