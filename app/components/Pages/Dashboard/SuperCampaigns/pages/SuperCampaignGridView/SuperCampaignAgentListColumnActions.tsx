import { useContext } from 'react'

import {
  Button,
  IconButton,
  MenuItem,
  Typography,
  makeStyles,
  Switch,
  Divider
} from '@material-ui/core'
import { mdiDotsVertical } from '@mdi/js'

import { useUnenrollMeFromSuperCampaign } from '@app/hooks/use-unenroll-me-from-super-campaign'
import { BaseDropdown } from '@app/views/components/BaseDropdown'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { useIsSuperCampaignReadOnly } from '../../hooks/use-is-super-campaign-read-only'

const useStyles = makeStyles(
  theme => ({
    more: { margin: theme.spacing(0, 1) }
  }),
  { name: 'SuperCampaignAgentListColumnActions' }
)

interface SuperCampaignAgentListColumnActionsProps {
  superCampaign: ISuperCampaignWithEnrollment
  onParticipateClick: () => void
  onNotify: () => void
  onDuplicate: () => void
  onUnenroll: () => void
}

function SuperCampaignAgentListColumnActions({
  superCampaign,
  onParticipateClick,
  onNotify,
  onDuplicate,
  onUnenroll
}: SuperCampaignAgentListColumnActionsProps) {
  const classes = useStyles()
  const confirmation = useContext(ConfirmationModalContext)

  const isEnrolled = !!superCampaign.enrollment
  const isExecuted = useIsSuperCampaignReadOnly(superCampaign)

  const { unenrollMeFromSuperCampaign, isDeleting } =
    useUnenrollMeFromSuperCampaign(superCampaign.id, onUnenroll)

  const handleNotify = () => {
    // TODO: Implement notify logic
    onNotify()
  }

  const handleDuplicate = () => {
    // TODO: Implement notify logic
    onDuplicate()
  }

  const handleOptOut = () => {
    confirmation.setConfirmationModal({
      message: 'Are you sure about opting out of the campaign?',
      confirmLabel: 'Yes, I am',
      onConfirm: unenrollMeFromSuperCampaign
    })
  }

  const handleOptOutAndDuplicate = () => {
    confirmation.setConfirmationModal({
      message:
        'Are you sure about opting out of the campaign and duplicating it?',
      confirmLabel: 'Yes, I am',
      onConfirm: async () => {
        await Promise.all([unenrollMeFromSuperCampaign(), handleDuplicate()])
      }
    })
  }

  // TODO: Add isDuplicating and isNotifying when they are ready
  const isWorking = isDeleting

  return (
    <div>
      {!isEnrolled && (
        <Button
          size="small"
          color="primary"
          variant="outlined"
          onClick={onParticipateClick}
          disabled={isWorking}
        >
          Participate to This Campaign
        </Button>
      )}

      <BaseDropdown
        PopperProps={{
          placement: 'bottom-end'
        }}
        renderDropdownButton={({ isActive, ...buttonProps }) => (
          <IconButton
            {...buttonProps}
            size="small"
            className={classes.more}
            disabled={isWorking}
          >
            <SvgIcon path={mdiDotsVertical} />
          </IconButton>
        )}
        renderMenu={({ close }) => (
          <div onClick={close}>
            {(isExecuted || isEnrolled) && (
              <>
                <MenuItem onClick={handleNotify}>
                  <Typography variant="body2">
                    Notify when opened or clicked
                  </Typography>
                  <Switch
                    color="primary"
                    size="small"
                    defaultChecked // TODO: Set the correct value here
                  />
                </MenuItem>
                <Divider />
              </>
            )}
            {(isExecuted || !isEnrolled) && (
              <MenuItem onClick={handleDuplicate}>
                <Typography variant="body2">Duplicate this campaign</Typography>
              </MenuItem>
            )}
            {!isExecuted && isEnrolled && (
              <>
                <MenuItem onClick={handleOptOutAndDuplicate}>
                  <Typography variant="body2">
                    Opt-out and duplicate this campaign
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleOptOut}>
                  <Typography variant="body2">Opt-out</Typography>
                </MenuItem>
              </>
            )}
          </div>
        )}
      />
    </div>
  )
}

export default SuperCampaignAgentListColumnActions
