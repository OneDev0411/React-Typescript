import React from 'react'
import { Box, Button } from '@material-ui/core'

import { ShowingRolePerson } from '../../types'

import ShowingStepRolePersonSelectAgent from './ShowingStepRolePersonSelectAgent'
import ShowingStepRolePersonSelectContact from './ShowingStepRolePersonSelectContact'

export type RolePersonSelectType = 'Agent' | 'Contact'

export interface ShowingStepRolePersonSelectProps {
  selectType?: RolePersonSelectType
  onSelect: (person: ShowingRolePerson) => void
}

function ShowingStepRolePersonSelect({
  selectType = 'Agent',
  onSelect
}: ShowingStepRolePersonSelectProps) {
  const handleSkip = () => {
    onSelect({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: ''
    })
  }

  return (
    <>
      {selectType === 'Agent' ? (
        <ShowingStepRolePersonSelectAgent onSelect={onSelect} />
      ) : (
        <ShowingStepRolePersonSelectContact onSelect={onSelect} />
      )}
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button variant="outlined" size="small" onClick={handleSkip}>
          Skip
        </Button>
      </Box>
    </>
  )
}

export default ShowingStepRolePersonSelect
