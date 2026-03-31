/**
 * Ballistics Engine — top-level orchestrator.
 *
 * Takes a fully-typed BallisticsInput, integrates the equations of motion
 * using RK4, and returns a complete TrajectoryResult.
 *
 * Coordinate system:
 *   x = downrange (direction of fire, horizontal)
 *   y = world up
 *   z = lateral right
 *
 * All internal calculations in SI (meters, m/s, kg).
 * Zero-finding uses binary search over initial bore elevation angle.
 */
import type { BallisticsInput } from '../types/inputs'
import type { TrajectoryResult, TrajectoryPoint } from '../types/results'
import type { State6, StepContext } from '../types/physics'
import { rk4Step } from './rk4'
import { dragDeceleration, bcToSI } from './dragModel'
import { buildAtmosphere } from './atmosphere'
import { buildWindVector } from './wind'
import { coriolisAcceleration } from './coriolis'
import { computeSpinDrift } from './spinDrift'
import {
  GRAVITY_MPS2,
} from '../constants/atmosphere'
import {
  FPS_TO_MPS,
  MPH_TO_MPS,
  YD_TO_M,
  M_TO_YD,
  M_TO_IN,
  IN_TO_M,
  FT_TO_M,
  GRAINS_TO_KG,
  DEG_TO_RAD,
  RAD_TO_DEG,
  inchesToMOAAccurate,
  inchesToMRAD,
  kineticEnergyFtLbs,
  MPS_TO_FPS,
} from './units'

const DT = 0.001 // 1ms time step — accurate for all small arms velocities
const MAX_TIME = 10.0 // maximum flight time (seconds) before giving up

/**
 * Build the derivative function for the RK4 integrator.
 * Returns a closure over the StepContext.
 */
function makeDerivFn(ctx: StepContext) {
  return function deriv(state: State6, _t: number): State6 {
    const [x, y, z, vx, vy, vz] = state
    const [wx, wy, wz] = ctx.windVector

    // Velocity relative to air
    const vRelX = vx - wx
    const vRelY = vy - wy
    const vRelZ = vz - wz
    const vRel = Math.sqrt(vRelX * vRelX + vRelY * vRelY + vRelZ * vRelZ)

    if (vRel < 1e-6) {
      // Bullet effectively stopped
      return [vx, vy, vz, 0, -ctx.gravityMps2, 0]
    }

    const mach = vRel / ctx.atmosphere.speedOfSoundMps
    const aDragMag = dragDeceleration(
      vRel,
      mach,
      ctx.atmosphere.airDensityKgM3,
      ctx.bcSI,
      ctx.dragModel,
    )

    // Drag opposes relative velocity direction
    const ax_drag = -aDragMag * (vRelX / vRel)
    const ay_drag = -aDragMag * (vRelY / vRel)
    const az_drag = -aDragMag * (vRelZ / vRel)

    const ax = ax_drag + ctx.coriolisVec[0]
    const ay = ay_drag - ctx.gravityMps2 + ctx.coriolisVec[1]
    const az = az_drag + ctx.coriolisVec[2]

    return [vx, vy, vz, ax, ay, az]
  }
}

/**
 * Integrate the trajectory from initial conditions until the bullet
 * travels past maxDistanceM or hits the ground or time runs out.
 *
 * Returns sampled trajectory points at every stepM meters of downrange distance,
 * plus the time of flight history.
 */
interface RawPoint {
  x: number; y: number; z: number
  vx: number; vy: number; vz: number
  t: number
}

