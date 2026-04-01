import { defineStore } from 'pinia'
import type { UnitSystem, AngleUnit, Theme } from '../types/inputs'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    unitSystem: 'imperial' as UnitSystem,
    angleUnit: 'MOA' as AngleUnit,
    theme: 'dark' as Theme,
    sidePanelOpen: false,
    activeResultTab: 'table' as 'table' | 'charts' | '3d' | 'target',
    trajectoryStep: 25 as number,
  }),

  actions: {
    setTheme(theme: Theme) {
      this.theme = theme
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme)
      }
    },
    setUnitSystem(system: UnitSystem) {
      this.unitSystem = system
    },
    setAngleUnit(unit: AngleUnit) {
      this.angleUnit = unit
    },
    toggleSidePanel() {
      this.sidePanelOpen = !this.sidePanelOpen
    },
    setActiveResultTab(tab: 'table' | 'charts' | '3d' | 'target') {
      this.activeResultTab = tab
    },
    initTheme() {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', this.theme)
      }
    },
  },
})
