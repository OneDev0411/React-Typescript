import React from 'react'
import PropTypes from 'prop-types'

import AddIcon from '../../../SvgIcons/Add/AddIcon'
import Button from '../../../Button/TextIconButton'

function AddButton({ title, onClick }) {
  return (
    <Button
      appearance="link"
      iconLeft={AddIcon}
      onClick={onClick}
      text={title}
      type="button"
      style={{
        padding: 0,
        marginRight: '2em'
      }}
    />
  )
}

AddButton.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default AddButton