function integrate(
  initialState: State6,
  ctx: StepContext,
  maxDistanceM: number,
  stepM: number,
): RawPoint[] {
  let state: State6 = [...initialState]
  let t = 0
  const points: RawPoint[] = []
  let nextSampleX = 0

  const deriv = makeDerivFn(ctx)

  // Always capture the muzzle point
  points.push({ x: state[0], y: state[1], z: state[2], vx: state[3], vy: state[4], vz: state[5], t: 0 })
  nextSampleX = stepM

  while (state[0] < maxDistanceM && t < MAX_TIME) {
    const prevState = state
    state = rk4Step(state, t, DT, deriv)
    t += DT

    // Sample at each step interval
    if (state[0] >= nextSampleX && prevState[0] < nextSampleX) {
      // Linear interpolation to get exact sample point
      const frac = (nextSampleX - prevState[0]) / Math.max(state[0] - prevState[0], 1e-10)
      const interpState = state.map((v, i) => prevState[i] + (v - prevState[i]) * frac) as State6
      const interpT = (t - DT) + frac * DT
      points.push({
        x: interpState[0], y: interpState[1], z: interpState[2],
        vx: interpState[3], vy: interpState[4], vz: interpState[5],
        t: interpT,
      })
      nextSampleX += stepM
    }
  }

  // Always capture the final point
  const last = points[points.length - 1]
  if (state[0] > last.x + 0.01) {
    points.push({ x: state[0], y: state[1], z: state[2], vx: state[3], vy: state[4], vz: state[5], t })
  }

  return points
}

/**
 * Find the bore elevation angle (radians) that causes the bullet to cross
 * the sight line at the specified zero distance.
 *
 * Sight line: starts at muzzle position (0, sightHeight, 0) and is aimed
 * horizontally at (zeroDistM, sightHeight, 0) for a level shot.
 *
 * Binary search over bore elevation angle.
 */
function findZeroAngle(
  muzzleVelMps: number,
  sightHeightM: number,
  zeroDistM: number,
  ctx: StepContext,
): number {
  let lo = -0.05  // ~−3° in radians (shooting down)
  let hi = 0.15   // ~8° in radians (shooting up)

  for (let iter = 0; iter < 60; iter++) {
    const mid = (lo + hi) / 2
    const initState: State6 = [
      0,
      -sightHeightM, // bore starts below sight line
      0,
      muzzleVelMps * Math.cos(mid),
      muzzleVelMps * Math.sin(mid),
      0,
    ]
    const deriv = makeDerivFn(ctx)
    let state: State6 = [...initState]
    let t = 0
    let y_at_zero = -sightHeightM

    while (state[0] < zeroDistM && t < MAX_TIME) {
      state = rk4Step(state, t, DT, deriv)
      t += DT
      if (state[0] >= zeroDistM) {
        // Interpolate
        const frac = (zeroDistM - state[0] + (state[3] * DT)) / Math.max(state[3] * DT, 1e-10)
        y_at_zero = state[1] - (state[1] - (state[1] - state[4] * DT * frac))
        y_at_zero = state[1]
        break
      }
    }

    // At zero distance, we want y == 0 (on sight line, which is 0 in bore-relative coords)
    // The bore starts at y = -sightHeightM, sight line is at y = 0 at muzzle, 0 at zeroDistM
    if (y_at_zero < 0) lo = mid
    else hi = mid
  }

  return (lo + hi) / 2
}

/**
 * Compute a simple hash of the input for change detection.
 */
function hashInput(input: BallisticsInput): string {
  return JSON.stringify(input).split('').reduce((acc, c) => {
    return ((acc << 5) - acc + c.charCodeAt(0)) | 0
  }, 0).toString(36)
}

/**
 * Main entry point. Compute the full ballistic trajectory.
 */
