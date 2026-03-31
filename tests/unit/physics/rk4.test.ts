import { describe, it, expect } from 'vitest'
import { rk4Step } from '../../../app/physics/rk4'
import type { State6 } from '../../../app/types/physics'

describe('rk4Step', () => {
  it('advances simple linear ODE correctly: dx/dt = 1 (constant velocity)', () => {
    // State: [x, 0, 0, 1, 0, 0] — moving at 1 m/s in x
    const state: State6 = [0, 0, 0, 1, 0, 0]
    const f = (s: State6): State6 => [s[3], s[4], s[5], 0, 0, 0]
    const result = rk4Step(state, 0, 1.0, f)
    expect(result[0]).toBeCloseTo(1.0, 10) // x should be exactly 1
    expect(result[3]).toBeCloseTo(1.0, 10) // vx unchanged
  })

  it('solves exponential ODE dx/dt = x to machine precision over 1 step', () => {
    // dx/dt = x → x(t) = x0 * e^t
    // With dt=0.01 and x0=1, x(0.01) ≈ 1.01005017...
    const state: State6 = [1, 0, 0, 0, 0, 0]
    const f = (s: State6): State6 => [s[0], 0, 0, 0, 0, 0]
    const result = rk4Step(state, 0, 0.01, f)
    const exact = Math.exp(0.01)
    // RK4 is 4th order — error ∝ dt^5 — should be very close
    expect(result[0]).toBeCloseTo(exact, 8)
  })

  it('solves free-fall: d²y/dt² = -g correctly', () => {
    // y(t) = y0 + vy0*t - 0.5*g*t²
    // State: [0, 0, 0, 0, 0, 0] — dropped from rest
    const g = 9.80665
    const state: State6 = [0, 100, 0, 0, 0, 0] // start at 100m height
    const f = (s: State6): State6 => [s[3], s[4], s[5], 0, -g, 0]
    const dt = 0.001
    let current = state
    for (let i = 0; i < 1000; i++) {
      current = rk4Step(current, i * dt, dt, f)
    }
    // After 1 second: y = 100 - 0.5 * 9.80665 = 95.097...
    const expected = 100 - 0.5 * g * 1.0
    expect(current[1]).toBeCloseTo(expected, 3)
    // Velocity after 1 second: vy = -g*t = -9.80665
    expect(current[4]).toBeCloseTo(-g, 3)
  })

  it('conserves state dimensions (always returns 6-element array)', () => {
    const state: State6 = [1, 2, 3, 4, 5, 6]
    const f = (): State6 => [0, 0, 0, 0, 0, 0]
    const result = rk4Step(state, 0, 0.1, f)
    expect(result).toHaveLength(6)
  })
})
