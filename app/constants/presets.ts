import type { BallisticsInput } from '../types/inputs'

/** Common rifle + ammo presets for quick-fill */
export interface Preset {
  id: string
  label: string
  description: string
  input: Partial<BallisticsInput>
}

export const CARTRIDGE_PRESETS: Preset[] = [
  {
    id: '308win-175smk',
    label: '.308 Win — 175gr Sierra MatchKing',
    description: 'Classic long-range match load. G7 BC 0.243.',
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
      shot: {
        muzzleVelocityFps: 2600,
        zeroDistanceYards: 100,
        targetDistanceYards: 500,
        shotElevationAngleDegrees: 0,
        azimuthDegrees: 0,
        trajectoryStepYards: 25,
      },
    },
  },
  {
    id: '65cm-140eldm',
    label: '6.5 Creedmoor — 140gr Hornady ELD-M',
    description: 'Premier long-range factory load. G7 BC 0.305.',
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
      shot: {
        muzzleVelocityFps: 2710,
        zeroDistanceYards: 100,
        targetDistanceYards: 500,
        shotElevationAngleDegrees: 0,
        azimuthDegrees: 0,
        trajectoryStepYards: 25,
      },
    },
  },
  {
    id: '223rem-77smk',
    label: '.223 Rem — 77gr Sierra MatchKing',
    description: 'AR-15 long-range load. G7 BC 0.178.',
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
      shot: {
        muzzleVelocityFps: 2750,
        zeroDistanceYards: 100,
        targetDistanceYards: 300,
        shotElevationAngleDegrees: 0,
        azimuthDegrees: 0,
        trajectoryStepYards: 25,
      },
    },
  },
  {
    id: '338lm-300smk',
    label: '.338 Lapua Mag — 300gr Sierra MatchKing',
    description: 'Extreme long range. G7 BC 0.368.',
    input: {
      rifle: {
        caliberInches: 0.338,
        barrelLengthInches: 27,
        sightHeightInches: 1.75,
        twistRateInchesPerTurn: 10,
        cantAngleDegrees: 0,
      },
      bullet: {
        weightGrains: 300,
        dragModel: 'G7',
        ballisticCoefficient: 0.368,
        diameterInches: 0.338,
        lengthInches: 1.740,
      },
      shot: {
        muzzleVelocityFps: 2650,
        zeroDistanceYards: 100,
        targetDistanceYards: 1000,
        shotElevationAngleDegrees: 0,
        azimuthDegrees: 0,
        trajectoryStepYards: 50,
      },
    },
  },
]

/** Standard environmental defaults (sea level, 59°F, calm) */
export const DEFAULT_ENVIRONMENT = {
  windSpeedMph: 0,
  windInputMode: 'clock' as const,
  windDirectionClock: 3 as const,
  windDirectionDegrees: 90,
  temperatureFahrenheit: 59,
  altitudeFeet: 0,
  barometricPressureInHg: 29.92,
  relativeHumidityPercent: 0,
  latitudeDegrees: 45,
}
