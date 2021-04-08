import { Dispatch, SetStateAction, useState } from 'react'

import { hourToSeconds } from '../../helpers'

type UseShowingAvailabilitiesStateReturn = [
  IShowingAvailabilitySlot[],
  Dispatch<SetStateAction<IShowingAvailabilitySlot[]>>
]

const defaultAvailability: [number, number] = [
  hourToSeconds(9),
  hourToSeconds(17)
]

const defaultSlots: IShowingAvailabilitySlot[] = [
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
  return useState<IShowingAvailabilitySlot[]>(defaultSlots)
}

export default useShowingAvailabilitiesState
