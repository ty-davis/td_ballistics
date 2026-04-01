/**
 * Environment persistence — shooting conditions (wind, atmosphere, shot params, cant).
 * Uses a dedicated localforage createInstance to avoid global config conflicts.
 */
import { ref } from 'vue'
import type { EnvironmentProfile } from '../types/profile'

const SCHEMA_VERSION = 1
const STORAGE_KEY = 'environments'

let _instance: Awaited<ReturnType<typeof import('localforage').default.createInstance>> | null = null

async function getInstance() {
  if (!_instance) {
    const localforage = (await import('localforage')).default
    _instance = localforage.createInstance({ name: 'td_ballistics', storeName: 'environments' })
  }
  return _instance
}

export function useEnvironmentManager() {
  const envStore = useEnvironmentStore()
  const inputStore = useInputStore()
  const working = ref(false)

  async function loadAll() {
    try {
      const db = await getInstance()
      const raw = await db.getItem<EnvironmentProfile[]>(STORAGE_KEY)
      envStore.setEnvironments(raw ?? [])
    } catch (e) {
      console.error('Failed to load environments:', e)
      envStore.setEnvironments([])
    }
  }

  async function persistAll() {
    const db = await getInstance()
    await db.setItem(STORAGE_KEY, JSON.parse(JSON.stringify(envStore.environments)))
  }

  async function saveCurrentAsEnvironment(name: string, notes = ''): Promise<EnvironmentProfile> {
    working.value = true
    try {
      const env: EnvironmentProfile = {
        id: crypto.randomUUID(),
        name,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        input: {
          environment: { ...inputStore.environment },
          shot: { ...inputStore.shot },
          cantAngleDegrees: inputStore.rifle.cantAngleDegrees,
        },
        version: SCHEMA_VERSION,
      }
      envStore.addEnvironment(env)
      await persistAll()
      return env
    } finally {
      working.value = false
    }
  }

  async function loadEnvironment(id: string) {
    const env = envStore.environments.find(e => e.id === id)
    if (!env) return
    inputStore.updateEnvironment(env.input.environment)
    inputStore.updateShot(env.input.shot)
    inputStore.updateRifle({ cantAngleDegrees: env.input.cantAngleDegrees })
    envStore.setActiveEnvironment(id)
  }

  async function deleteEnvironment(id: string) {
    envStore.removeEnvironment(id)
    await persistAll()
  }

  return {
    working,
    loadAll,
    persistAll,
    saveCurrentAsEnvironment,
    loadEnvironment,
    deleteEnvironment,
  }
}
