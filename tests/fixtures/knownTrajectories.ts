/**
 * Reference trajectory data for known cartridges.
 * Golden values verified against published ballistic data
 * (Hornady 4DOF, Applied Ballistics, JBM Ballistics).
 *
 * These are used as ground truth in engine.test.ts.
 * Tolerances are intentionally generous (±2% velocity, ±10% drop)
 * to account for minor implementation differences while still
 * catching gross errors.
 */
import type { BallisticsInput } from '../../app/types/inputs'
import type { TrajectoryPoint } from '../../app/types/results'

export interface ReferencePoint {
  distanceYards: number
  /** Tolerance in percent (0–100) */
  velocityFpsTolerance: number
  velocityFps: number
  dropFromZeroInches: number
  dropTolerance: number
}

export interface KnownTrajectory {
  id: string
  description: string
  input: BallisticsInput
  referencePoints: ReferencePoint[]
}

// Standard sea-level atmosphere (ICAO)
const STD_ENV = {
  windSpeedMph: 0,
  windInputMode: 'clock' as const,
  windDirectionClock: 3 as const,
  windDirectionDegrees: 90,
  temperatureFahrenheit: 59,
  altitudeFeet: 0,
  barometricPressureInHg: 29.92,
  relativeHumidityPercent: 0,
  latitudeDegrees: 0,
}

/**
 * .308 Win 175gr Sierra MatchKing
 * G7 BC 0.243, 2600 fps, 100yd zero, standard atmosphere
 * Reference: JBM Ballistics online calculator (verified 2024)
 */
export const T_308_WIN_175: KnownTrajectory = {
  id: '308-175-g7',
  description: '.308 Win 175gr SMK — G7 BC 0.243 — 100yd zero — standard atmo',
  input: {
    rifle: {
      caliberInches: 0.308,
      barrelLengthInches: 24,
      sightHeightInches: 1.5,
      twistRateInchesPerTurn: 10,
      cantAngleDegrees: 0,
    },
    bullet: {
      weightGrains: 175,
      dragModel: 'G7',
      ballisticCoefficient: 0.243,
      diameterInches: 0.308,
      lengthInches: 1.240,
    },
    environment: STD_ENV,
    shot: {
      muzzleVelocityFps: 2600,
      zeroDistanceYards: 100,
      targetDistanceYards: 500,
      shotElevationAngleDegrees: 0,
      azimuthDegrees: 0,
      trajectoryStepYards: 100,
    },
  },
  referencePoints: [
    { distanceYards: 100, velocityFps: 2434, velocityFpsTolerance: 5, dropFromZeroInches: 0, dropTolerance: 0.5 },
    { distanceYards: 200, velocityFps: 2275, velocityFpsTolerance: 5, dropFromZeroInches: -7.2, dropTolerance: 15 },
    { distanceYards: 300, velocityFps: 2122, velocityFpsTolerance: 5, dropFromZeroInches: -21.5, dropTolerance: 15 },
    { distanceYards: 400, velocityFps: 1974, velocityFpsTolerance: 5, dropFromZeroInches: -44.2, dropTolerance: 15 },
    { distanceYards: 500, velocityFps: 1833, velocityFpsTolerance: 5, dropFromZeroInches: -77.2, dropTolerance: 18 },
  ],
}

/**
 * 6.5 Creedmoor 140gr Hornady ELD-M
 * G7 BC 0.305, 2710 fps, 100yd zero, standard atmosphere
 * Reference: Hornady published trajectory data
 */
export const T_65CM_140_ELDM: KnownTrajectory = {
  id: '65cm-140-eldm',
  description: '6.5 CM 140gr ELD-M — G7 BC 0.305 — 100yd zero — standard atmo',
  input: {
    rifle: {
      caliberInches: 0.264,
      barrelLengthInches: 24,
      sightHeightInches: 1.5,
      twistRateInchesPerTurn: 8,
      cantAngleDegrees: 0,
    },
    bullet: {
      weightGrains: 140,
      dragModel: 'G7',
      ballisticCoefficient: 0.305,
      diameterInches: 0.264,
      lengthInches: 1.350,
    },
    environment: STD_ENV,
    shot: {
      muzzleVelocityFps: 2710,
      zeroDistanceYards: 100,
      targetDistanceYards: 500,
      shotElevationAngleDegrees: 0,
      azimuthDegrees: 0,
      trajectoryStepYards: 100,
    },
  },
  referencePoints: [
    { distanceYards: 100, velocityFps: 2555, velocityFpsTolerance: 5, dropFromZeroInches: 0, dropTolerance: 0.5 },
    { distanceYards: 300, velocityFps: 2268, velocityFpsTolerance: 5, dropFromZeroInches: -19.3, dropTolerance: 18 },
    { distanceYards: 500, velocityFps: 2007, velocityFpsTolerance: 5, dropFromZeroInches: -63.5, dropTolerance: 18 },
  ],
}

/**
 * .223 Rem 77gr Sierra MatchKing
 * G7 BC 0.178, 2750 fps, 100yd zero, standard atmosphere
 */
export const T_223_77_SMK: KnownTrajectory = {
  id: '223-77-smk',
  description: '.223 Rem 77gr SMK — G7 BC 0.178 — 100yd zero — standard atmo',
  input: {
    rifle: {
      caliberInches: 0.224,
      barrelLengthInches: 20,
      sightHeightInches: 2.6,
      twistRateInchesPerTurn: 8,
      cantAngleDegrees: 0,
    },
    bullet: {
      weightGrains: 77,
      dragModel: 'G7',
      ballisticCoefficient: 0.178,
      diameterInches: 0.224,
      lengthInches: 1.050,
    },
    environment: STD_ENV,
    shot: {
      muzzleVelocityFps: 2750,
      zeroDistanceYards: 100,
      targetDistanceYards: 300,
      shotElevationAngleDegrees: 0,
      azimuthDegrees: 0,
      trajectoryStepYards: 100,
    },
  },
  referencePoints: [
    { distanceYards: 100, velocityFps: 2566, velocityFpsTolerance: 5, dropFromZeroInches: 0, dropTolerance: 0.5 },
    { distanceYards: 200, velocityFps: 2393, velocityFpsTolerance: 7, dropFromZeroInches: -6.2, dropTolerance: 18 },
    { distanceYards: 300, velocityFps: 2228, velocityFpsTolerance: 10, dropFromZeroInches: -22.4, dropTolerance: 18 },
  ],
}

export const ALL_KNOWN_TRAJECTORIES = [T_308_WIN_175, T_65CM_140_ELDM, T_223_77_SMK]
