import React from 'react'
import { Field } from 'react-final-form'

import { TeamContactSelect } from '../../../TeamContact/TeamContactSelect'
import { Container, Label } from '../../../final-form-fields/styled'

import { SelectButton } from './SelectButton'

class OwnerFieldComponent extends React.Component {
  onSelectOwnerHandler = owner => this.props.input.onChange(owner.value)

  render() {
    return (
      <Container>
        <Label>Owner</Label>
        <TeamContactSelect
          user={this.props.user}
          owner={this.props.input.value}
          onSelect={this.onSelectOwnerHandler}
          buttonRenderer={SelectButton}
        />
      </Container>
    )
  }
}

export function Owner(props) {
  return <Field {...props} component={OwnerFieldComponent} />
}
