/**
 * Main calculator composable — bridges the Pinia stores with the physics engine.
 * Validates inputs, runs the calculation, and commits results.
 */
import { watch } from 'vue'
import { computeTrajectory } from '../physics/engine'

export function useBallisticsCalculator() {
  const inputStore = useInputStore()
  const resultsStore = useResultsStore()

  function validate(): string | null {
    const { rifle, bullet, shot } = inputStore
    if (bullet.ballisticCoefficient <= 0) return 'Ballistic coefficient must be positive'
    if (bullet.weightGrains <= 0) return 'Bullet weight must be positive'
    if (shot.muzzleVelocityFps <= 0) return 'Muzzle velocity must be positive'
    if (shot.zeroDistanceYards <= 0) return 'Zero distance must be positive'
    if (shot.targetDistanceYards <= 0) return 'Target distance must be positive'
    if (rifle.sightHeightInches <= 0) return 'Sight height must be positive'
    if (rifle.twistRateInchesPerTurn <= 0) return 'Twist rate must be positive'
    if (bullet.diameterInches <= 0) return 'Bullet diameter must be positive'
    if (bullet.lengthInches <= 0) return 'Bullet length must be positive'
    return null
  }

  const debouncedCalculate = useDebounce(calculate, 300)

  function calculate() {
    const error = validate()
    if (error) {
      resultsStore.setError(error)
      return
    }

    resultsStore.setLoading(true)

    // Use setTimeout to yield to the UI before the potentially heavy calculation
    setTimeout(() => {
      try {
        const result = computeTrajectory(inputStore.allInputs)
        resultsStore.setResult(result)
      } catch (e) {
        resultsStore.setError(e instanceof Error ? e.message : 'Calculation failed')
      }
    }, 0)
  }

  /** Set up reactive auto-calculation when any input changes */
  function setupAutoCalculate() {
    watch(
      () => inputStore.allInputs,
      () => debouncedCalculate(),
      { deep: true },
    )
  }

  return {
    calculate,
    setupAutoCalculate,
    validate,
  }
}
