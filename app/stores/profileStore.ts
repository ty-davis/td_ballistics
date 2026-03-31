import { defineStore } from 'pinia'
import type { BallisticsProfile } from '../types/profile'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profiles: [] as BallisticsProfile[],
    activeProfileId: null as string | null,
    isDirty: false,
    loaded: false,
  }),

  getters: {
    activeProfile: (state): BallisticsProfile | null =>
      state.profiles.find(p => p.id === state.activeProfileId) ?? null,
    profileCount: (state) => state.profiles.length,
  },

  actions: {
    setProfiles(profiles: BallisticsProfile[]) {
      this.profiles = profiles
      this.loaded = true
    },
    addProfile(profile: BallisticsProfile) {
      this.profiles.push(profile)
      this.activeProfileId = profile.id
      this.isDirty = false
    },
    updateProfile(id: string, updates: Partial<BallisticsProfile>) {
      const idx = this.profiles.findIndex(p => p.id === id)
      if (idx !== -1) {
        this.profiles[idx] = { ...this.profiles[idx], ...updates, updatedAt: new Date().toISOString() }
      }
    },
    removeProfile(id: string) {
      this.profiles = this.profiles.filter(p => p.id !== id)
      if (this.activeProfileId === id) {
        this.activeProfileId = this.profiles[0]?.id ?? null
      }
    },
    setActiveProfile(id: string | null) {
      this.activeProfileId = id
      this.isDirty = false
    },
    markDirty() {
      this.isDirty = true
    },
  },
})
