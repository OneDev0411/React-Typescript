import React from 'react'
import _ from 'underscore'

import ContextAnnotation from '../context-annotation'
import DealContext from '../../../../../../../../../models/DealContext'

function getContextType(context) {
  if (context && context.priority === 'MLS') {
    return 'Address'
  }

  return 'Singular'
}

function ContextGroups(props) {
  const { value, groups, onSetValues, context } = props

  return (
    <div>
      {_.map(groups, group => {
        const annotations = group.map(i => i.annotation)

        return (
          <ContextAnnotation
            value={value}
            maxFontSize={20}
            annotations={annotations}
            onSetValues={onSetValues}
            onClick={bounds => {
              props.onClick('Context', {
                contextName: context.name,
                type: getContextType(context),
                context,
                annotations,
                bounds
              })
            }}
          />
        )
      })}
    </div>
  )
}

export default function FormContexts(props) {
  const grouped = {}

  _.each(props.contexts, name => {
    grouped[name] = _.groupBy(props.contexts[name], 'group')
  })

  return (
    <div>
      {_.map(grouped, (groups, name) => {
        const context = DealContext.searchContext(name)
        const value = DealContext.getValue(
          props.deal,
          DealContext.searchContext(name)
        ).value

        return (
          <ContextGroups
            key={name}
            groups={groups}
            value={value}
            context={context}
            onSetValues={props.onSetValues}
          />
        )
      })}
    </div>
  )
}
