import { Dispatch, SetStateAction, useContext } from 'react'

import {
  IconButton,
  MenuItem,
  Typography,
  makeStyles,
  CircularProgress
} from '@material-ui/core'
import { mdiDotsVertical } from '@mdi/js'

import { BaseDropdown } from '@app/views/components/BaseDropdown'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { convertDateToTimestamp } from '../../helpers'
import { useIsSuperCampaignReadOnly } from '../../hooks/use-is-super-campaign-read-only'
import { useSaveSuperCampaign } from '../../hooks/use-save-super-campaign'

const useStyles = makeStyles(
  theme => ({
    more: { marginLeft: theme.spacing(1) }
  }),
  { name: 'SuperCampaignDetailHeaderMoreActions' }
)

interface SuperCampaignDetailHeaderMoreActionsProps {
  superCampaign: ISuperCampaign<'template_instance'>
  setSuperCampaign: Dispatch<
    SetStateAction<ISuperCampaign<'template_instance'>>
  >
}

function SuperCampaignDetailHeaderMoreActions({
  superCampaign,
  setSuperCampaign
}: SuperCampaignDetailHeaderMoreActionsProps) {
  const classes = useStyles()
  const confirmation = useContext(ConfirmationModalContext)
  const isExecuted = useIsSuperCampaignReadOnly(superCampaign)

  const { saveSuperCampaign, isSaving } = useSaveSuperCampaign(
    superCampaign,
    setSuperCampaign
  )

  const handleSendNow = () => {
    confirmation.setConfirmationModal({
      message: 'Are you sure you want to send it now?',
      confirmLabel: 'Yes, I am',
      onConfirm: () =>
        saveSuperCampaign({
          due_at: convertDateToTimestamp(new Date())
        })
    })
  }

  if (isExecuted) {
    return null
  }

  return (
    <BaseDropdown
      PopperProps={{
        placement: 'bottom-end'
      }}
      renderDropdownButton={({ isActive, ...buttonProps }) => (
        <IconButton
          {...buttonProps}
          size="small"
          className={classes.more}
          disabled={isSaving}
        >
          {isSaving ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <SvgIcon path={mdiDotsVertical} />
          )}
        </IconButton>
      )}
      renderMenu={({ close }) => (
        <div onClick={close}>
          <MenuItem onClick={handleSendNow}>
            <Typography variant="body2">Send Now</Typography>
          </MenuItem>
        </div>
      )}
    />
  )
}

export default SuperCampaignDetailHeaderMoreActions
