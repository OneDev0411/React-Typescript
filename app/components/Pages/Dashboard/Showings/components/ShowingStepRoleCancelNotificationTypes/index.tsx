import React from 'react'

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
      question={`Should ${firstName} be notified in case of confirmation or cancellation of an appointment?`}
      yesOptionLabel="Yes, notify confirmation or cancellation by:"
    />
  )
}

export default ShowingStepRoleCancelNotificationTypes
