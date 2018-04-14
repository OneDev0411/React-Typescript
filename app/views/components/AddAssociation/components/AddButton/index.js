import React from 'react'
import PropTypes from 'prop-types'

import ShadowButton from '../../../Button/ShadowButton'
import AddIcon from '../../../SvgIcons/Add/AddIcon'

const color = '#2196f3'

const Button = ShadowButton.extend`
  color: ${color};
  display: flex;
  align-items: center;
  line-height: 1;
  margin-right: 2em;
`

const Icon = AddIcon.extend`
  width: 1.5em;
  height: 1.5em;
  fill: ${color};
`

function AddButton({ title, onClick }) {
  return (
    <Button type="button" onClick={onClick}>
      <Icon />
      <span style={{ marginLeft: '0.5em' }}>{title}</span>
    </Button>
  )
}

AddButton.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default AddButton
