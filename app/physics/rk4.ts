/**
 * Generic 4th-order Runge-Kutta (RK4) integrator.
 *
 * Solves the ODE system: dS/dt = f(S, t)
 * where S is a 6-element state vector [x, y, z, vx, vy, vz].
 *
 * This module has ZERO knowledge of ballistics — it is a pure mathematical
 * primitive. The derivative function f is provided by the caller.
 */
import type { State6, DerivFn } from '../types/physics'

/** Add two state vectors component-wise */
function add(a: State6, b: State6): State6 {
  return [
    a[0] + b[0],
    a[1] + b[1],
    a[2] + b[2],
    a[3] + b[3],
    a[4] + b[4],
    a[5] + b[5],
  ]
}

/** Multiply a state vector by a scalar */
function scale(s: State6, k: number): State6 {
  return [s[0] * k, s[1] * k, s[2] * k, s[3] * k, s[4] * k, s[5] * k]
}

/**
 * Advance the state by one RK4 step.
 *
 * @param state  Current state [x, y, z, vx, vy, vz]
 * @param t      Current time (seconds)
 * @param dt     Time step (seconds)
 * @param f      Derivative function: f(state, t) → [dx, dy, dz, dvx, dvy, dvz]
 * @returns      New state after dt seconds
 */
export function rk4Step(state: State6, t: number, dt: number, f: DerivFn): State6 {
  const k1 = f(state, t)
  const k2 = f(add(state, scale(k1, dt / 2)), t + dt / 2)
  const k3 = f(add(state, scale(k2, dt / 2)), t + dt / 2)
  const k4 = f(add(state, scale(k3, dt)), t + dt)

  // S_{n+1} = S_n + (dt/6) * (k1 + 2*k2 + 2*k3 + k4)
  const weighted = add(
    add(k1, scale(k2, 2)),
    add(scale(k3, 2), k4),
  )
  return add(state, scale(weighted, dt / 6))
}
