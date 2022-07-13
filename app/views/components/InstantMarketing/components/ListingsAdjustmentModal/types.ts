export interface IAdjustment {
  description: string
  value: number
}

export type Adjustments = Record<UUID, IAdjustment[]>

export interface IListingWithAdjustment extends IListing {
  adjustments?: IAdjustment[]
  adjusted_price?: number
}
