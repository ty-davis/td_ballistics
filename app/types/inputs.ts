export type DragModel = 'G1' | 'G7'
export type UnitSystem = 'imperial' | 'metric'
export type WindInputMode = 'clock' | 'degrees'
export type AngleUnit = 'MOA' | 'MRAD'
export type Theme = 'dark' | 'light' | 'military'

/** 1–12 o'clock wind notation */
export type WindClock = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface RifleParams {
  /** e.g. 0.308 */
  caliberInches: number
  /** e.g. 24 */
  barrelLengthInches: number
  /** Scope center above bore centerline, e.g. 1.5 */
  sightHeightInches: number
  /** e.g. 10 means 1:10" twist */
  twistRateInchesPerTurn: number
  /** -90 (CCW) to +90 (CW) degrees; 0 = scope directly above bore */
  cantAngleDegrees: number
}

export interface BulletParams {
  /** Bullet weight in grains */
  weightGrains: number
  /** Which standard drag model this BC is for */
  dragModel: DragModel
  /** Ballistic coefficient in lb/in² for the chosen model */
  ballisticCoefficient: number
  /** Bullet diameter — usually same as caliber */
  diameterInches: number
  /** Bullet length in inches (for spin drift stability factor) */
  lengthInches: number
}

export interface EnvironmentParams {
  windSpeedMph: number
  windInputMode: WindInputMode
  /** Clock position when mode = 'clock' — 3 o'clock = pure right crosswind */
  windDirectionClock: WindClock
  /** Degrees 0–360 when mode = 'degrees' — 90° = from the right (left-to-right) */
  windDirectionDegrees: number
  temperatureFahrenheit: number
  altitudeFeet: number
  barometricPressureInHg: number
  relativeHumidityPercent: number
  /** Shooter's latitude in degrees (-90 to +90) for Coriolis calculation */
  latitudeDegrees: number
}

export interface ShotParams {
  muzzleVelocityFps: number
  /** Distance at which sights are zeroed */
  zeroDistanceYards: number
  /** Distance to the intended target */
  targetDistanceYards: number
  /** Positive = uphill, negative = downhill, in degrees */
  shotElevationAngleDegrees: number
  /** Compass bearing of shot (0 = North, 90 = East) — affects Coriolis direction */
  azimuthDegrees: number
  /** How often to sample the trajectory (yards between data points) */
  trajectoryStepYards: number
}

/** Full aggregate of all user inputs passed to the ballistics engine */
export interface BallisticsInput {
  rifle: RifleParams
  bullet: BulletParams
  environment: EnvironmentParams
  shot: ShotParams
}
