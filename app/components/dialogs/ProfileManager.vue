<script setup lang="ts">
const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ 'update:visible': [boolean] }>()

const profileStore = useProfileStore()
const { saveCurrentAsProfile, loadProfile, deleteProfile, exportAsJson, importFromJson, working } = useProfileManager()

const newName = ref('')
const newNotes = ref('')
const saveError = ref('')
const importText = ref('')
const showImport = ref(false)
const importError = ref('')
const importSuccess = ref('')

async function save() {
  if (!newName.value.trim()) {
    saveError.value = 'Name is required'
    return
  }
  await saveCurrentAsProfile(newName.value.trim(), newNotes.value)
  newName.value = ''
  newNotes.value = ''
  saveError.value = ''
}

async function load(id: string) {
  await loadProfile(id)
  emit('update:visible', false)
}

async function doDelete(id: string) {
  await deleteProfile(id)
}

function downloadExport() {
  const json = exportAsJson()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `td_ballistics_profiles_${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

async function doImport() {
  try {
    const count = await importFromJson(importText.value)
    importSuccess.value = `Imported ${count} profile(s)`
    importText.value = ''
    importError.value = ''
  } catch {
    importError.value = 'Invalid JSON format'
  }
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Profiles"
    :style="{ width: '90vw', maxWidth: '480px' }"
    :pt="{
      root: 'bg-bg-surface border border-border-default rounded-xl shadow-2xl',
      header: 'px-6 py-4 border-b border-border-subtle flex items-center justify-between',
      headerTitle: 'text-text-primary font-semibold',
      closeButton: 'text-text-muted hover:text-text-primary',
      content: 'px-6 py-4',
    }"
    @update:visible="emit('update:visible', $event)"
  >
    <!-- Save new profile -->
    <div class="space-y-2 mb-6">
      <p class="section-label">Save Current Setup</p>
      <input
        v-model="newName"
        type="text"
        placeholder="Profile name..."
        class="w-full bg-input-bg border border-input-border text-input-text rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"
        @keydown.enter="save"
      />
      <textarea
        v-model="newNotes"
        placeholder="Notes (optional)..."
        rows="2"
        class="w-full bg-input-bg border border-input-border text-input-text rounded px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none"
      />
      <p v-if="saveError" class="text-status-error text-xs">{{ saveError }}</p>
      <button
        class="w-full py-2 rounded bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors"
        :disabled="working"
        @click="save"
      >
        Save Profile
      </button>
    </div>

    <!-- Profile list -->
    <div class="space-y-2 mb-4">
      <p class="section-label">Saved Profiles ({{ profileStore.profileCount }})</p>
      <div v-if="!profileStore.profileCount" class="text-text-muted text-sm text-center py-4">
        No profiles saved yet.
      </div>
      <div
        v-for="profile in profileStore.profiles"
        :key="profile.id"
        :class="[
          'flex items-center gap-2 p-3 rounded border transition-colors',
          profileStore.activeProfileId === profile.id
            ? 'border-primary bg-primary/10'
            : 'border-border-default bg-bg-elevated hover:bg-bg-overlay',
        ]"
      >
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-text-primary truncate">{{ profile.name }}</p>
          <p v-if="profile.notes" class="text-xs text-text-muted truncate">{{ profile.notes }}</p>
          <p class="text-xs text-text-muted">{{ new Date(profile.updatedAt).toLocaleDateString() }}</p>
        </div>
        <button
          class="px-2 py-1 text-xs rounded bg-primary hover:bg-primary-hover text-white transition-colors"
          @click="load(profile.id)"
        >
          Load
        </button>
        <button
          class="px-2 py-1 text-xs rounded border border-status-error text-status-error hover:bg-status-error/10 transition-colors"
          @click="doDelete(profile.id)"
        >
          Del
        </button>
      </div>
    </div>

    <!-- Import / Export -->
    <div class="border-t border-border-subtle pt-4 flex gap-2 flex-wrap">
      <button
        class="px-3 py-1.5 text-xs rounded border border-border-default text-text-secondary hover:text-text-primary transition-colors"
        @click="downloadExport"
      >
        Export JSON
      </button>
      <button
        class="px-3 py-1.5 text-xs rounded border border-border-default text-text-secondary hover:text-text-primary transition-colors"
        @click="showImport = !showImport"
      >
        Import JSON
      </button>
    </div>

    <div v-if="showImport" class="mt-3 space-y-2">
      <textarea
        v-model="importText"
        rows="4"
        placeholder="Paste exported JSON here..."
        class="w-full bg-input-bg border border-input-border text-input-text rounded px-3 py-2 text-xs focus:border-primary focus:outline-none resize-none font-mono"
      />
      <p v-if="importError" class="text-status-error text-xs">{{ importError }}</p>
      <p v-if="importSuccess" class="text-status-success text-xs">{{ importSuccess }}</p>
      <button
        class="px-3 py-1.5 text-xs rounded bg-primary hover:bg-primary-hover text-white transition-colors"
        @click="doImport"
      >
        Import
      </button>
    </div>
  </Dialog>
</template>
