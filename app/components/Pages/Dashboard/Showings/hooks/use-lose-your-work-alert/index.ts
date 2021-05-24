import { useEffect } from 'react'
import { InjectedRouter, Route } from 'react-router'

function useLoseYourWorkAlert(
  router: InjectedRouter,
  route: Route,
  needsAlert: boolean
) {
  useEffect(() => {
    router.setRouteLeaveHook(route, () => {
      if (needsAlert) {
        return 'By canceling you will lose your work. Continue?'
      }
    })
  }, [router, route, needsAlert])
}

export default useLoseYourWorkAlert
