/**
 * Wind vector utilities.
 * Decomposes user-supplied wind into [x, y, z] world-space vector
 * where x=downrange, y=up, z=lateral-right.
 */
import type { WindInputMode, WindClock } from '../types/inputs'
import { MPH_TO_MPS, DEG_TO_RAD } from './units'

/**
 * Convert clock notation to a degrees-from-shot-direction value.
 * 12 o'clock = headwind (180°), 6 o'clock = tailwind (0°),
 * 3 o'clock = right crosswind (90°), 9 o'clock = left crosswind (270°).
 */
function clockToDegrees(clock: WindClock): number {
  // 6 o'clock = 0° (tailwind), 12 o'clock = 180° (headwind)
  // 3 o'clock = 90° (from the right), 9 o'clock = 270° (from the left)
  return ((clock - 6 + 12) % 12) * 30
}

/**
 * Build the wind velocity vector in world space.
 *
 * Convention:
 *   - x axis: downrange (direction of fire)
 *   - y axis: world up
 *   - z axis: rightward (positive wind from left pushes bullet rightward = +z)
 *
 * A wind FROM the left pushes the bullet to the right (+z).
 * A headwind comes FROM the front (+x direction) so wind_x is negative (opposing bullet).
 *
 * @param windSpeedMph     Wind speed in mph
 * @param inputMode        'clock' or 'degrees'
 * @param clockPos         Clock position (1–12) if mode = 'clock'
 * @param degreesFromShot  Degrees if mode = 'degrees' (0 = tailwind, 90 = from right, 180 = headwind)
 * @param verticalWindMph  Optional vertical wind (positive = upward)
 * @returns [windX, windY, windZ] in m/s
 */
export function buildWindVector(
  windSpeedMph: number,
  inputMode: WindInputMode,
  clockPos: WindClock,
  degreesFromShot: number,
  verticalWindMph = 0,
): [number, number, number] {
  const speedMps = windSpeedMph * MPH_TO_MPS
  const vertMps = verticalWindMph * MPH_TO_MPS

  if (speedMps === 0) return [vertMps > 0 ? 0 : 0, vertMps, 0]

  const angleDeg = inputMode === 'clock' ? clockToDegrees(clockPos) : degreesFromShot
  const angleRad = angleDeg * DEG_TO_RAD

  // 0° = tailwind (wind blowing in same direction as bullet = +x component)
  // 90° = wind from right (blowing bullet to the left = -z)
  // 180° = headwind (opposing bullet = -x component)
  // 270° = wind from left (blowing bullet to the right = +z)
  const windX = speedMps * Math.cos(angleRad)  // tailwind = +x (adds to bullet speed)
  const windZ = -speedMps * Math.sin(angleRad) // from-right = -z (pushes bullet left)

  return [windX, vertMps, windZ]
}
