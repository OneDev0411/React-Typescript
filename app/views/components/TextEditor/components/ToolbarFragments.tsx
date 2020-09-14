import React, { Fragment } from 'react'
import { groupBy } from 'lodash'

import {
  ToolbarFragment,
  toolbarFragmentGroups,
  ToolbarFragmentGroup
} from '../types'
import { Separator } from '../styled'

interface Props {
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

  const groups = Object.entries(segmentsWithKeys).sort(
    ([firstGroup], [secondGroup]) =>
      toolbarFragmentGroups.indexOf(firstGroup as ToolbarFragmentGroup) -
      toolbarFragmentGroups.indexOf(secondGroup as ToolbarFragmentGroup)
  )

  return (
    <>
      {groups.map(([groupName, group], index) => (
        <Fragment key={groupName}>
          {group.map(({ key, node }) => (
            <Fragment key={key}>{node}</Fragment>
          ))}
          {index < groups.length - 1 && <Separator />}
        </Fragment>
      ))}
    </>
  )
}
