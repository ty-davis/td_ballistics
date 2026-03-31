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
