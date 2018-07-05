import React from 'react'
import PropTypes from 'prop-types'

import ActionButton from '../../../../../../../views/components/Button/ActionButton'

AddNewButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

export function AddNewButton(props) {
  return (
    <div
      style={{
        textAlign: 'center',
        marginBottom: '1em'
      }}
    >
      <ActionButton inverse onClick={props.onClick}>
        {props.text}
      </ActionButton>
    </div>
  )
}
