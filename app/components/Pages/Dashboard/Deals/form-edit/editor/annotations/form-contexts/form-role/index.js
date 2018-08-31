import React, { Fragment } from 'react'
import _ from 'underscore'

import ContextAnnotation from '../context-annotation'

export default function FormRoles({ roles, deal }) {
  return (
    <Fragment>
      {_.map(roles, (roleName, index) => {
        const info = roles[roleName]
        const groups = _.groupBy(info, 'group')

        return groups.map((group, groupIndex) => {
          const { attribute, number } = groups[group][0]

          const text = deal.roles
            .map(id => roles[id])
            .filter(role => role.role === role_name)[number][attribute]

          return (
            <ContextAnnotation
              key={`${index}-${groupIndex}`}
              annotations={groups[group].map(info => info.annotation)}
              value={text}
              maxFontSize={20}
            />
          )
        })
      })}
    </Fragment>
  )
}
