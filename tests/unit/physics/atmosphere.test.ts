import { describe, it, expect } from 'vitest'
import { buildAtmosphere } from '../../../app/physics/atmosphere'
import { STD_SEA_LEVEL_DENSITY_KGM3 } from '../../../app/constants/atmosphere'

describe('buildAtmosphere', () => {
  it('returns ~1.225 kg/m³ at standard sea-level conditions', () => {
    // ICAO standard: 59°F, 29.92 inHg, 0 ft, 0% humidity
    const atmo = buildAtmosphere(59, 29.92, 0, 0)
    expect(atmo.airDensityKgM3).toBeCloseTo(STD_SEA_LEVEL_DENSITY_KGM3, 2)
  })

  it('returns ~343 m/s speed of sound at standard conditions', () => {
    const atmo = buildAtmosphere(59, 29.92, 0, 0)
    expect(atmo.speedOfSoundMps).toBeCloseTo(340.3, 0) // ±2 m/s tolerance
  })

  it('air density decreases at higher altitude (lower station pressure)', () => {
    // Sea level: 29.92 inHg — 5000 ft: ~24.90 inHg (standard atmosphere)
    const seaLevel = buildAtmosphere(59, 29.92, 0, 0)
    const altitude = buildAtmosphere(59, 24.90, 5000, 0)
    expect(altitude.airDensityKgM3).toBeLessThan(seaLevel.airDensityKgM3)
  })

  it('air density decreases at higher temperature (same pressure)', () => {
    const cold = buildAtmosphere(32, 29.92, 0, 0)
    const hot = buildAtmosphere(100, 29.92, 0, 0)
    expect(hot.airDensityKgM3).toBeLessThan(cold.airDensityKgM3)
  })

  it('speed of sound increases with temperature', () => {
    const cold = buildAtmosphere(0, 29.92, 0, 0)
    const hot = buildAtmosphere(100, 29.92, 0, 0)
    expect(hot.speedOfSoundMps).toBeGreaterThan(cold.speedOfSoundMps)
  })
})
