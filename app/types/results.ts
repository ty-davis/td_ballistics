/** A single point along the computed trajectory */
export interface TrajectoryPoint {
  distanceYards: number

  /** Raw drop below bore axis (always negative after leaving muzzle) */
  dropInches: number
  /** Drop relative to the zero (what the shooter corrects for) — negative = below zero */
  dropFromZeroInches: number
  dropMOA: number
  dropMRAD: number

  /** Positive = to the right (for a right crosswind with positive wind direction) */
  windDriftInches: number
  windDriftMOA: number
  windDriftMRAD: number

  /** Gyroscopic spin drift — right for right-hand twist */
  spinDriftInches: number
  /** Horizontal Coriolis drift */
  coriolisDriftInches: number
  /** Vertical Eötvös component */
  coriolisVerticalInches: number

  /** Total combined lateral shift (wind + spin drift + Coriolis) */
  totalLateralInches: number
  /** Total combined vertical shift from zero */
  totalVerticalFromZeroInches: number

  velocityFps: number
  machNumber: number
  remainingEnergyFtLbs: number
  timeOfFlightSeconds: number

  /** [x, y, z] in meters for 3D scene (x=downrange, y=up, z=lateral) */
  positionMeters: [number, number, number]
}

/** Full result returned by the ballistics engine */
export interface TrajectoryResult {
  points: TrajectoryPoint[]

  /** Whether a valid zero crossing was found */
  zeroFound: boolean

  /** The highest point above line of sight during flight (positive = above) */
  maxOrdinateInches: number
  maxOrdinateDistanceYards: number

  /** Interpolated values exactly at the target distance */
  atTarget: TrajectoryPoint

  /** ISO timestamp when this was computed */
  computedAt: string

  /** Hash of the inputs — used for change detection / cache invalidation */
  inputHash: string
}

/** One row in the come-up / firing data table */
export interface ComeUpRow {
  distanceYards: number
  elevationMOA: number
  elevationMRAD: number
  windageMOA: number
  windageMRAD: number
  velocityFps: number
  energyFtLbs: number
  timeOfFlightSeconds: number
}
