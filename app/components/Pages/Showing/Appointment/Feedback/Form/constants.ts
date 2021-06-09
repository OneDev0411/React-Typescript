import { RadioItem } from 'components/RadioGroup'

import {
  ClientInterested,
  PriceOpinion,
  OverallExperience,
  ListingRate
} from './types'

export const CLIENT_INTEREST_OPTIONS: RadioItem<ClientInterested>[] = [
  {
    label: '😍 Very',
    value: 'Very'
  },
  {
    label: '🙂 Somewhat',
    value: 'Somewhat'
  },
  {
    label: '🙁 Maybe',
    value: 'Maybe'
  },
  {
    label: '😣 Not interested',
    value: 'Not Interested'
  }
]

export const OVERALL_EXPERIENCE_OPTIONS: RadioItem<OverallExperience>[] = [
  {
    label: '😍 Excellent',
    value: 'Excellent'
  },
  {
    label: '🙂 Good',
    value: 'Good'
  },
  {
    label: '🙁 Fair',
    value: 'Fair'
  },
  {
    label: '😣 Poor',
    value: 'Poor'
  }
]

export const PRICE_OPINION_OPTIONS: RadioItem<PriceOpinion>[] = [
  {
    label: '⏫ Too high',
    value: 'Too High'
  },
  {
    label: '👌 Just right',
    value: 'Just Right'
  },
  {
    label: '⤵️ Too low',
    value: 'Too Low'
  }
]

export const LISTING_RATE_OPTIONS: RadioItem<ListingRate>[] = [
  {
    label: '😍 Highly Satisfied',
    value: 'Highly Satisfied'
  },
  {
    label: '🙂 Satisfied',
    value: 'Satisfied'
  },
  {
    label: '🙄 Neutral',
    value: 'Neutral'
  },
  {
    label: '🙁 Dissatisfied',
    value: 'Dissatisfied'
  },
  {
    label: '😣 Highly Dissatisfied',
    value: 'Highly Dissatisfied'
  }
]
