import { defineStore } from 'pinia'
import type { RifleParams, BulletParams, EnvironmentParams, ShotParams } from '../types/inputs'
import { DEFAULT_ENVIRONMENT, CARTRIDGE_PRESETS } from '../constants/presets'
import type { Preset } from '../constants/presets'

const DEFAULT_RIFLE: RifleParams = {
  caliberInches: 0.308,
  barrelLengthInches: 24,
  sightHeightInches: 1.5,
  twistRateInchesPerTurn: 10,
  cantAngleDegrees: 0,
}

const DEFAULT_BULLET: BulletParams = {
  weightGrains: 175,
  dragModel: 'G7',
  ballisticCoefficient: 0.243,
  diameterInches: 0.308,
  lengthInches: 1.240,
}

const DEFAULT_SHOT: ShotParams = {
  muzzleVelocityFps: 2600,
  zeroDistanceYards: 100,
  targetDistanceYards: 500,
  shotElevationAngleDegrees: 0,
  azimuthDegrees: 0,
  trajectoryStepYards: 25,
}

export const useInputStore = defineStore('input', {
  state: () => ({
    rifle: { ...DEFAULT_RIFLE } as RifleParams,
    bullet: { ...DEFAULT_BULLET } as BulletParams,
    environment: { ...DEFAULT_ENVIRONMENT } as EnvironmentParams,
    shot: { ...DEFAULT_SHOT } as ShotParams,
  }),

  getters: {
    allInputs: (state) => ({
      rifle: state.rifle,
      bullet: state.bullet,
      environment: state.environment,
      shot: state.shot,
    }),
  },

  actions: {
    updateRifle(updates: Partial<RifleParams>) {
      Object.assign(this.rifle, updates)
    },
    updateBullet(updates: Partial<BulletParams>) {
      Object.assign(this.bullet, updates)
    },
    updateEnvironment(updates: Partial<EnvironmentParams>) {
      Object.assign(this.environment, updates)
    },
    updateShot(updates: Partial<ShotParams>) {
      Object.assign(this.shot, updates)
    },
    applyPreset(preset: Preset) {
      if (preset.input.rifle) this.rifle = { ...DEFAULT_RIFLE, ...preset.input.rifle }
      if (preset.input.bullet) this.bullet = { ...DEFAULT_BULLET, ...preset.input.bullet }
      if (preset.input.environment) this.environment = { ...DEFAULT_ENVIRONMENT, ...preset.input.environment }
      if (preset.input.shot) this.shot = { ...DEFAULT_SHOT, ...preset.input.shot }
    },
    resetToDefaults() {
      this.rifle = { ...DEFAULT_RIFLE }
      this.bullet = { ...DEFAULT_BULLET }
      this.environment = { ...DEFAULT_ENVIRONMENT }
      this.shot = { ...DEFAULT_SHOT }
    },
  },
})
