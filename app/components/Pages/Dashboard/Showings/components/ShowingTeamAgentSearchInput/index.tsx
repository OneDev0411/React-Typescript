import { ACL } from 'constants/acl'

import AgentSearchInput, { AgentSearchInputProps } from '../AgentSearchInput'
import useActiveTeamBrandWithPermission from '../../hooks/use-active-team-brand-with-permission'

export type ShowingTeamAgentSearchInputProps = Omit<
  AgentSearchInputProps,
  'isPrimaryAgent' | 'options'
>

function ShowingTeamAgentSearchInput(props: ShowingTeamAgentSearchInputProps) {
  const activeBrand = useActiveTeamBrandWithPermission(ACL.SHOWINGS)

  const options: IBrand[] = activeBrand ? [activeBrand] : []

  return <AgentSearchInput {...props} options={options} />
}

export default ShowingTeamAgentSearchInput
