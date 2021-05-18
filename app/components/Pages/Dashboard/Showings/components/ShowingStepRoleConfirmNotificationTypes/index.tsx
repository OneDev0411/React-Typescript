import { memo } from 'react'

import ShowingGreenLabel from '../ShowingGreenLabel'

import ShowingRoleNotificationTypes, {
  ShowingRoleNotificationTypesProps
} from '../ShowingRoleNotificationTypes'

interface ShowingStepRoleConfirmNotificationTypesProps
  extends Omit<
    ShowingRoleNotificationTypesProps,
    'question' | 'hasNoAnywaysOption' | 'yesOptionLabel'
  > {
  firstName: string
}

function ShowingStepRoleConfirmNotificationTypes({
  firstName,
  ...otherProps
}: ShowingStepRoleConfirmNotificationTypesProps) {
  return (
    <ShowingRoleNotificationTypes
      {...otherProps}
      question={
        <>
          Does ${firstName} need to{' '}
          <ShowingGreenLabel>confirm</ShowingGreenLabel> appointments?
        </>
      }
      hasNoAnywaysOption
      yesOptionLabel="Yes, Confirm by:"
    />
  )
}

export default memo(ShowingStepRoleConfirmNotificationTypes)
