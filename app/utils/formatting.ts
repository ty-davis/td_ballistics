/** Number formatting helpers for ballistic display values */

/** Round to N decimal places */
export function round(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

/** Format number with fixed decimal places, no trailing sign for zero */
export function fmt(value: number, decimals: number): string {
  return value.toFixed(decimals)
}

/** Format with explicit + sign for positive, – for negative */
export function fmtSigned(value: number, decimals: number): string {
  const s = Math.abs(value).toFixed(decimals)
  if (value === 0) return s
  return value > 0 ? `+${s}` : `−${s}`
}

/** Format velocity in fps */
export function fmtFps(fps: number): string {
  return `${Math.round(fps)} fps`
}

/** Format energy in ft·lbs */
export function fmtFtLbs(ftlbs: number): string {
  return `${Math.round(ftlbs)} ft·lbs`
}

/** Format yards */
export function fmtYards(yards: number): string {
  return `${Math.round(yards)} yds`
}

/** Format inches with sign */
export function fmtInches(inches: number, decimals = 1): string {
  return `${fmtSigned(inches, decimals)}"`
}

/** Format MOA with sign */
export function fmtMOA(moa: number, decimals = 2): string {
  return `${fmtSigned(moa, decimals)} MOA`
}

/** Format MRAD with sign */
export function fmtMRAD(mrad: number, decimals = 3): string {
  return `${fmtSigned(mrad, decimals)} mil`
}

/** Format time of flight */
export function fmtSeconds(s: number, decimals = 3): string {
  return `${s.toFixed(decimals)}s`
}

/** Format Mach number */
export function fmtMach(mach: number): string {
  return `M${mach.toFixed(2)}`
}
