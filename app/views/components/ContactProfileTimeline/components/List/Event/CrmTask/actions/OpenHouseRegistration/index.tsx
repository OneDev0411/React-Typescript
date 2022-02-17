import Button from '@material-ui/core/Button'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'

interface Props {
  event: ICalendarEvent
}

export function OpenHouseRegistration({ event }: Props) {
  const activeBrandId = useActiveBrandId()

  if (event.event_type !== 'Open House') {
    return null
  }

  return (
    <Button
      href={`/openhouse/${event.crm_task}/${activeBrandId}/register`}
      target="_blank"
    >
      Guest Registration Page
    </Button>
  )
}
