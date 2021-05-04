import { shuffle } from 'lodash'
import { useState } from 'react'

import CardStack from '../CardStack'
import ShowingAppointmentCard from '../ShowingAppointmentCard'

interface ShowingAppointmentCardStackProps {
  title: string
}

const sampleAppointment: Partial<IShowingAppointment> = {}

function ShowingAppointmentCardStack({
  title
}: ShowingAppointmentCardStackProps) {
  const [items, setItems] = useState<
    { id: number; status: IShowingAppointmentStatus }[]
  >(
    shuffle([
      { id: 1, status: 'Requested' },
      { id: 2, status: 'Requested' },
      { id: 3, status: 'Confirmed' },
      { id: 4, status: 'Canceled' },
      { id: 5, status: 'Completed' },
      { id: 6, status: 'Requested' },
      { id: 7, status: 'Requested' },
      { id: 8, status: 'Confirmed' },
      { id: 9, status: 'Canceled' },
      { id: 10, status: 'Completed' },
      { id: 11, status: 'Requested' },
      { id: 12, status: 'Requested' },
      { id: 13, status: 'Confirmed' },
      { id: 14, status: 'Canceled' },
      { id: 15, status: 'Completed' },
      { id: 16, status: 'Requested' },
      { id: 17, status: 'Requested' },
      { id: 18, status: 'Confirmed' },
      { id: 19, status: 'Canceled' },
      { id: 20, status: 'Completed' }
    ])
  )

  const handleFadeOut = () => {
    setItems(items => {
      const newItems = [...items]

      newItems.shift()

      return newItems
    })
  }

  return (
    <CardStack title={title} onFadeOut={handleFadeOut}>
      {({ pop }) =>
        items.slice(0, 3).map(item => (
          <ShowingAppointmentCard
            key={item.id}
            appointment={
              {
                ...sampleAppointment,
                status: item.status
              } as IShowingAppointment
            }
            onStatusChange={pop}
            hideStatus
          />
        ))
      }
    </CardStack>
  )
}

export default ShowingAppointmentCardStack
