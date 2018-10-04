import React from 'react'
import _ from 'underscore'

import ContextAnnotation from '../context-annotation'
import DealContext from '../../../../../../../../../models/DealContext'

function getContextType(context) {
  if (context && DealContext.isAddressField(context.name)) {
    return 'Address'
  }

  return 'Singular'
}

function getFormValue(values, annotations) {
  const relevant = annotations
    .map(a => values[a.fieldName])
    .filter(Boolean)

  if (relevant.length < 1)
    return undefined

  return relevant.join(' ')
}

export default function FormContexts(props) {
  const grouped = {}

  _.each(props.contexts, (data, context_name) => {
    grouped[context_name] = _.groupBy(props.contexts[context_name], 'group')
  })

  return (
    <div>
      {_.map(grouped, (groups, name) => {
        // get context
        const context = DealContext.searchContext(name)

        const contextValue = DealContext.getValue(
          props.deal,
          DealContext.searchContext(name)
        ).value

        return _.map(groups, (group, id) => {
          const annotations = group.map(i => i.annotation)

          const annotationContext = {
            type: 'Context',
            context
          }

          const contextType = getContextType(context)
          const formValue = getFormValue(props.formValues, annotations)

          return (
            <ContextAnnotation
              key={`${name}-${id}`}
              annotationContext={annotationContext}
              value={formValue || contextValue}
              maxFontSize={20}
              annotations={annotations}
              onSetValues={props.onSetValues}
              isDealConnectedToMls={props.deal.listing !== null}
              isAddressField={contextType === 'Address'}
              onClick={bounds => {
                props.onClick('Context', {
                  contextName: context.name,
                  type: contextType,
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
