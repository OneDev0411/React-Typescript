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
  onNotify: () => void
  onUnenroll: () => void
}

function SuperCampaignAgentListColumnActions({
  superCampaign,
  onParticipateClick,
  onUnenroll
}: SuperCampaignAgentListColumnActionsProps) {
  const classes = useStyles()

  const isEnrolled = !!superCampaign.enrollment
  const isExecuted = isSuperCampaignReadOnly(superCampaign)

  const { marketingEmailTemplateEditor, openEmailTemplateEditor } =
    useMarketingEmailTemplateEditor(superCampaign)

  const handleNotify = () => {
    // TODO: Implement notify logic
    // onNotify()
  }

  const handleCopy = () => {
    openEmailTemplateEditor()
  }

  const { isDeleting, handleOptOut, handleOptOutAndCopy } =
    useHandleSuperCampaignOptOutAndCopy(
      superCampaign.id,
      onUnenroll,
      undefined,
      handleCopy
    )

  // TODO: Implement this
  const isNotifying = false

  const isWorking = isDeleting || isNotifying

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
                    disabled={isNotifying}
                    defaultChecked={
                      superCampaign.enrollment?.notifications_enabled
                    }
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
                <MenuItem onClick={handleOptOutAndCopy}>
                  <Typography variant="body2">
                    Opt-out and copy this campaign
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
      {marketingEmailTemplateEditor}
    </div>
  )
}

export default SuperCampaignAgentListColumnActions
