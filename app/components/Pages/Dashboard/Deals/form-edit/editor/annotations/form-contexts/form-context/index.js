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

export default function FormContexts(props) {
  const grouped = {}

  _.each(props.contexts, (data, context_name) => {
    grouped[context_name] = _.groupBy(props.contexts[context_name], 'group')
  })

  return (
    <div>
      {_.map(grouped, (groups, name) => {
        const context = DealContext.searchContext(name)
        const value = DealContext.getValue(
          props.deal,
          DealContext.searchContext(name)
        ).value

        return _.map(groups, group => {
          const annotations = group.map(i => i.annotation)

          return (
            <ContextAnnotation
              key={name}
              value={value}
              maxFontSize={20}
              annotations={annotations}
              onSetValues={props.onSetValues}
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
        })
      })}
    </div>
  )
}
