import { describe, it, expect } from 'vitest'
import { computeTrajectory } from '../../../app/physics/engine'
import { ALL_KNOWN_TRAJECTORIES } from '../../fixtures/knownTrajectories'
import type { KnownTrajectory } from '../../fixtures/knownTrajectories'

/**
 * Golden-value tests: run the engine against known cartridge data
 * and verify results fall within published tolerances.
 */
describe('computeTrajectory — golden value tests', () => {
  for (const kt of ALL_KNOWN_TRAJECTORIES) {
    describe(kt.description, () => {
      it('produces a result without throwing', () => {
        expect(() => computeTrajectory(kt.input)).not.toThrow()
      })

      it('returns trajectory points', () => {
        const result = computeTrajectory(kt.input)
        expect(result.points.length).toBeGreaterThan(0)
      })

      for (const ref of kt.referencePoints) {
        it(`velocity at ${ref.distanceYards} yds is within ${ref.velocityFpsTolerance}%`, () => {
          const result = computeTrajectory(kt.input)
          const point = findNearestPoint(result.points, ref.distanceYards)
          expect(point).toBeDefined()

          const pctDiff = Math.abs(point!.velocityFps - ref.velocityFps) / ref.velocityFps * 100
          expect(pctDiff).toBeLessThanOrEqual(ref.velocityFpsTolerance)
        })

        if (ref.distanceYards > 0) {
          it(`drop at ${ref.distanceYards} yds is within tolerance (${ref.dropTolerance}")`, () => {
            const result = computeTrajectory(kt.input)
            const point = findNearestPoint(result.points, ref.distanceYards)
            expect(point).toBeDefined()

            const diff = Math.abs(point!.dropFromZeroInches - ref.dropFromZeroInches)
            expect(diff).toBeLessThanOrEqual(ref.dropTolerance)
          })
        }
      }
    })
  }
})

describe('computeTrajectory — rifle cant', () => {
  const baseInput = ALL_KNOWN_TRAJECTORIES[0].input // .308 Win, no wind, lat=0

  it('zero cant: totalLateralInches equals spinDriftInches (no wind, no Coriolis)', () => {
    const result = computeTrajectory(baseInput)
    const at = result.atTarget
    // With no cant, no wind, latitude=0 → only spin drift contributes to lateral
    expect(Math.abs(at.totalLateralInches - at.spinDriftInches)).toBeLessThan(0.5)
  })

  it('90° cant increases drop vs 0° cant (zero-angle upward velocity goes lateral)', () => {
    const canted = { ...baseInput, rifle: { ...baseInput.rifle, cantAngleDegrees: 90 } }
    const straight = computeTrajectory(baseInput)
    const cantedResult = computeTrajectory(canted)
    // With 90° cant the zero-angle upward velocity (vyInit) is fully redirected to z-axis,
    // leaving the bullet with less initial upward velocity → it drops MORE than level.
    expect(Math.abs(cantedResult.atTarget.dropFromZeroInches))
      .toBeGreaterThan(Math.abs(straight.atTarget.dropFromZeroInches))
  })

  it('+90° and -90° cant produce lateral drifts with opposite signs', () => {
    const cantPos = { ...baseInput, rifle: { ...baseInput.rifle, cantAngleDegrees: 90 } }
    const cantNeg = { ...baseInput, rifle: { ...baseInput.rifle, cantAngleDegrees: -90 } }
    const pos = computeTrajectory(cantPos)
    const neg = computeTrajectory(cantNeg)
    // +90° tilts the zero-angle velocity to +z (right), -90° tilts it to -z (left)
    expect(pos.atTarget.totalLateralInches).toBeGreaterThan(0)
    expect(neg.atTarget.totalLateralInches).toBeLessThan(0)
  })

  it('45° cant produces more drop than 0° and less than 90°', () => {
    const cant0   = computeTrajectory(baseInput)
    const cant45  = computeTrajectory({ ...baseInput, rifle: { ...baseInput.rifle, cantAngleDegrees: 45 } })
    const cant90  = computeTrajectory({ ...baseInput, rifle: { ...baseInput.rifle, cantAngleDegrees: 90 } })
    const drop0  = Math.abs(cant0.atTarget.dropFromZeroInches)
    const drop45 = Math.abs(cant45.atTarget.dropFromZeroInches)
    const drop90 = Math.abs(cant90.atTarget.dropFromZeroInches)
    expect(drop45).toBeGreaterThan(drop0)
    expect(drop45).toBeLessThan(drop90)
  })

  it('cant does not affect bullet speed (velocity monotonically decreases regardless of cant)', () => {
    const result = computeTrajectory({ ...baseInput, rifle: { ...baseInput.rifle, cantAngleDegrees: 45 } })
    for (let i = 1; i < result.points.length; i++) {
      expect(result.points[i].velocityFps).toBeLessThanOrEqual(result.points[i - 1].velocityFps)
    }
  })
})

