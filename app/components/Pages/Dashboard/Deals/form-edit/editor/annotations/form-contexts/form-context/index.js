import React from 'react'
import _ from 'underscore'

import ContextAnnotation from '../context-annotation'
import DealContext from '../../../../../../../../../models/Deal/helpers/dynamic-context'

function getContextType(context) {
  if (context && DealContext.isAddressField(context.name)) {
    return 'Address'
  }

  return 'Singular'
}

function getFormValue(values, annotations) {
  const valueList = annotations
    .map(ann => values[ann.fieldName])
    .filter(Boolean)

  if (valueList.length === 0) {
    return undefined
  }

  return valueList.join(' ')
}

function getTooltip(isAddressField, isDealConnectedToMls) {
  if (isAddressField && isDealConnectedToMls) {
    return (
      <React.Fragment>
        <img src="/static/images/deals/lock.svg" alt="locked" />
        <div>
          Listing information can only be changed on MLS. Once changed, the
          update will be reflected here.
        </div>
      </React.Fragment>
    )
  }

  return null
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
        const context = DealContext.searchContext(props.deal.brand.id, name)

        // find context object by its name
        const contextObject = DealContext.searchContext(
          props.deal.brand.id,
          name
        )

        // get context value
        const contextValue = contextObject
          ? DealContext.getValue(props.deal, contextObject).value
          : ''

        return _.map(groups, (group, id) => {
          const annotations = group.map(i => i.annotation)
          const info = group[0]
          const { disableAutopopulate } = info

          const annotationContext = {
            type: 'Context',
            context
          }

          const contextType = getContextType(context)
          const formValue = getFormValue(props.formValues, annotations)
          const isDealConnectedToMls = props.deal.listing !== null
          const isAddressField = contextType === 'Address'

          const value = formValue || (disableAutopopulate ? null : contextValue)

          const value = formValue || (disableAutopopulate ? null : contextValue)

          return (
            <ContextAnnotation
              key={`${name}-${id}`}
              annotationContext={annotationContext}
              value={value}
              maxFontSize={20}
              annotations={annotations}
              onSetValues={props.onSetValues}
              tooltip={getTooltip(isAddressField, isDealConnectedToMls)}
              isReadOnly={isAddressField && isDealConnectedToMls}
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
