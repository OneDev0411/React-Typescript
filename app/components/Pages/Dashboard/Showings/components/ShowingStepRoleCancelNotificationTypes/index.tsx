import { memo } from 'react'

import ShowingGreenLabel from '../ShowingGreenLabel'

import ShowingRoleNotificationTypes, {
  ShowingRoleNotificationTypesProps
} from '../ShowingRoleNotificationTypes'

interface ShowingStepRoleCancelNotificationTypesProps
  extends Omit<
    ShowingRoleNotificationTypesProps,
    'question' | 'hasNoAnywaysOption' | 'yesOptionLabel'
  > {
  firstName: string
}

function ShowingStepRoleCancelNotificationTypes({
  firstName,
  ...otherProps
}: ShowingStepRoleCancelNotificationTypesProps) {
  return (
    <ShowingRoleNotificationTypes
      {...otherProps}
      question={
        <>
          Should {firstName} be <ShowingGreenLabel>notified</ShowingGreenLabel>{' '}
          in case of confirmation or cancellation of an appointment?
        </>
      }
      yesOptionLabel="Yes, notify confirmation or cancellation by:"
    />
  )
}

export default memo(ShowingStepRoleCancelNotificationTypes)