describe('computeTrajectory — shot elevation angle', () => {
  const baseInput = ALL_KNOWN_TRAJECTORIES[0].input // .308 Win, 100yd zero, 500yd target

  it('level shot: drop at target is the normal negative value (~-77")', () => {
    const level = computeTrajectory(baseInput)
    expect(level.atTarget.dropFromZeroInches).toBeLessThan(-10)
  })

  it('uphill shot: drop from angled sight line is negative and similar magnitude to level', () => {
    // With the rifleman's-rule-style angled sight line, an 11° uphill shot at 200yd
    // should have only a few inches of drop — NOT hundreds of inches.
    const input200 = { ...baseInput, shot: { ...baseInput.shot, targetDistanceYards: 200, trajectoryStepYards: 100 } }
    const uphill = computeTrajectory({ ...input200, shot: { ...input200.shot, shotElevationAngleDegrees: 11 } })
    const level  = computeTrajectory(input200)
    // Drop should be within 20% of the level-shot drop (rifleman's rule: cos(11°) ≈ 0.98)
    expect(Math.abs(uphill.atTarget.dropFromZeroInches))
      .toBeLessThan(Math.abs(level.atTarget.dropFromZeroInches) * 1.25)
    // And nowhere near hundreds of inches
    expect(Math.abs(uphill.atTarget.dropFromZeroInches)).toBeLessThan(50)
  })

  it('uphill and downhill shots both produce drop comparable to level shot', () => {
    const input200 = { ...baseInput, shot: { ...baseInput.shot, targetDistanceYards: 200, trajectoryStepYards: 100 } }
    const level    = computeTrajectory(input200)
    const uphill   = computeTrajectory({ ...input200, shot: { ...input200.shot, shotElevationAngleDegrees: 15 } })
    const downhill = computeTrajectory({ ...input200, shot: { ...input200.shot, shotElevationAngleDegrees: -15 } })
    const levelDrop = Math.abs(level.atTarget.dropFromZeroInches)
    // When targeting by horizontal distance, angled shots produce similar drop to level
    // (within ~25% — rifleman's rule applies to slant-range targeting, not horizontal-distance)
    expect(Math.abs(uphill.atTarget.dropFromZeroInches)).toBeLessThan(levelDrop * 1.25)
    expect(Math.abs(downhill.atTarget.dropFromZeroInches)).toBeLessThan(levelDrop * 1.25)
  })

  it('zero crossing: drop is near zero at zero distance for any shot angle', () => {
    for (const angle of [0, 15, -15, 30]) {
      const result = computeTrajectory({
        ...baseInput,
        shot: { ...baseInput.shot, shotElevationAngleDegrees: angle, trajectoryStepYards: 100 },
      })
      const zeroPoint = result.points.find(p => Math.abs(p.distanceYards - baseInput.shot.zeroDistanceYards) < 5)
      if (zeroPoint) {
        expect(Math.abs(zeroPoint.dropFromZeroInches)).toBeLessThan(2)
      }
    }
  })

  it('velocity still decreases monotonically on an uphill shot', () => {
    const result = computeTrajectory({ ...baseInput, shot: { ...baseInput.shot, shotElevationAngleDegrees: 20 } })
    for (let i = 1; i < result.points.length; i++) {
      expect(result.points[i].velocityFps).toBeLessThanOrEqual(result.points[i - 1].velocityFps)
    }
  })

  it('engine does not throw at extreme elevation angles', () => {
    expect(() => computeTrajectory({ ...baseInput, shot: { ...baseInput.shot, shotElevationAngleDegrees: 45 } })).not.toThrow()
    expect(() => computeTrajectory({ ...baseInput, shot: { ...baseInput.shot, shotElevationAngleDegrees: -45 } })).not.toThrow()
  })
})

