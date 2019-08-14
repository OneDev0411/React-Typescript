import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Popover from '@material-ui/core/Popover'

import { noop } from 'utils/helpers'

import Button from './Button'

import AddToFlowForm from '../AddToFlowForm'

const originShape = {
  vertical: PropTypes.string,
  horizontal: PropTypes.string
}

AddToFlowButton.propTypes = {
  activeFlows: PropTypes.arrayOf(PropTypes.string.isRequired),
  buttonRenderer: PropTypes.func,
  contacts: PropTypes.shape().isRequired,
  callback: PropTypes.func,
  anchorOrigin: PropTypes.shape(originShape),
  transformOrigin: PropTypes.shape(originShape)
}

AddToFlowButton.defaultProps = {
  activeFlows: [],
  buttonRenderer: noop,
  callback: noop,
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'right'
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'right'
  }
}

export default function AddToFlowButton(props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const isOpen = Boolean(anchorEl)
  const id = isOpen ? 'add-to-flow-popover' : undefined

  function handleClick(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <Button
        id={id}
        isOpen={isOpen}
        onClick={handleClick}
        render={props.buttonRenderer}
      />
      <Popover
        id={id}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={props.anchorOrigin}
        transformOrigin={props.transformOrigin}
      >
        <AddToFlowForm
          isOpen
          callback={props.callback}
          contacts={props.contacts}
          handleClose={handleClose}
          activeFlows={props.activeFlows}
        />
      </Popover>
    </React.Fragment>
  )
}
