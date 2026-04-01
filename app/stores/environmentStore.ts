import { defineStore } from 'pinia'
import type { EnvironmentProfile } from '../types/profile'

export const useEnvironmentStore = defineStore('environment', {
  state: () => ({
    environments: [] as EnvironmentProfile[],
    activeEnvironmentId: null as string | null,
    loaded: false,
  }),

  getters: {
    activeEnvironment: (state): EnvironmentProfile | null =>
      state.environments.find(e => e.id === state.activeEnvironmentId) ?? null,
    environmentCount: (state) => state.environments.length,
  },

  actions: {
    setEnvironments(environments: EnvironmentProfile[]) {
      this.environments = environments
      this.loaded = true
    },
    addEnvironment(env: EnvironmentProfile) {
      this.environments.push(env)
      this.activeEnvironmentId = env.id
    },
    updateEnvironment(id: string, updates: Partial<EnvironmentProfile>) {
      const idx = this.environments.findIndex(e => e.id === id)
      if (idx !== -1) {
        this.environments[idx] = { ...this.environments[idx], ...updates, updatedAt: new Date().toISOString() }
      }
    },
    removeEnvironment(id: string) {
      this.environments = this.environments.filter(e => e.id !== id)
      if (this.activeEnvironmentId === id) {
        this.activeEnvironmentId = this.environments[0]?.id ?? null
      }
    },
    setActiveEnvironment(id: string | null) {
      this.activeEnvironmentId = id
    },
  },
})
