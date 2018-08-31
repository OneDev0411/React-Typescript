import React, { Fragment } from 'react'

import FormRole from './form-role'
import FormRoles from './form-roles'
import FormContext from './form-context'

export default class FormContexts extends React.Component {
  render() {
    return (
      <Fragment>
        <FormRole role={this.props.roles.single} />
        <FormRoles roles={this.props.roles.all} />
        <FormContext contexts={this.props.contexts} deal={this.props.deal} />
      </Fragment>
    )
  }
}
