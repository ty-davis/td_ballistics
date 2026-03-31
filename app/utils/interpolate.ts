/** Pure interpolation utilities. No framework dependencies. */

/**
 * Linear interpolation between two values.
 * t should be in [0, 1].
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Find the index of the last entry where entry.key <= value.
 * Table must be sorted ascending by key.
 */
export function lowerBoundIndex<T>(
  table: T[],
  value: number,
  key: (entry: T) => number,
): number {
  let lo = 0
  let hi = table.length - 1

  if (value <= key(table[0])) return 0
  if (value >= key(table[hi])) return hi - 1

  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1
    if (key(table[mid]) <= value) lo = mid
    else hi = mid
  }
  return lo
}

/**
 * Linear interpolation within a sorted lookup table.
 * @param table  Array of {key, value} entries, sorted ascending by key
 * @param x      The input value to interpolate at
 * @param getKey Extract the key from an entry
 * @param getVal Extract the value from an entry
 * @returns Linearly interpolated value, clamped to table bounds
 */
export function tableInterp<T>(
  table: T[],
  x: number,
  getKey: (e: T) => number,
  getVal: (e: T) => number,
): number {
  if (table.length === 0) return 0
  if (table.length === 1) return getVal(table[0])

  const firstKey = getKey(table[0])
  const lastKey = getKey(table[table.length - 1])

  // Clamp to table bounds
  if (x <= firstKey) return getVal(table[0])
  if (x >= lastKey) return getVal(table[table.length - 1])

  const i = lowerBoundIndex(table, x, getKey)
  const x0 = getKey(table[i])
  const x1 = getKey(table[i + 1])
  const y0 = getVal(table[i])
  const y1 = getVal(table[i + 1])

  const t = (x - x0) / (x1 - x0)
  return lerp(y0, y1, t)
}
