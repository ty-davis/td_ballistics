/**
 * Reactive unit conversion helpers.
 * Reads the current unit system from settingsStore and returns
 * formatting/conversion functions that automatically adapt.
 */
import { computed } from 'vue'

export function useUnitConversion() {
  const settings = useSettingsStore()

  const isImperial = computed(() => settings.unitSystem === 'imperial')
  const isMOA = computed(() => settings.angleUnit === 'MOA')

  /** Display a velocity value with appropriate unit */
  const fmtVelocity = computed(() => (fps: number) => {
    if (isImperial.value) return `${Math.round(fps)} fps`
    return `${Math.round(fps * 0.3048)} m/s`
  })

  /** Display an energy value */
  const fmtEnergy = computed(() => (ftlbs: number) => {
    if (isImperial.value) return `${Math.round(ftlbs)} ft·lbs`
    return `${Math.round(ftlbs * 1.35582)} J`
  })

  /** Display a distance */
  const fmtDistance = computed(() => (yards: number) => {
    if (isImperial.value) return `${Math.round(yards)} yds`
    return `${Math.round(yards * 0.9144)} m`
  })

  /** Display an angular correction */
  const fmtAngle = computed(() => (moa: number, mrad: number) => {
    if (isMOA.value) return `${moa >= 0 ? '+' : ''}${moa.toFixed(2)} MOA`
    return `${mrad >= 0 ? '+' : ''}${mrad.toFixed(3)} mil`
  })

  /** Display drop/drift in inches */
  const fmtInches = computed(() => (inches: number) => {
    const sign = inches >= 0 ? '+' : ''
    if (isImperial.value) return `${sign}${inches.toFixed(1)}"`
    return `${sign}${(inches * 25.4).toFixed(0)} mm`
  })

  return {
    isImperial,
    isMOA,
    fmtVelocity,
    fmtEnergy,
    fmtDistance,
    fmtAngle,
    fmtInches,
  }
}
