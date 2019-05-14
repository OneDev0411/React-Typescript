import React from 'react'

import { Container } from './styled'

import { FormInputs } from './BasicInputs'
import { AddressInputs } from './AddressInputs'
import ContextInputs from './Context'
import Roles from './Roles'

export default function Annotations(props) {
  const sharedProps = {
    annotations: props.annotations,
    pageIndex: props.pageIndex,
    deal: props.deal,
    values: props.values,
    onValueUpdate: props.onValueUpdate
  }

  return (
    <Container>
      <FormInputs {...sharedProps} />
      <Roles {...sharedProps} />
      <AddressInputs {...sharedProps} />
      <ContextInputs {...sharedProps} />
    </Container>
  )
}
