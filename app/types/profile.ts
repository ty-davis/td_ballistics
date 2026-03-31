import type { BallisticsInput } from './inputs'

export interface BallisticsProfile {
  /** UUID */
  id: string
  /** User-provided label, e.g. "308 Win Match — Summer" */
  name: string
  createdAt: string
  updatedAt: string
  /** Complete snapshot of all inputs */
  input: BallisticsInput
  notes: string
  /** Schema version for future migration support */
  version: number
}

export interface ProfileExportBundle {
  exportedAt: string
  appVersion: string
  profiles: BallisticsProfile[]
}
