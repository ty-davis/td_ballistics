import type { RifleParams, BulletParams, EnvironmentParams, ShotParams } from './inputs'

/** Saved gun + ammo hardware setup */
export interface BallisticsProfile {
  id: string
  name: string
  notes: string
  createdAt: string
  updatedAt: string
  /** Rifle hardware + bullet — no situational params */
  input: {
    rifle: RifleParams
    bullet: BulletParams
  }
  version: number
}

/** Saved shooting conditions — wind, atmosphere, shot geometry, cant */
export interface EnvironmentProfile {
  id: string
  name: string
  notes: string
  createdAt: string
  updatedAt: string
  input: {
    environment: EnvironmentParams
    shot: ShotParams
    /** Rifle cant is a shooting-condition, not a hardware property */
    cantAngleDegrees: number
  }
  version: number
}

export interface ProfileExportBundle {
  exportedAt: string
  appVersion: string
  profiles: BallisticsProfile[]
  environments: EnvironmentProfile[]
}