export function computeTrajectory(input: BallisticsInput): TrajectoryResult {
  const { rifle, bullet, environment, shot } = input

  // ── Convert all inputs to SI ───────────────────────────────
  const muzzleVelMps = shot.muzzleVelocityFps * FPS_TO_MPS
  const sightHeightM = rifle.sightHeightInches * IN_TO_M
  const zeroDistM = shot.zeroDistanceYards * YD_TO_M
  const targetDistM = shot.targetDistanceYards * YD_TO_M
  const stepM = shot.trajectoryStepYards * YD_TO_M
  const maxDistM = Math.max(targetDistM, zeroDistM) + stepM
  const cantRad = rifle.cantAngleDegrees * DEG_TO_RAD
  const shotElevRad = shot.shotElevationAngleDegrees * DEG_TO_RAD

  const massKg = bullet.weightGrains * GRAINS_TO_KG
  const bcSI = bcToSI(bullet.ballisticCoefficient)

  // ── Build atmosphere and wind ──────────────────────────────
  const atmosphere = buildAtmosphere(
    environment.temperatureFahrenheit,
    environment.barometricPressureInHg,
    environment.altitudeFeet,
    environment.relativeHumidityPercent,
  )

  const windVector = buildWindVector(
    environment.windSpeedMph,
    environment.windInputMode,
    environment.windDirectionClock,
    environment.windDirectionDegrees,
  )

  // ── Build step context ─────────────────────────────────────
  // Coriolis is pre-computed using initial velocity approximation
  const approxCoriolisVel: [number, number, number] = [muzzleVelMps, 0, 0]
  const coriolisVec = coriolisAcceleration(
    environment.latitudeDegrees,
    shot.azimuthDegrees,
    approxCoriolisVel,
  )

  const ctx: StepContext = {
    bulletMassKg: massKg,
    bcSI,
    dragModel: bullet.dragModel,
    atmosphere,
    windVector,
    coriolisVec,
    gravityMps2: GRAVITY_MPS2,
  }

  // ── Find zero angle ───────────────────────────────────────
  const zeroAngle = findZeroAngle(muzzleVelMps, sightHeightM, zeroDistM, ctx)

  // ── Apply cant and shot elevation to initial velocity ──────
  // Base: bore aimed along x axis with zeroAngle elevation
  // Shot elevation: tilt the entire shot plane
  // Cant: rotate around x axis
  const totalElevRad = zeroAngle + shotElevRad

  // Initial velocity with cant applied
  // Without cant: vx = v*cos(elev), vy = v*sin(elev), vz = 0
  // With cant θ: vy becomes vy*cos(θ), vz becomes vy*sin(θ)
  const vBase = muzzleVelMps
  const vxInit = vBase * Math.cos(totalElevRad)
  const vyInit = vBase * Math.sin(totalElevRad) * Math.cos(cantRad)
  const vzInit = vBase * Math.sin(totalElevRad) * Math.sin(cantRad)

  // Bore position: always starts below sight line regardless of cant
  const initialState: State6 = [0, -sightHeightM, 0, vxInit, vyInit, vzInit]

  // ── Run integration ────────────────────────────────────────
  const rawPoints = integrate(initialState, ctx, maxDistM, stepM)

  // ── Build sight line ───────────────────────────────────────
  // The sight line at distance x: y = sightHeight * cos(zeroAngle) * (x / zeroDistM)
  // Simplified for small angles: y_sight(x) = -sightHeightM + (sightHeightM / zeroDistM) * x
  // Wait — sight line is straight from (0, 0) to (zeroDistM, 0) in sight-space.
  // Bore at x=0 is at y=-sightHeightM. Bullet crosses sight line (y=0) at ~zeroDistM.
  function sightLineY(_x: number): number {
    return 0 // Sight line is y=0 in our coordinate system (origin = sight at muzzle)
  }

  // Drop from zero = bullet y position - sight line y
  // But we also need the zero crossing behavior
  // The bullet's position in the "drop from bore" sense is just y + sightHeightM
  // Drop from zero = y_bullet - y_sightline = y_bullet (since sight line = 0)

  // ── Convert raw points to TrajectoryPoints ─────────────────
  const points: TrajectoryPoint[] = rawPoints.map((p) => {
    const distYards = p.x * M_TO_YD
    const velMps = Math.sqrt(p.vx * p.vx + p.vy * p.vy + p.vz * p.vz)
    const velFps = velMps * MPS_TO_FPS
    const mach = velMps / atmosphere.speedOfSoundMps

    // Drop: the bullet's y position relative to sight line (y=0)
    // dropInches is negative when below sight line
    const dropInches = p.y * M_TO_IN
    const dropFromZeroInches = p.y * M_TO_IN // same — sight line is y=0

    // Lateral (z axis): positive = right
    const windDriftInches = p.z * M_TO_IN

    // Spin drift (time-based)
    const sd = computeSpinDrift(
      bullet.weightGrains,
      bullet.diameterInches,
      bullet.lengthInches,
      rifle.twistRateInchesPerTurn,
      shot.muzzleVelocityFps,
      p.t,
    )

    // Coriolis drift — use z position from integration (partially from Coriolis already)
    // For display we separate it: approximate horizontal Coriolis
    const coriolisDriftInches = coriolisVec[2] * p.t * p.t * 0.5 * M_TO_IN
    const coriolisVerticalInches = coriolisVec[1] * p.t * p.t * 0.5 * M_TO_IN

    const totalLateralInches = windDriftInches + sd + coriolisDriftInches
    const totalVerticalFromZeroInches = dropFromZeroInches + coriolisVerticalInches

    return {
      distanceYards: distYards,
      dropInches,
      dropFromZeroInches,
      dropMOA: inchesToMOAAccurate(dropFromZeroInches, distYards),
      dropMRAD: inchesToMRAD(dropFromZeroInches, distYards),
      windDriftInches,
      windDriftMOA: inchesToMOAAccurate(windDriftInches, distYards),
      windDriftMRAD: inchesToMRAD(windDriftInches, distYards),
      spinDriftInches: sd,
      coriolisDriftInches,
      coriolisVerticalInches,
      totalLateralInches,
      totalVerticalFromZeroInches,
      velocityFps: velFps,
      machNumber: mach,
      remainingEnergyFtLbs: kineticEnergyFtLbs(massKg, velMps),
      timeOfFlightSeconds: p.t,
      positionMeters: [p.x, p.y, p.z],
    }
  })

  // ── Find max ordinate ──────────────────────────────────────
  let maxOrdinate = -Infinity
  let maxOrdinateDistance = 0
  for (const pt of points) {
    if (pt.dropFromZeroInches > maxOrdinate) {
      maxOrdinate = pt.dropFromZeroInches
      maxOrdinateDistance = pt.distanceYards
    }
  }

  // ── Interpolate at-target point ────────────────────────────
  const targetYards = shot.targetDistanceYards
  const before = points.filter(p => p.distanceYards <= targetYards).at(-1)
  const after = points.find(p => p.distanceYards > targetYards)
  let atTarget = points[points.length - 1]
  if (before && after) {
    const frac = (targetYards - before.distanceYards) / (after.distanceYards - before.distanceYards)
    atTarget = interpolatePoint(before, after, frac, targetYards)
  } else if (before) {
    atTarget = before
  }

  return {
    points,
    zeroFound: true,
    maxOrdinateInches: maxOrdinate,
    maxOrdinateDistanceYards: maxOrdinateDistance,
    atTarget,
    computedAt: new Date().toISOString(),
    inputHash: hashInput(input),
  }
}

