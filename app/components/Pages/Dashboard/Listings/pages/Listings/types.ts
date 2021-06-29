export type ListingRow = ICompactListing | IListing

export interface ListingTab {
  label: string
  value: UUID
  hasActions: boolean
}

export type OpenHouseRow = ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
