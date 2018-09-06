import React, { Fragment } from 'react'

import FormRole from './form-role'
import FormRoles from './form-roles'
import FormContext from './form-context'

export default function FormContexts(props) {
  return (
    <Fragment>
      <FormRole
        roles={props.roles.single}
        deal={props.deal}
        onClick={props.onClick}
      />
      <FormRoles
        roles={props.roles.all}
        deal={props.deal}
        onClick={props.onClick}
      />
      <FormContext
        contexts={props.contexts}
        deal={props.deal}
        onClick={props.onClick}
      />
    </Fragment>
  )
}
