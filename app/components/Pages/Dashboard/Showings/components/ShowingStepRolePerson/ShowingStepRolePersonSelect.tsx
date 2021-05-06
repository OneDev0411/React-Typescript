import React from 'react'
import { Box, Button } from '@material-ui/core'

import ShowingStepRolePersonSelectAgent from './ShowingStepRolePersonSelectAgent'
import ShowingStepRolePersonSelectContact, {
  ShowingStepRolePersonSelectContactProps
} from './ShowingStepRolePersonSelectContact'

export type RolePersonSelectType = 'Agent' | 'Contact'

export interface ShowingStepRolePersonSelectProps
  extends ShowingStepRolePersonSelectContactProps {
  selectType?: RolePersonSelectType
  skippable: boolean
}

function ShowingStepRolePersonSelect({
  selectType = 'Agent',
  onSelect,
  skippable
}: ShowingStepRolePersonSelectProps) {
  const handleSkip = () => {
    onSelect({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      brand: '',
      user: ''
    })
  }

  return (
    <>
      {selectType === 'Agent' ? (
        <ShowingStepRolePersonSelectAgent onSelect={onSelect} />
      ) : (
        <ShowingStepRolePersonSelectContact onSelect={onSelect} />
      )}
      {skippable && (
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="outlined" size="small" onClick={handleSkip}>
            Skip
          </Button>
        </Box>
      )}
    </>
  )
}

export default ShowingStepRolePersonSelect
