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
    @update:visible="emit('update:visible', $event)"
  >
    <!-- Save new profile -->
    <div class="space-y-2 mb-5">
      <p class="section-label">Save Current Setup</p>
      <InputText
        v-model="newName"
        placeholder="Profile name..."
        class="w-full"
        @keydown.enter="save"
      />
      <Textarea
        v-model="newNotes"
        placeholder="Notes (optional)..."
        rows="2"
        class="w-full"
        auto-resize
      />
      <Message v-if="saveError" severity="error" :closable="false">{{ saveError }}</Message>
      <Button
        label="Save Profile"
        class="w-full"
        :loading="working"
        @click="save"
      />
    </div>

    <Divider />

    <!-- Profile list -->
    <div class="space-y-2 mb-4">
      <p class="section-label">Saved Profiles ({{ profileStore.profileCount }})</p>
      <p v-if="!profileStore.profileCount" class="text-text-muted text-sm text-center py-4">
        No profiles saved yet.
      </p>
      <div
        v-for="profile in profileStore.profiles"
        :key="profile.id"
        class="flex items-center gap-2 p-3 rounded border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
      >
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ profile.name }}</p>
          <p v-if="profile.notes" class="text-xs text-text-muted truncate">{{ profile.notes }}</p>
          <p class="text-xs text-text-muted">{{ new Date(profile.updatedAt).toLocaleDateString() }}</p>
        </div>
        <Button label="Load" size="small" @click="load(profile.id)" />
        <Button label="Del" size="small" severity="danger" outlined @click="deleteProfile(profile.id)" />
      </div>
    </div>

    <Divider />

    <!-- Import / Export -->
    <div class="flex gap-2 flex-wrap">
      <Button label="Export JSON" size="small" outlined @click="downloadExport" />
      <Button label="Import JSON" size="small" outlined @click="showImport = !showImport" />
    </div>

    <div v-if="showImport" class="mt-3 space-y-2">
      <Textarea
        v-model="importText"
        rows="4"
        placeholder="Paste exported JSON here..."
        class="w-full font-mono text-xs"
      />
      <Message v-if="importError" severity="error" :closable="false">{{ importError }}</Message>
      <Message v-if="importSuccess" severity="success" :closable="false">{{ importSuccess }}</Message>
      <Button label="Import" size="small" @click="doImport" />
    </div>
  </Dialog>
</template>
