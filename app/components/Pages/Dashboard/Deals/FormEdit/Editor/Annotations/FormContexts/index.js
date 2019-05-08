import React, { Fragment } from 'react'

import FormRole from './Role/Singular'
import FormRoles from './Role/Plural'
import { FormContext } from './FormContext'

export function FormContexts(props) {
  const sharedProps = {
    formValues: props.values,
    deal: props.deal,
    onClick: props.onClick,
    onSetValues: props.onSetValues
  }

  const handleClickRole = (item, bounds, roleIndex = -1) => {
    if (item.annotationContext.readonly) {
      return false
    }

    props.onClick('Role', {
      ...item,
      bounds,
      roleIndex
    })
  }

  return (
    <Fragment>
      <FormRole
        roles={props.roles.single}
        {...sharedProps}
        onClick={handleClickRole}
      />
      <FormRoles
        roles={props.roles.all}
        {...sharedProps}
        onClick={handleClickRole}
      />
      <FormContext contexts={props.contexts} {...sharedProps} />
    </Fragment>
  )
}