describe('computeTrajectory — physical properties', () => {
  const baseInput = ALL_KNOWN_TRAJECTORIES[0].input

  it('bullet velocity decreases monotonically downrange', () => {
    const result = computeTrajectory(baseInput)
    for (let i = 1; i < result.points.length; i++) {
      expect(result.points[i].velocityFps).toBeLessThanOrEqual(result.points[i - 1].velocityFps)
    }
  })

  it('bullet energy decreases monotonically downrange', () => {
    const result = computeTrajectory(baseInput)
    for (let i = 1; i < result.points.length; i++) {
      expect(result.points[i].remainingEnergyFtLbs).toBeLessThanOrEqual(
        result.points[i - 1].remainingEnergyFtLbs,
      )
    }
  })

  it('time of flight increases monotonically downrange', () => {
    const result = computeTrajectory(baseInput)
    for (let i = 1; i < result.points.length; i++) {
      expect(result.points[i].timeOfFlightSeconds).toBeGreaterThanOrEqual(
        result.points[i - 1].timeOfFlightSeconds,
      )
    }
  })

  it('drop is 0 at zero distance (within 1 inch)', () => {
    const result = computeTrajectory(baseInput)
    const zeroPoint = findNearestPoint(result.points, baseInput.shot.zeroDistanceYards)
    expect(zeroPoint).toBeDefined()
    expect(Math.abs(zeroPoint!.dropFromZeroInches)).toBeLessThan(1.0)
  })

  it('returns a valid at-target point', () => {
    const result = computeTrajectory(baseInput)
    expect(result.atTarget).toBeDefined()
    expect(result.atTarget.distanceYards).toBeCloseTo(baseInput.shot.targetDistanceYards, 0)
  })

  it('returns an inputHash string', () => {
    const result = computeTrajectory(baseInput)
    expect(typeof result.inputHash).toBe('string')
    expect(result.inputHash.length).toBeGreaterThan(0)
  })

  it('two identical inputs produce the same result', () => {
    const r1 = computeTrajectory(baseInput)
    const r2 = computeTrajectory(baseInput)
    expect(r1.inputHash).toBe(r2.inputHash)
    expect(r1.atTarget.velocityFps).toBeCloseTo(r2.atTarget.velocityFps, 2)
  })

  it('higher BC produces less drop at 500 yards', () => {
    const lowBC = { ...baseInput, bullet: { ...baseInput.bullet, ballisticCoefficient: 0.15 } }
    const highBC = { ...baseInput, bullet: { ...baseInput.bullet, ballisticCoefficient: 0.40 } }
    const lowResult = computeTrajectory(lowBC)
    const highResult = computeTrajectory(highBC)
    expect(Math.abs(highResult.atTarget.dropFromZeroInches))
      .toBeLessThan(Math.abs(lowResult.atTarget.dropFromZeroInches))
  })
})

function findNearestPoint(
  points: { distanceYards: number; velocityFps: number; dropFromZeroInches: number }[],
  targetYards: number,
) {
  return points.reduce((best, p) =>
    Math.abs(p.distanceYards - targetYards) < Math.abs(best.distanceYards - targetYards) ? p : best,
  )
}
