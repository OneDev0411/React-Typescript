import { useEffect } from 'react'

import { InjectedRouter, PlainRoute } from 'react-router'

function useLoseYourWorkAlert(
  router: InjectedRouter,
  route: PlainRoute,
  needsAlert: boolean,
  leaveMessage: string
) {
  useEffect(() => {
    router.setRouteLeaveHook(route, () => {
      if (needsAlert) {
        return leaveMessage
      }
    })

    return () => {
      // Reset the leave hook if the user leaves the component
      router.setRouteLeaveHook(route, () => {})
    }
  }, [router, route, needsAlert, leaveMessage])
}

export default useLoseYourWorkAlert
