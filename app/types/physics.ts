import type { DragModel } from './inputs'

/** 6-element state vector for the RK4 integrator: [x, y, z, vx, vy, vz] in SI (m, m/s) */
export type State6 = [number, number, number, number, number, number]

/** Derivative function type for the RK4 integrator */
export type DerivFn = (state: State6, t: number) => State6

export interface DragTableEntry {
  mach: number
  cd: number
}

export interface AtmosphereState {
  /** kg/m³ */
  airDensityKgM3: number
  /** m/s */
  speedOfSoundMps: number
  /** ft — for display */
  densityAltitudeFeet: number
}

/** Wind decomposed into useful components (all in m/s) */
export interface WindComponents {
  /** Positive = tailwind (bullet going with wind), negative = headwind */
  headwindMps: number
  /** Positive = wind from left (pushes bullet right) */
  crosswindMps: number
  /** Vertical wind component */
  verticalWindMps: number
}

/** All the data needed to compute the derivative at each RK4 step */
export interface StepContext {
  bulletMassKg: number
  /** BC in kg/m² (already converted from lb/in²) */
  bcSI: number
  dragModel: DragModel
  atmosphere: AtmosphereState
  /** Wind vector in world space [x, y, z] m/s */
  windVector: [number, number, number]
  /** Coriolis acceleration vector [x, y, z] m/s² (pre-computed, constant) */
  coriolisVec: [number, number, number]
  /** m/s², positive magnitude — gravity already negated when applied to ay */
  gravityMps2: number
}
