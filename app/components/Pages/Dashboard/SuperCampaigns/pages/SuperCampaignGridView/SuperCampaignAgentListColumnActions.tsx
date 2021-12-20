import { useContext, useState } from 'react'

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
import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import MarketingEmailTemplateEditor from '../../components/MarketingEmailTemplateEditor'
import { convertTimestampToDate, isSuperCampaignReadOnly } from '../../helpers'
import { useGetSuperCampaignInitialEmailTo } from '../../hooks/use-get-super-campaign-initial-email-to'

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
  onCopy: () => void
  onUnenroll: () => void
}

function SuperCampaignAgentListColumnActions({
  superCampaign,
  onParticipateClick,
  onUnenroll,
  onCopy
}: SuperCampaignAgentListColumnActionsProps) {
  const classes = useStyles()
  const confirmation = useContext(ConfirmationModalContext)

  const isEnrolled = !!superCampaign.enrollment
  const isExecuted = isSuperCampaignReadOnly(superCampaign)

  const { unenrollMeFromSuperCampaign, isDeleting } =
    useUnenrollMeFromSuperCampaign(superCampaign.id, onUnenroll)

  const handleNotify = () => {
    // TODO: Implement notify logic
    // onNotify()
  }

  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const openEditor = () => setIsEditorOpen(true)

  const closeEditor = () => setIsEditorOpen(false)

  const handleCopy = () => {
    // TODO: Implement notify logic
    // console.log('handleCopy')
    // onCopy()
    openEditor()
  }

  const handleOptOut = () => {
    confirmation.setConfirmationModal({
      message: 'Are you sure about opting out of the campaign?',
      confirmLabel: 'Yes, I am',
      onConfirm: unenrollMeFromSuperCampaign
    })
  }

  const handleOptOutAndCopy = () => {
    confirmation.setConfirmationModal({
      message:
        'Are you sure about opting out of the campaign and duplicating it?',
      confirmLabel: 'Yes, I am',
      onConfirm: async () => {
        await Promise.all([unenrollMeFromSuperCampaign(), handleCopy()])
      }
    })
  }

  // TODO: Implement this
  const isNotifying = false

  const isWorking = isDeleting || isNotifying

  const initialEmailTo = useGetSuperCampaignInitialEmailTo(superCampaign.tags)

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
      {superCampaign.template_instance && isEditorOpen && (
        <MarketingEmailTemplateEditor
          template={superCampaign.template_instance}
          onClose={closeEditor}
          initialEmailTo={initialEmailTo}
          initialEmailSubject={superCampaign.subject}
          initialEmailDueAt={
            superCampaign.due_at
              ? convertTimestampToDate(superCampaign.due_at)
              : undefined
          }
        />
      )}
    </div>
  )
}

export default SuperCampaignAgentListColumnActions
