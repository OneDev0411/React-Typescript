import * as React from 'react'
import { groupBy } from 'lodash'

import { ToolbarFragment } from '../types'
import { Separator } from '../styled'

type Props = {
  segments: Record<string, ToolbarFragment>
}

export function ToolbarFragments({ segments }: Props) {
  const segmentsWithKeys = groupBy(
    Object.entries(segments).map(([key, segment]) => ({
      key,
      ...segment
    })),
    'group'
  )

  const groups = Object.entries(segmentsWithKeys)

  return (
    <>
      {groups.map(([groupName, group], index) => (
        <React.Fragment key={groupName}>
          {group.map(({ key, node }) => (
            <React.Fragment key={key}>{node}</React.Fragment>
          ))}
          {index < groups.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </>
  )
}
