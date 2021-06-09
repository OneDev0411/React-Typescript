import { Box, Button } from '@material-ui/core'

import ShowingStepRolePersonSelectAgent, {
  ShowingStepRolePersonSelectAgentProps
} from './ShowingStepRolePersonSelectAgent'
import ShowingStepRolePersonSelectContact, {
  ShowingStepRolePersonSelectContactProps
} from './ShowingStepRolePersonSelectContact'

export type RolePersonSelectType = 'Agent' | 'Contact'

export interface ShowingStepRolePersonSelectProps
  extends ShowingStepRolePersonSelectContactProps,
    Pick<
      ShowingStepRolePersonSelectAgentProps,
      'isPrimaryAgent' | 'isTeamAvailableMembers'
    > {
  selectType?: RolePersonSelectType
  skippable: boolean
}

function ShowingStepRolePersonSelect({
  isPrimaryAgent,
  isTeamAvailableMembers,
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
        <ShowingStepRolePersonSelectAgent
          onSelect={onSelect}
          isPrimaryAgent={isPrimaryAgent}
          isTeamAvailableMembers={isTeamAvailableMembers}
        />
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
