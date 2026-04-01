/**
 * Profile persistence — gun/ammo hardware setup (rifle + bullet).
 * Uses a dedicated localforage createInstance to avoid global config conflicts.
 */
import { ref } from 'vue'
import type { BallisticsProfile } from '../types/profile'

const SCHEMA_VERSION = 1
const STORAGE_KEY = 'profiles'

let _instance: Awaited<ReturnType<typeof import('localforage').default.createInstance>> | null = null

async function getInstance() {
  if (!_instance) {
    const localforage = (await import('localforage')).default
    _instance = localforage.createInstance({ name: 'td_ballistics', storeName: 'profiles' })
  }
  return _instance
}

export function useProfileManager() {
  const profileStore = useProfileStore()
  const inputStore = useInputStore()
  const working = ref(false)

  async function loadAll() {
    try {
      const db = await getInstance()
      const raw = await db.getItem<BallisticsProfile[]>(STORAGE_KEY)
      profileStore.setProfiles(raw ?? [])
    } catch (e) {
      console.error('Failed to load profiles:', e)
      profileStore.setProfiles([])
    }
  }

  async function persistAll() {
    const db = await getInstance()
    // Strip Vue reactivity proxies — IndexedDB structured clone rejects Proxy objects
    await db.setItem(STORAGE_KEY, JSON.parse(JSON.stringify(profileStore.profiles)))
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
        input: {
          rifle: { ...inputStore.rifle },
          bullet: { ...inputStore.bullet },
        },
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
    inputStore.updateRifle(profile.input.rifle)
    inputStore.updateBullet(profile.input.bullet)
    profileStore.setActiveProfile(id)
  }

  async function deleteProfile(id: string) {
    profileStore.removeProfile(id)
    await persistAll()
  }

  return {
    working,
    loadAll,
    persistAll,
    saveCurrentAsProfile,
    loadProfile,
    deleteProfile,
  }
}
