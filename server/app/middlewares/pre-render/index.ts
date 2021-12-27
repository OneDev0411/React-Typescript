import { Request, Response, NextFunction, Router } from 'express'
import prerenderNode from 'prerender-node'

import config from '../../../config'

export const prerenderMiddleware = (router: Router, routes: string[]) => {
  routes.forEach(route => {
    router.get(route, (req: Request, res: Response, next: NextFunction) => {
      if (config.prerender_token) {
        console.log('[ Prerender ] Enabled: ', route)

        router.use(
          prerenderNode
            .set('prerenderServiceUrl', config.prerender_service_url || null)
            .set('prerenderToken', config.prerender_token)
        )
      }

      next()
    })
  })
}
