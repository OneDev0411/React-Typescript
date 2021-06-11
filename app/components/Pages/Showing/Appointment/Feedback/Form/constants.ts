import { RadioItem } from 'components/RadioGroup'

import {
  ClientInterested,
  PriceOpinion,
  OverallExperience,
  ListingRate
} from './types'

export const CLIENT_INTEREST_QUESTION: string =
  'Is your client interested in this listing?'
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

export const LISTING_RATE_QUESTION: string = 'How would you rate this listing?'
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

export const PRICE_OPINION_QUESTION: string =
  'What is your clients and your opinion of the price?'
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

export const OVERALL_EXPERIENCE_QUESTION: string =
  'How would you rate your overall experience at this showing?'
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

export const COMMENTS_QUESTION: string = 'Any comments or recommendations?'
