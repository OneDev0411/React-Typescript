import { MouseEvent, useState } from 'react'

import { IconButton, Menu, MenuItem } from '@material-ui/core'
import { mdiDotsVertical } from '@mdi/js'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

interface SuperCampaignWithEnrollmentCardActionsProps {
  className: string
  disabled: boolean
  onOptOutClick: () => void
}

function SuperCampaignWithEnrollmentCardActions({
  onOptOutClick,
  className,
  ...otherProps
}: SuperCampaignWithEnrollmentCardActionsProps) {
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null)
  const open = Boolean(anchorEl)

  const handleActionClick = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  return (
    <>
      <IconButton
        {...otherProps}
        className={className}
        onClick={handleActionClick}
        size="small"
      >
        <SvgIcon path={mdiDotsVertical} />
      </IconButton>
      <Menu
        open={open}
        onClick={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        getContentAnchorEl={null}
      >
        <MenuItem onClick={onOptOutClick}>Opt-Out</MenuItem>
      </Menu>
    </>
  )
}

export default SuperCampaignWithEnrollmentCardActions
