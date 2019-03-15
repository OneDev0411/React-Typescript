import React from 'react'
import PropTypes from 'prop-types'

import { noop } from 'utils/helpers'

import { Error } from './Error'
import { Label } from './Label'
import { Title } from './Title'
import { Value } from './Value'

EditMode.propTypes = {
  attribute: PropTypes.shape().isRequired,
  handleEnterKey: PropTypes.func,
  onChangeLabel: PropTypes.func,
  onChangePrimary: PropTypes.func,
  onChangeValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string
}

EditMode.defaultProps = {
  handleEnterKey: noop,
  onChangeLabel: noop,
  onChangePrimary: noop,
  placeholder: ''
}

export function EditMode(props) {
  const { attribute } = props

  return (
    <React.Fragment>
      <Title attribute={attribute} onChangePrimary={props.onChangePrimary} />
      {attribute.attribute_def.has_label && (
        <Label
          attribute={attribute}
          onChange={props.onChangeLabel}
          placeholder={props.placeholder}
        />
      )}
      <Value
        attribute={attribute}
        onChange={props.onChangeValue}
        placeholder={props.placeholder}
        handleEnterKey={props.handleEnterKey}
      />
      {props.error && <Error>{props.error}</Error>}
    </React.Fragment>
  )
}
