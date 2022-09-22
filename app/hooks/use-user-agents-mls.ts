import { useSelector } from 'react-redux'

import { selectUserAgents } from '@app/selectors/user'

export function useUserAgentsMls(): string[] {
  const agents = useSelector(selectUserAgents)

  if (!agents) {
    return []
  }

  // filter, map and unique agents.mls
  return agents.reduce<string[]>((prev, cur) => {
    return [
      ...prev,
      ...(!!cur.mls && prev.indexOf(cur.mls) === -1 ? [cur.mls] : [])
    ]
  }, [])
}