/** Linear interpolation between two trajectory points */
function interpolatePoint(a: TrajectoryPoint, b: TrajectoryPoint, t: number, distYards: number): TrajectoryPoint {
  const lerp = (x: number, y: number) => x + (y - x) * t
  return {
    distanceYards: distYards,
    dropInches: lerp(a.dropInches, b.dropInches),
    dropFromZeroInches: lerp(a.dropFromZeroInches, b.dropFromZeroInches),
    dropMOA: lerp(a.dropMOA, b.dropMOA),
    dropMRAD: lerp(a.dropMRAD, b.dropMRAD),
    windDriftInches: lerp(a.windDriftInches, b.windDriftInches),
    windDriftMOA: lerp(a.windDriftMOA, b.windDriftMOA),
    windDriftMRAD: lerp(a.windDriftMRAD, b.windDriftMRAD),
    spinDriftInches: lerp(a.spinDriftInches, b.spinDriftInches),
    coriolisDriftInches: lerp(a.coriolisDriftInches, b.coriolisDriftInches),
    coriolisVerticalInches: lerp(a.coriolisVerticalInches, b.coriolisVerticalInches),
    totalLateralInches: lerp(a.totalLateralInches, b.totalLateralInches),
    totalVerticalFromZeroInches: lerp(a.totalVerticalFromZeroInches, b.totalVerticalFromZeroInches),
    velocityFps: lerp(a.velocityFps, b.velocityFps),
    machNumber: lerp(a.machNumber, b.machNumber),
    remainingEnergyFtLbs: lerp(a.remainingEnergyFtLbs, b.remainingEnergyFtLbs),
    timeOfFlightSeconds: lerp(a.timeOfFlightSeconds, b.timeOfFlightSeconds),
    positionMeters: [
      lerp(a.positionMeters[0], b.positionMeters[0]),
      lerp(a.positionMeters[1], b.positionMeters[1]),
      lerp(a.positionMeters[2], b.positionMeters[2]),
    ],
  }
}
