import { useActiveTeam } from './use-active-team'

export function useActiveTeamId(): UUID {
  const activeTeam = useActiveTeam()

  return activeTeam.id
}
