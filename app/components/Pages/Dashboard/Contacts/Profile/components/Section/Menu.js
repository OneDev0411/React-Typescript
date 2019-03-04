import React from 'react'
import PropTypes from 'prop-types'

import TextIconButton from '../../../../../../../views/components/Button/TextIconButton'
import EditIcon from '../../../../../../../views/components/SvgIcons/Edit/EditIcon'

Menu.propTypes = {
  onEdit: PropTypes.func
}

export function Menu({ onEdit }) {
  if (typeof onEdit !== 'function') {
    return null
  }

  return (
    <TextIconButton
      appearance="outline"
      iconLeft={EditIcon}
      onClick={onEdit}
      size="small"
      text="Update"
    />
  )
}
