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
    { id: number; status: IAppointmentStatus }[]
  >(
    shuffle([
      { id: 1, status: 'Pending' },
      { id: 2, status: 'Pending' },
      { id: 3, status: 'Approved' },
      { id: 4, status: 'Cancelled' },
      { id: 5, status: 'Finished' },
      { id: 6, status: 'Pending' },
      { id: 7, status: 'Pending' },
      { id: 8, status: 'Approved' },
      { id: 9, status: 'Cancelled' },
      { id: 10, status: 'Finished' },
      { id: 11, status: 'Pending' },
      { id: 12, status: 'Pending' },
      { id: 13, status: 'Approved' },
      { id: 14, status: 'Cancelled' },
      { id: 15, status: 'Finished' },
      { id: 16, status: 'Pending' },
      { id: 17, status: 'Pending' },
      { id: 18, status: 'Approved' },
      { id: 19, status: 'Cancelled' },
      { id: 20, status: 'Finished' }
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
          />
        ))
      }
    </CardStack>
  )
}

export default ShowingAppointmentCardStack
