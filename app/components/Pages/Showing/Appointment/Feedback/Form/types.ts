export type ClientInterested = 'Very' | 'Somewhat' | 'Maybe' | 'Not Interested'

export type PriceOpinion = 'Too High' | 'Just Right' | 'Too Low'

export type OverallExperience = 'Excellent' | 'Good' | 'Fair' | 'Poor'

export type ListingRate =
  | 'Highly Satisfied'
  | 'Satisfied'
  | 'Neutral'
  | 'Dissatisfied'
  | 'Highly Dissatisfied'

export interface FormFields {
  clientInterested: ClientInterested
  overallExperience: OverallExperience
  priceOpinion: PriceOpinion
  listingRate: ListingRate
  comment?: string
}
