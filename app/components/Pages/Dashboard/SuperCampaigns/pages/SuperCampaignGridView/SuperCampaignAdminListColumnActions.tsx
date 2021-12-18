import { IconButton, MenuItem, Typography } from '@material-ui/core'
import { mdiDotsVertical } from '@mdi/js'

import { BaseDropdown } from '@app/views/components/BaseDropdown'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useDeleteSuperCampaign } from '../../hooks/use-delete-super-campaign'

interface SuperCampaignAdminListColumnActionsProps {
  superCampaign: ISuperCampaign
  onDelete: () => void
}

function SuperCampaignAdminListColumnActions({
  superCampaign,
  onDelete
}: SuperCampaignAdminListColumnActionsProps) {
  const { deleteSuperCampaign, isDeleting } = useDeleteSuperCampaign(
    superCampaign,
    onDelete
  )

  const isWorking = isDeleting // TODO: complete this logic

  const handleDuplicate = () => {}

  return (
    <BaseDropdown
      PopperProps={{
        placement: 'bottom-end'
      }}
      renderDropdownButton={({ isActive, ...buttonProps }) => (
        <IconButton {...buttonProps} size="small" disabled={isWorking}>
          <SvgIcon path={mdiDotsVertical} />
        </IconButton>
      )}
      renderMenu={({ close }) => (
        <div onClick={close}>
          <MenuItem onClick={handleDuplicate}>
            <Typography variant="body2">Duplicate this campaign</Typography>
          </MenuItem>
          {!superCampaign.executed_at && (
            <MenuItem onClick={deleteSuperCampaign}>
              <Typography variant="body2">Delete</Typography>
            </MenuItem>
          )}
        </div>
      )}
    />
  )
}

export default SuperCampaignAdminListColumnActions
