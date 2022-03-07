import { Dispatch, SetStateAction, useState } from 'react'

import { hourToSeconds } from '../../helpers'
import { ShowingAvailabilityItem } from '../../types'

type UseShowingAvailabilitiesStateReturn = [
  ShowingAvailabilityItem[],
  Dispatch<SetStateAction<ShowingAvailabilityItem[]>>
]

const defaultAvailability: [number, number] = [
  hourToSeconds(9),
  hourToSeconds(17)
]

const defaultSlots: ShowingAvailabilityItem[] = [
  {
    id: 'init-0',
    weekday: 'Sunday',
    availability: defaultAvailability
  },
  {
    id: 'init-1',
    weekday: 'Monday',
    availability: defaultAvailability
  },
  {
    id: 'init-2',
    weekday: 'Tuesday',
    availability: defaultAvailability
  },
  {
    id: 'init-3',
    weekday: 'Wednesday',
    availability: defaultAvailability
  },
  {
    id: 'init-4',
    weekday: 'Thursday',
    availability: defaultAvailability
  },
  {
    id: 'init-5',
    weekday: 'Friday',
    availability: defaultAvailability
  },
  {
    id: 'init-6',
    weekday: 'Saturday',
    availability: defaultAvailability
  }
]

function useShowingAvailabilitiesState(): UseShowingAvailabilitiesStateReturn {
  return useState<ShowingAvailabilityItem[]>(defaultSlots)
}

export default useShowingAvailabilitiesState
