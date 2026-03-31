import { defineStore } from 'pinia'
import type { TrajectoryResult } from '../types/results'

export const useResultsStore = defineStore('results', {
  state: () => ({
    result: null as TrajectoryResult | null,
    loading: false,
    error: null as string | null,
    lastInputHash: '',
  }),

  getters: {
    hasResult: (state) => state.result !== null,
    points: (state) => state.result?.points ?? [],
    atTarget: (state) => state.result?.atTarget ?? null,
  },

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },
    setResult(result: TrajectoryResult) {
      this.result = result
      this.lastInputHash = result.inputHash
      this.error = null
      this.loading = false
    },
    setError(message: string) {
      this.error = message
      this.loading = false
    },
    clear() {
      this.result = null
      this.error = null
      this.loading = false
      this.lastInputHash = ''
    },
  },
})
