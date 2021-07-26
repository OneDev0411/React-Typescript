import { ACL } from 'constants/acl'

import useActiveTeamBrandWithPermission from '../../hooks/use-active-team-brand-with-permission'
import AgentSearchInput, { AgentSearchInputProps } from '../AgentSearchInput'

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
