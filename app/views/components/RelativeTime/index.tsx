import * as React from 'react'

import timeago from 'timeago.js'

import { useForceRender } from 'hooks/use-force-render'
import { useInterval } from 'hooks/use-interval'

type DateType = number | string | Date

interface Props {
  time: DateType
  refreshIntervalInSeconds?: number
  locale?: string
}

/**
 * Displays relative time (aka time ago), which updates as time passes.
 *
 * By default it updates each minute, but you can provide
 * `refreshIntervalInSeconds`
 *
 * @param time
 * @param refreshIntervalInSeconds: interval for updating relative time
 * @constructor
 */
export function RelativeTime({
  time,
  refreshIntervalInSeconds = 60,
  locale
}: Props) {
  const rerender = useForceRender()

  useInterval(rerender, refreshIntervalInSeconds * 1000)

  return <>{timeago().format(time, locale)}</>
}
