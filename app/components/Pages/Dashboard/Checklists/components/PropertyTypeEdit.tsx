import { useState } from 'react'

import { Theme, IconButton, makeStyles } from '@material-ui/core'
import { mdiPencilOutline } from '@mdi/js'
import cn from 'classnames'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { PropertyTypeForm } from './PropertyTypeForm'

const useStyles = makeStyles(
  (theme: Theme) => ({
    editIcon: {
      color: theme.palette.error.main,
      visibility: 'hidden'
    }
  }),
  {
    name: 'ChecklistSideNavItem'
  }
)

interface Props {
  propertyType: IDealPropertyType
  onUpdate: (propertyType: IDealPropertyType) => void
}

export function PropertyTypeEdit({ propertyType, onUpdate }: Props) {
  const classes = useStyles()
  const [showEditForm, setShowEditForm] = useState(false)

  const closeModal = () => setShowEditForm(false)

  return (
    <>
      <IconButton
        size="small"
        className={cn(classes.editIcon, 'icon-button')}
        onClick={() => setShowEditForm(true)}
      >
        <SvgIcon path={mdiPencilOutline} size={muiIconSizes.small} />
      </IconButton>

      {showEditForm && (
        <PropertyTypeForm
          isOpen
          propertyType={propertyType}
          onSave={propertyType => {
            closeModal()
            onUpdate(propertyType)
          }}
          onClose={closeModal}
        />
      )}
    </>
  )
}
