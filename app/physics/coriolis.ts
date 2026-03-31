/**
 * Coriolis and Eötvös effect accelerations.
 *
 * The Coriolis effect deflects bullets due to Earth's rotation.
 * In the northern hemisphere, bullets deflect rightward (for eastward shots).
 * The Eötvös effect is the vertical component of Coriolis for east/west shots.
 *
 * At 1000 yards, the total Coriolis effect is typically < 1 MOA.
 * It matters most for extreme long range (1000+ yards).
 */
import { EARTH_ROTATION_RAD_S } from '../constants/atmosphere'
import { DEG_TO_RAD } from './units'

/**
 * Compute the Coriolis acceleration vector.
 *
 * Coriolis acceleration: a_c = -2 * (omega × v)
 *
 * where omega is Earth's rotation vector expressed in the local NED frame
 * (North-East-Down), then rotated to our shot coordinate system.
 *
 * Our coordinate system:
 *   x = downrange (azimuth direction)
 *   y = world up
 *   z = rightward (perpendicular to x in horizontal plane)
 *
 * @param latitudeDeg   Shooter's latitude (-90 = south pole, +90 = north pole)
 * @param azimuthDeg    Compass bearing of shot (0 = North, 90 = East, 180 = South, 270 = West)
 * @param velocityMps   [vx, vy, vz] bullet velocity in m/s at the time of calculation
 * @returns [ax, ay, az] Coriolis acceleration in m/s²
 */
export function coriolisAcceleration(
  latitudeDeg: number,
  azimuthDeg: number,
  velocityMps: [number, number, number],
): [number, number, number] {
  const lat = latitudeDeg * DEG_TO_RAD
  const az = azimuthDeg * DEG_TO_RAD
  const omega = EARTH_ROTATION_RAD_S

  const [vx, vy, vz] = velocityMps

  // Earth rotation vector in NED frame (North, East, Down):
  // omega_NED = omega * [cos(lat), 0, -sin(lat)]
  // (North component = omega*cos(lat), Down component = -omega*sin(lat), East = 0)

  // Rotate omega into shot frame (x=downrange, y=up, z=right):
  // Downrange in NED = [cos(az), sin(az), 0] (horizontal)
  // Up in NED = [0, 0, -1]
  // Right in NED = [-sin(az), cos(az), 0]

  // omega in shot frame:
  const omega_x = omega * Math.cos(lat) * Math.cos(az)         // downrange component
  const omega_y = omega * Math.sin(lat)                         // up component (positive in N hemisphere)
  const omega_z = -omega * Math.cos(lat) * Math.sin(az)        // rightward component

  // a_coriolis = -2 * (omega × v)
  // omega × v:
  const cross_x = omega_y * vz - omega_z * vy
  const cross_y = omega_z * vx - omega_x * vz
  const cross_z = omega_x * vy - omega_y * vx

  return [-2 * cross_x, -2 * cross_y, -2 * cross_z]
}
