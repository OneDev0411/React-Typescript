import React from 'react'
import PropTypes from 'prop-types'
import { mdiLightningBolt } from '@mdi/js'

import { noop } from 'utils/helpers'

import TextIconButton from 'components/Button/TextIconButton'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

Button.propTypes = {
  id: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  render: PropTypes.func
}

Button.defaultProps = {
  id: '',
  render: noop
}

export default function Button({ id, isOpen, render, onClick }) {
  const buttonProps = {
    type: 'button',
    onClick,
    'aria-describedby': id,
    style: { pointerEvents: isOpen ? 'none' : 'initial' }
  }

  if (render()) {
    return render(buttonProps)
  }

  return (
    <TextIconButton
      text="Add to Flow"
      iconLeft={() => <SvgIcon path={mdiLightningBolt} />}
      {...buttonProps}
    />
  )
}
