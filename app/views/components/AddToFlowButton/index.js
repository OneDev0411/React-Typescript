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
    vertical: 'bottom',
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

  function onEntered() {
    anchorEl.classList.remove('ghost')
  }

  function onExited() {
    anchorEl.classList.add('ghost')
  }

  return (
    <React.Fragment>
      <Button
        id={id}
        onClick={handleClick}
        isOpen={isOpen}
        render={props.buttonRenderer}
      />
      <Popover
        id={id}
        open={isOpen}
        anchorEl={anchorEl}
        onEntered={onEntered}
        onExited={onExited}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <AddToFlowForm isOpen handleClose={handleClose} {...props} />
      </Popover>
    </React.Fragment>
  )
}
