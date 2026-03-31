import { describe, it, expect } from 'vitest'
import { getCd, bcToSI, dragDeceleration } from '../../../app/physics/dragModel'

describe('getCd', () => {
  it('returns correct value for G1 at Mach 1.0', () => {
    expect(getCd(1.0, 'G1')).toBeCloseTo(0.3287, 4)
  })

  it('returns correct value for G7 at Mach 2.0', () => {
    expect(getCd(2.0, 'G7')).toBeCloseTo(0.2959, 4)
  })

  it('interpolates correctly between G1 table entries', () => {
    // Between Mach 0.50 (0.1998) and 0.55 (0.1956)
    const cd = getCd(0.525, 'G1')
    expect(cd).toBeGreaterThan(0.1956)
    expect(cd).toBeLessThan(0.1998)
    expect(cd).toBeCloseTo((0.1998 + 0.1956) / 2, 3)
  })

  it('clamps to table bounds at Mach 0', () => {
    expect(getCd(0, 'G1')).toBeCloseTo(0.2629, 4)
  })

  it('clamps at maximum Mach in G7 table', () => {
    expect(getCd(100, 'G7')).toBeCloseTo(getCd(3.5, 'G7'), 4)
  })

  it('G7 Cd is consistently lower than G1 Cd in subsonic regime', () => {
    for (const mach of [0.3, 0.5, 0.7]) {
      expect(getCd(mach, 'G7')).toBeLessThan(getCd(mach, 'G1'))
    }
  })
})

describe('bcToSI', () => {
  it('converts 0.243 lb/in² to ~170.8 kg/m²', () => {
    expect(bcToSI(0.243)).toBeCloseTo(0.243 * 703.07, 2)
  })

  it('is monotonic (higher imperial BC = higher SI BC)', () => {
    expect(bcToSI(0.305)).toBeGreaterThan(bcToSI(0.243))
  })
})

describe('dragDeceleration', () => {
  it('returns positive value for a bullet moving at 900 m/s', () => {
    // Standard sea-level air density, .308 G7 0.243
    const bcSI = bcToSI(0.243)
    const a = dragDeceleration(900, 900 / 344, 1.225, bcSI, 'G7')
    expect(a).toBeGreaterThan(0)
    expect(a).toBeLessThan(1000) // sanity — not absurd
  })

  it('deceleration increases with velocity squared', () => {
    const bcSI = bcToSI(0.243)
    const rho = 1.225
    const a500 = dragDeceleration(500, 500 / 344, rho, bcSI, 'G7')
    const a1000 = dragDeceleration(1000, 1000 / 344, rho, bcSI, 'G7')
    // Roughly 4x: drag ∝ v², but Cd also changes with Mach
    expect(a1000).toBeGreaterThan(a500 * 2)
  })
})
