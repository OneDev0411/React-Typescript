import {
  Button,
  IconButton,
  MenuItem,
  Typography,
  makeStyles,
  Switch,
  Divider,
  CircularProgress
} from '@material-ui/core'
import { mdiDotsVertical } from '@mdi/js'

import { useUpdateMySuperCampaignEnrollment } from '@app/models/super-campaign'
import { BaseDropdown } from '@app/views/components/BaseDropdown'
import {
  useHandleSuperCampaignOptOutAndCopy,
  useMarketingEmailTemplateEditor
} from '@app/views/components/SuperCampaignPreviewDrawer'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { isSuperCampaignReadOnly } from '../../helpers'

const useStyles = makeStyles(
  theme => ({
    root: { paddingRight: theme.spacing(1) },
    more: { marginLeft: theme.spacing(1) }
  }),
  { name: 'SuperCampaignAgentListColumnActions' }
)

interface SuperCampaignAgentListColumnActionsProps {
  superCampaign: ISuperCampaignWithEnrollment
  onParticipateClick: () => void
}

function SuperCampaignAgentListColumnActions({
  superCampaign,
  onParticipateClick
}: SuperCampaignAgentListColumnActionsProps) {
  const classes = useStyles()

  const isEnrolled = !!superCampaign.enrollment
  const isExecuted = isSuperCampaignReadOnly(superCampaign)

  const { marketingEmailTemplateEditor, openEmailTemplateEditor } =
    useMarketingEmailTemplateEditor(superCampaign)

  const handleCopy = () => {
    openEmailTemplateEditor()
  }

  const { isDeleting, handleOptOut, handleOptOutAndCopy } =
    useHandleSuperCampaignOptOutAndCopy({ onOptOutAndCopy: handleCopy })

  const { isLoading: isToggling, mutate: updateMySuperCampaignEnrollment } =
    useUpdateMySuperCampaignEnrollment({
      notify: {
        onSuccess: 'The enrollment notifications status has been updated',
        onError: 'Something went wrong while updating the notifications status'
      }
    })

  const isWorking = isDeleting || isToggling

  return (
    <div className={classes.root}>
      {!isEnrolled && (
        <Button
          size="small"
          color="primary"
          variant="outlined"
          onClick={onParticipateClick}
          disabled={isWorking}
        >
          Preview and Participate
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
            {isWorking ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <SvgIcon path={mdiDotsVertical} />
            )}
          </IconButton>
        )}
        renderMenu={({ close }) => (
          <div onClick={close}>
            {(isExecuted || isEnrolled) && (
              <>
                <MenuItem
                  onClick={() =>
                    updateMySuperCampaignEnrollment({
                      superCampaignId: superCampaign.id,
                      data: {
                        notifications_enabled:
                          !superCampaign.enrollment?.notifications_enabled
                      }
                    })
                  }
                >
                  <Typography variant="body2">
                    Notify when opened or clicked
                  </Typography>
                  <Switch
                    color="primary"
                    size="small"
                    disabled={isToggling}
                    checked={!!superCampaign.enrollment?.notifications_enabled}
                  />
                </MenuItem>
                <Divider />
              </>
            )}
            {(isExecuted || !isEnrolled) && (
              <MenuItem onClick={handleCopy}>
                <Typography variant="body2">Copy this campaign</Typography>
              </MenuItem>
            )}
            {!isExecuted && isEnrolled && (
              <>
                <MenuItem onClick={() => handleOptOutAndCopy(superCampaign.id)}>
                  <Typography variant="body2">
                    Opt-out and copy this campaign
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleOptOut(superCampaign.id)}>
                  <Typography variant="body2">Opt-out</Typography>
                </MenuItem>
              </>
            )}
          </div>
        )}
      />
      {marketingEmailTemplateEditor}
    </div>
  )
}

export default SuperCampaignAgentListColumnActions
