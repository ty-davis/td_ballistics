<script setup lang="ts">
const settingsStore = useSettingsStore()
const profileStore = useProfileStore()

const showSettings = ref(false)
const showProfiles = ref(false)
</script>

<template>
  <header class="flex items-center justify-between px-4 py-2 bg-bg-surface border-b border-border-subtle">
    <!-- Left: hamburger + title -->
    <div class="flex items-center gap-3">
      <Button
        text
        rounded
        severity="secondary"
        class="lg:hidden"
        aria-label="Toggle side panel"
        @click="settingsStore.toggleSidePanel()"
      >
        <template #icon>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </template>
      </Button>

      <div class="flex items-center gap-2">
        <!-- Crosshair icon -->
        <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" stroke-width="1.5" />
          <circle cx="12" cy="12" r="3" stroke-width="1.5" />
          <line x1="12" y1="3" x2="12" y2="7" stroke-width="1.5" />
          <line x1="12" y1="17" x2="12" y2="21" stroke-width="1.5" />
          <line x1="3" y1="12" x2="7" y2="12" stroke-width="1.5" />
          <line x1="17" y1="12" x2="21" y2="12" stroke-width="1.5" />
        </svg>
        <span class="font-bold tracking-wide text-surface-50">TD Ballistics</span>
        <span v-if="profileStore.activeProfile" class="hidden sm:inline text-xs text-surface-400 ml-1 truncate max-w-[160px]">
          — {{ profileStore.activeProfile.name }}
          <span v-if="profileStore.isDirty" class="text-yellow-400">*</span>
        </span>
      </div>
    </div>

    <!-- Right: actions -->
    <div class="flex items-center gap-1">
      <Button
        label="Profiles"
        size="small"
        outlined
        severity="secondary"
        @click="showProfiles = true"
      />
      <Button
        text
        rounded
        severity="secondary"
        aria-label="Settings"
        @click="showSettings = true"
      >
        <template #icon>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </template>
      </Button>
    </div>
  </header>

  <ProfileManager v-model:visible="showProfiles" />
  <SettingsDrawer v-model:visible="showSettings" />
</template>
