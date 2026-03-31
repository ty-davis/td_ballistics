/**
 * Gyroscopic spin drift calculation using the Miller Twist Rule.
 *
 * Right-hand twist barrels produce rightward drift.
 * Left-hand twist barrels produce leftward drift (negative result).
 *
 * References:
 *   - Don Miller, "A New Rule for Estimating Rifling Twist", Precision Shooting, 2005
 *   - Bryan Litz, "Applied Ballistics for Long Range Shooting"
 */
import { IN_TO_M } from './units'

/**
 * Compute the gyroscopic stability factor using the Miller formula.
 *
 * @param bulletWeightGrains     Bullet weight in grains
 * @param bulletDiameterInches   Bullet diameter in inches
 * @param bulletLengthInches     Bullet length in inches
 * @param twistInchesPerTurn     Barrel twist rate (e.g. 10 = 1:10")
 * @param muzzleVelocityFps      Muzzle velocity in fps
 */
export function millerStabilityFactor(
  bulletWeightGrains: number,
  bulletDiameterInches: number,
  bulletLengthInches: number,
  twistInchesPerTurn: number,
  muzzleVelocityFps: number,
): number {
  const d = bulletDiameterInches
  const l = bulletLengthInches / d  // length in calibers
  const m = bulletWeightGrains
  const t = twistInchesPerTurn / d  // twist in calibers/turn
  const v = muzzleVelocityFps

  // Miller formula: Sg = (30 * m) / (rho * d^3 * l * (1 + l^2))
  // Using simplified form with standard air density at sea level
  const sg = (30 * m) / (8.19 * Math.pow(d, 3) * l * (1 + l * l)) * Math.pow(v / 2800, 1 / 3)
  return sg / (t * t) // full Miller formula
}

/**
 * Estimate spin drift in inches at a given distance.
 *
 * @param sg               Gyroscopic stability factor (from millerStabilityFactor)
 * @param timeOfFlightSec  Time of flight to the target in seconds
 * @returns Drift in inches (positive = right for right-hand twist; negate for left-hand twist)
 */
export function spinDriftInches(sg: number, timeOfFlightSec: number): number {
  if (timeOfFlightSec <= 0) return 0
  // Litz empirical formula: drift = 1.25 * (Sg + 1.2) * t^1.83
  return 1.25 * (sg + 1.2) * Math.pow(timeOfFlightSec, 1.83)
}

/**
 * Convenience: compute spin drift inches given all bullet/rifle params.
 * Returns positive value for right-hand twist; caller should negate for LH twist.
 */
export function computeSpinDrift(
  bulletWeightGrains: number,
  bulletDiameterInches: number,
  bulletLengthInches: number,
  twistInchesPerTurn: number,
  muzzleVelocityFps: number,
  timeOfFlightSec: number,
): number {
  const sg = millerStabilityFactor(
    bulletWeightGrains,
    bulletDiameterInches,
    bulletLengthInches,
    twistInchesPerTurn,
    muzzleVelocityFps,
  )
  return spinDriftInches(sg, timeOfFlightSec)
}
