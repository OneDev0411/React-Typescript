import { Dispatch, SetStateAction, useState } from 'react'

import { hourToSeconds } from '../../helpers'

type UseShowingAvailabilitiesStateReturn = [
  IShowingAvailabilityInput[],
  Dispatch<SetStateAction<IShowingAvailabilityInput[]>>
]

const defaultAvailability: [number, number] = [
  hourToSeconds(9),
  hourToSeconds(17)
]

const defaultSlots: IShowingAvailabilityInput[] = [
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
  }
]

function useShowingAvailabilitiesState(): UseShowingAvailabilitiesStateReturn {
  return useState<IShowingAvailabilityInput[]>(defaultSlots)
}

export default useShowingAvailabilitiesState
