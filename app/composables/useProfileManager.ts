/**
 * Profile persistence composable — wraps localForage for save/load/export.
 */
import { ref } from 'vue'
import type { BallisticsProfile, ProfileExportBundle } from '../types/profile'

const STORAGE_KEY = 'td_ballistics_profiles'
const SCHEMA_VERSION = 1

export function useProfileManager() {
  const profileStore = useProfileStore()
  const inputStore = useInputStore()
  const working = ref(false)

  async function getLocalForage() {
    const localforage = (await import('localforage')).default
    localforage.config({ name: 'td_ballistics', storeName: 'profiles' })
    return localforage
  }

  async function loadAll() {
    try {
      const lf = await getLocalForage()
      const raw = await lf.getItem<BallisticsProfile[]>(STORAGE_KEY)
      profileStore.setProfiles(raw ?? [])
    } catch (e) {
      console.error('Failed to load profiles:', e)
      profileStore.setProfiles([])
    }
  }

  async function persistAll() {
    const lf = await getLocalForage()
    await lf.setItem(STORAGE_KEY, profileStore.profiles)
  }

  async function saveCurrentAsProfile(name: string, notes = ''): Promise<BallisticsProfile> {
    working.value = true
    try {
      const profile: BallisticsProfile = {
        id: crypto.randomUUID(),
        name,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        input: { ...inputStore.allInputs },
        version: SCHEMA_VERSION,
      }
      profileStore.addProfile(profile)
      await persistAll()
      return profile
    } finally {
      working.value = false
    }
  }

  async function loadProfile(id: string) {
    const profile = profileStore.profiles.find(p => p.id === id)
    if (!profile) return
    inputStore.applyPreset({ id: profile.id, label: profile.name, description: '', input: profile.input })
    profileStore.setActiveProfile(id)
  }

  async function updateProfile(id: string, name: string, notes: string) {
    profileStore.updateProfile(id, { name, notes })
    await persistAll()
  }

  async function deleteProfile(id: string) {
    profileStore.removeProfile(id)
    await persistAll()
  }

  function exportAsJson(): string {
    const bundle: ProfileExportBundle = {
      exportedAt: new Date().toISOString(),
      appVersion: '1.0.0',
      profiles: profileStore.profiles,
    }
    return JSON.stringify(bundle, null, 2)
  }

  async function importFromJson(json: string): Promise<number> {
    const bundle: ProfileExportBundle = JSON.parse(json)
    const imported = bundle.profiles ?? []
    for (const p of imported) {
      if (!profileStore.profiles.find(existing => existing.id === p.id)) {
        profileStore.addProfile(p)
      }
    }
    await persistAll()
    return imported.length
  }

  return {
    working,
    loadAll,
    saveCurrentAsProfile,
    loadProfile,
    updateProfile,
    deleteProfile,
    exportAsJson,
    importFromJson,
  }
}
