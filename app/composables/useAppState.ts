/**
 * Persists the active input state and settings to IndexedDB so they survive refresh.
 * Separate from profiles/environments — this is the "last used" working state.
 */

const INPUTS_KEY = 'last_inputs'
const SETTINGS_KEY = 'last_settings'

let _instance: Awaited<ReturnType<typeof import('localforage').default.createInstance>> | null = null

async function getInstance() {
  if (!_instance) {
    const localforage = (await import('localforage')).default
    _instance = localforage.createInstance({ name: 'td_ballistics', storeName: 'app_state' })
  }
  return _instance
}

export function useAppState() {
  const inputStore = useInputStore()
  const settingsStore = useSettingsStore()

  async function loadState() {
    try {
      const db = await getInstance()

      const inputs = await db.getItem<Record<string, unknown>>(INPUTS_KEY)
      if (inputs) inputStore.$patch(inputs)

      const settings = await db.getItem<Record<string, unknown>>(SETTINGS_KEY)
      if (settings) settingsStore.$patch(settings)
    } catch (e) {
      console.error('Failed to load app state:', e)
    }
  }

  async function persistState() {
    try {
      const db = await getInstance()
      // Strip Vue reactivity proxies before writing — IDB structured clone rejects Proxy objects
      await db.setItem(INPUTS_KEY, JSON.parse(JSON.stringify({
        rifle: inputStore.rifle,
        bullet: inputStore.bullet,
        environment: inputStore.environment,
        shot: inputStore.shot,
      })))
      await db.setItem(SETTINGS_KEY, {
        unitSystem: settingsStore.unitSystem,
        angleUnit: settingsStore.angleUnit,
        theme: settingsStore.theme,
        activeResultTab: settingsStore.activeResultTab,
        trajectoryStep: settingsStore.trajectoryStep,
      })
    } catch (e) {
      console.error('Failed to persist app state:', e)
    }
  }

  return { loadState, persistState }
}
