<script setup lang="ts">
const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ 'update:visible': [boolean] }>()

const envStore = useEnvironmentStore()
const { saveCurrentAsEnvironment, loadEnvironment, deleteEnvironment, working } = useEnvironmentManager()

const newName = ref('')
const newNotes = ref('')
const saveError = ref('')

async function save() {
  if (!newName.value.trim()) {
    saveError.value = 'Name is required'
    return
  }
  await saveCurrentAsEnvironment(newName.value.trim(), newNotes.value)
  newName.value = ''
  newNotes.value = ''
  saveError.value = ''
}

async function load(id: string) {
  await loadEnvironment(id)
  emit('update:visible', false)
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Environments"
    :style="{ width: '90vw', maxWidth: '480px' }"
    @update:visible="emit('update:visible', $event)"
  >
    <!-- Save current environment -->
    <div class="space-y-2 mb-5">
      <p class="section-label">Save Current Conditions</p>
      <p class="text-xs text-text-muted">Saves wind, atmosphere, shot angle, target distance, and rifle cant.</p>
      <InputText
        v-model="newName"
        placeholder="Environment name..."
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
        label="Save Environment"
        class="w-full"
        :loading="working"
        @click="save"
      />
    </div>

    <Divider />

    <!-- Environment list -->
    <div class="space-y-2">
      <p class="section-label">Saved Environments ({{ envStore.environmentCount }})</p>
      <p v-if="!envStore.environmentCount" class="text-text-muted text-sm text-center py-4">
        No environments saved yet.
      </p>
      <div
        v-for="env in envStore.environments"
        :key="env.id"
        class="flex items-center gap-2 p-3 rounded border border-border-default hover:bg-bg-elevated transition-colors"
      >
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ env.name }}</p>
          <p v-if="env.notes" class="text-xs text-text-muted truncate">{{ env.notes }}</p>
          <p class="text-xs text-text-muted">
            Wind {{ env.input.environment.windSpeedMph }}mph ·
            {{ env.input.shot.shotElevationAngleDegrees }}° angle ·
            {{ new Date(env.updatedAt).toLocaleDateString() }}
          </p>
        </div>
        <Button label="Load" size="small" @click="load(env.id)" />
        <Button label="Del" size="small" severity="danger" outlined @click="deleteEnvironment(env.id)" />
      </div>
    </div>
  </Dialog>
</template>
