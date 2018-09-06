import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import _ from 'underscore'

import ContextAnnotation from '../context-annotation'

function FormRole({ roles, deal, dealsRoles, onClick }) {
  if (!roles) {
    return false
  }

  return (
    <Fragment>
      {_.map(roles, (list, roleName) => {
        const info = roles[roleName]
        const groups = _.groupBy(info, 'group')

        return _.map(groups, (group, groupIndex) => {
          const { attribute, number } = groups[groupIndex][0]

          const text = deal.roles
            .map(id => dealsRoles[id])
            .filter(role => role.role === roleName)[number][attribute]

          return (
            <ContextAnnotation
              key={`${roleName}-${groupIndex}`}
              annotations={groups[groupIndex].map(info => info.annotation)}
              value={text}
              maxFontSize={20}
              onClick={() => onClick('Role')}
            />
          )
        })
      })}
    </Fragment>
  )
}

function mapStateToProps({ deals }) {
  return {
    dealsRoles: deals.roles
  }
}

export default connect(mapStateToProps)(FormRole)
