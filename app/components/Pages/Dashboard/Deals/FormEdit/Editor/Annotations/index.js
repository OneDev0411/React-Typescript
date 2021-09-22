import React from 'react'

import { AddressInputs } from './AddressInputs'
import { FormInputs } from './BasicInputs'
import ContextInputs from './Context'
// eslint-disable-next-line import/no-named-as-default
import Roles from './Roles'
import { Container } from './styled'

export default function Annotations(props) {
  const sharedProps = {
    annotations: props.annotations,
    pageIndex: props.pageIndex,
    deal: props.deal,
    values: props.values,
    instructions: props.instructions,
    onValueUpdate: props.onValueUpdate,
    onInstructionUpdate: props.onInstructionUpdate
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
