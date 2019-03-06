import React from 'react'
import PropTypes from 'prop-types'

import { noop } from 'utils/helpers'

import { Error } from './Error'
import { Label } from './Label'
import { Title } from './Title'
import { Value } from './Value'

EditMode.propTypes = {
  attribute: PropTypes.shape().isRequired,
  onChangeLabel: PropTypes.func,
  onChangePrimary: PropTypes.func,
  onChangeValue: PropTypes.func.isRequired
}

EditMode.defaultProps = {
  onChangeLabel: noop,
  onChangePrimary: noop
}

export function EditMode(props) {
  const { attribute } = props

  return (
    <React.Fragment>
      <Title attribute={attribute} onChangePrimary={props.onChangePrimary} />
      {attribute.attribute_def.has_label && (
        <Label attribute={attribute} onChange={props.onChangeLabel} />
      )}
      <Value attribute={attribute} onChange={props.onChangeValue} />
      {props.error && <Error>{props.error}</Error>}
    </React.Fragment>
  )
}
