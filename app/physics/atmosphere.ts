/**
 * Atmospheric model for ballistics calculations.
 * Computes air density, speed of sound, and density altitude.
 * All inputs/outputs in SI unless otherwise noted.
 */
import type { AtmosphereState } from '../types/physics'
import {
  STD_SEA_LEVEL_PRESSURE_PA,
  STD_SEA_LEVEL_TEMP_K,
  STD_LAPSE_RATE,
  GAS_CONSTANT_AIR,
  SPECIFIC_HEAT_RATIO,
  R_UNIVERSAL,
  M_DRY_AIR,
  M_WATER_VAPOR,
} from '../constants/atmosphere'
import { fahrenheitToKelvin, INHG_TO_PA, FT_TO_M, M_TO_FT } from './units'

/**
 * Saturation vapor pressure (Pa) using the Magnus formula.
 * @param tempK temperature in Kelvin
 */
function saturationVaporPressure(tempK: number): number {
  const tempC = tempK - 273.15
  return 610.94 * Math.exp((17.625 * tempC) / (243.04 + tempC))
}

/**
 * Compute air density (kg/m³) from temperature, pressure, and humidity.
 * Uses the mixing ratio / moist air formula.
 */
function computeAirDensity(
  tempK: number,
  pressurePa: number,
  relativeHumidity: number, // 0–100
): number {
  // Partial pressure of water vapor
  const pv = (relativeHumidity / 100) * saturationVaporPressure(tempK)
  // Partial pressure of dry air
  const pd = pressurePa - pv
  // Density from ideal gas law for moist air
  return (pd * M_DRY_AIR + pv * M_WATER_VAPOR) / (R_UNIVERSAL * tempK)
}

/**
 * Speed of sound in moist air (m/s).
 */
function computeSpeedOfSound(tempK: number, relativeHumidity: number): number {
  // Humidity correction: slightly increases speed of sound
  const pv = (relativeHumidity / 100) * saturationVaporPressure(tempK)
  // Approximate mole fraction of water vapor
  const xv = pv / STD_SEA_LEVEL_PRESSURE_PA
  const gammaEff = SPECIFIC_HEAT_RATIO * (1 + 0.48 * xv)
  return Math.sqrt(gammaEff * GAS_CONSTANT_AIR * tempK * (1 + 0.608 * xv))
}

/**
 * Compute density altitude in feet.
 * Density altitude is the altitude at which the current air density
 * would occur in the standard atmosphere — used for display only.
 */
function computeDensityAltitudeFeet(
  tempK: number,
  pressurePa: number,
  relativeHumidity: number,
): number {
  const density = computeAirDensity(tempK, pressurePa, relativeHumidity)
  // Invert ICAO standard atmosphere rho(h) = rho0 * (1 - L*h/T0)^(g/R*L - 1)
  // Simplification using pressure altitude approach
  const pressureAltitudeM =
    (STD_SEA_LEVEL_TEMP_K / STD_LAPSE_RATE) *
    (1 - Math.pow(pressurePa / STD_SEA_LEVEL_PRESSURE_PA, 0.190284))
  // Correction for temperature deviation from standard
  const stdTempAtAlt = STD_SEA_LEVEL_TEMP_K - STD_LAPSE_RATE * pressureAltitudeM
  const tempCorrectionFt = (118.8 * (tempK - stdTempAtAlt)) / 1
  return pressureAltitudeM * M_TO_FT + tempCorrectionFt
}

/**
 * Build an AtmosphereState from user-supplied environmental inputs.
 *
 * @param tempF          Temperature in °F
 * @param pressureInHg   Barometric pressure in inHg
 * @param altitudeFt     Altitude above sea level in feet
 * @param humidityPct    Relative humidity 0–100
 */
export function buildAtmosphere(
  tempF: number,
  pressureInHg: number,
  altitudeFt: number,
  humidityPct: number,
): AtmosphereState {
  const tempK = fahrenheitToKelvin(tempF)
  const pressurePa = pressureInHg * INHG_TO_PA

  // Adjust pressure for altitude using barometric formula if user provided
  // station pressure (at the shooting site). If they provided sea-level pressure,
  // we derive station pressure. We treat the input as station pressure.
  const altitudeM = altitudeFt * FT_TO_M
  // Use altitude to scale pressure if barometric input appears to be sea-level:
  // (Most practical use: user inputs local station baro reading — use as-is)
  const stationPressurePa = pressurePa

  return {
    airDensityKgM3: computeAirDensity(tempK, stationPressurePa, humidityPct),
    speedOfSoundMps: computeSpeedOfSound(tempK, humidityPct),
    densityAltitudeFeet: computeDensityAltitudeFeet(tempK, stationPressurePa, humidityPct),
  }
}
