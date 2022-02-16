import { useUnsafeActiveTeam } from './use-unsafe-active-team'

export function useUnsafeActiveTeamId(): Nullable<UUID> {
  const activeTeam = useUnsafeActiveTeam()

  return activeTeam?.id ?? null
}
