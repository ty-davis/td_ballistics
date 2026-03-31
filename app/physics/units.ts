/** Unit conversion constants and pure functions. No Vue/Pinia dependencies. */

// Length
export const IN_TO_M = 0.0254
export const FT_TO_M = 0.3048
export const YD_TO_M = 0.9144
export const M_TO_YD = 1 / 0.9144
export const M_TO_IN = 1 / 0.0254
export const M_TO_FT = 1 / 0.3048

// Velocity
export const FPS_TO_MPS = 0.3048
export const MPS_TO_FPS = 1 / 0.3048
export const MPH_TO_MPS = 0.44704
export const MPS_TO_MPH = 1 / 0.44704

// Mass
export const GRAINS_TO_KG = 6.479891e-5
export const KG_TO_GRAINS = 1 / 6.479891e-5
export const LB_TO_KG = 0.453592

// Area / Ballistic Coefficient
export const LB_PER_IN2_TO_KG_PER_M2 = 703.07   // BC conversion factor
export const KG_PER_M2_TO_LB_PER_IN2 = 1 / 703.07

// Pressure
export const INHG_TO_PA = 3386.389
export const PA_TO_INHG = 1 / 3386.389

// Temperature
export const fahrenheitToKelvin = (f: number): number => (f - 32) * (5 / 9) + 273.15
export const celsiusToKelvin = (c: number): number => c + 273.15
export const kelvinToFahrenheit = (k: number): number => (k - 273.15) * (9 / 5) + 32
export const kelvinToCelsius = (k: number): number => k - 273.15

// Angular
export const DEG_TO_RAD = Math.PI / 180
export const RAD_TO_DEG = 180 / Math.PI
export const MOA_TO_RAD = DEG_TO_RAD / 60
export const RAD_TO_MOA = 1 / MOA_TO_RAD
export const MRAD_TO_RAD = 0.001
export const RAD_TO_MRAD = 1000

/** Convert inches of displacement at a given distance to MOA */
export function inchesToMOA(inches: number, distanceYards: number): number {
  if (distanceYards === 0) return 0
  return (inches / distanceYards) * (180 / Math.PI) * 60 / (1 / 36)
  // Simpler: 1 MOA = 1.047" per 100 yards
}

/** Accurate conversion: inches at distance → MOA */
export function inchesToMOAAccurate(inches: number, distanceYards: number): number {
  if (distanceYards === 0) return 0
  const distanceInches = distanceYards * 36
  return Math.atan2(Math.abs(inches), distanceInches) * RAD_TO_MOA * Math.sign(inches)
}

/** Accurate conversion: inches at distance → MRAD */
export function inchesToMRAD(inches: number, distanceYards: number): number {
  if (distanceYards === 0) return 0
  const distanceInches = distanceYards * 36
  return Math.atan2(Math.abs(inches), distanceInches) * RAD_TO_MRAD * Math.sign(inches)
}

/** Energy in ft·lbs from mass in kg and velocity in m/s */
export function kineticEnergyFtLbs(massKg: number, velocityMps: number): number {
  const joules = 0.5 * massKg * velocityMps * velocityMps
  return joules * 0.737562 // J to ft·lbs
}
