import { browserHistory } from 'react-router'
import { useEffectOnce } from 'react-use'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'

import { getUserDefaultHomepage } from '../../../utils/get-default-home-page'

export default function GoToDashboard() {
  const activeTeam = useUnsafeActiveTeam()

  useEffectOnce(() => {
    let to = '/signin'

    if (activeTeam) {
      to = getUserDefaultHomepage(activeTeam)
    }

    browserHistory.push(to)
  })

  return null
}
