/**
 * Drag model: G1 and G7 Cd lookup with linear interpolation.
 * All functions are pure (no side effects, no framework deps).
 */
import type { DragModel } from '../types/inputs'
import { G1_TABLE, G7_TABLE } from '../constants/dragTables'
import { tableInterp } from '../utils/interpolate'
import { LB_PER_IN2_TO_KG_PER_M2 } from './units'

/**
 * Look up the drag coefficient Cd for a given Mach number in the specified model.
 * Linearly interpolates between table entries.
 */
export function getCd(mach: number, model: DragModel): number {
  const table = model === 'G1' ? G1_TABLE : G7_TABLE
  return tableInterp(table, mach, e => e.mach, e => e.cd)
}

/**
 * Convert a BC from lb/in² to kg/m² (SI).
 * G1 and G7 BCs are both expressed in lb/in² — same conversion applies.
 */
export function bcToSI(bcImperial: number): number {
  return bcImperial * LB_PER_IN2_TO_KG_PER_M2
}

/**
 * Compute the drag deceleration magnitude (m/s²) for a bullet.
 *
 * Derivation (industry BC convention where SD = m/d², not m/(πd²/4)):
 *
 *   BC_industry = SD_industry / i  where SD_industry = m_kg / d_m²
 *   i = form factor = Cd_bullet / Cd_standard
 *   Cd_bullet = i * Cd_std = (SD_industry / BC) * Cd_std
 *
 *   F_drag = 0.5 * rho * v² * (π/4 * d²) * Cd_bullet
 *          = 0.5 * rho * v² * (π/4 * d²) * (m/d² / BC) * Cd_std
 *          = 0.5 * rho * v² * (π/4) * (m/BC) * Cd_std
 *
 *   a_drag = F_drag / m = (π/8) * rho * v² * Cd_std / BC_si
 *                       = 0.5 * (π/4) * rho * v² * Cd_std / BC_si
 *
 * The π/4 factor arises because the industry SD convention uses d² rather
 * than the true cross-sectional area (π/4 * d²).
 *
 * @param vRelMps    Bullet speed RELATIVE to air (m/s)
 * @param mach       Mach number of relative velocity
 * @param rhoKgM3    Air density (kg/m³)
 * @param bcSI       Ballistic coefficient in kg/m² (use bcToSI() to convert)
 * @param dragModel  'G1' or 'G7'
 * @returns Magnitude of drag deceleration (m/s²) — always positive
 */
export function dragDeceleration(
  vRelMps: number,
  mach: number,
  rhoKgM3: number,
  bcSI: number,
  dragModel: DragModel,
): number {
  const cd = getCd(mach, dragModel)
  // (π/8) = 0.5 * (π/4) — see derivation above
  return (Math.PI / 8) * rhoKgM3 * vRelMps * vRelMps * cd / bcSI
}
