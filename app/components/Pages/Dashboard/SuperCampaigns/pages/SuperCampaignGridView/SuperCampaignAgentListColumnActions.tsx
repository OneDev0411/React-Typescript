import { useContext, useState } from 'react'

import {
  Button,
  IconButton,
  MenuItem,
  Typography,
  makeStyles
} from '@material-ui/core'
import { mdiDotsVertical } from '@mdi/js'

import { useUnenrollMeFromSuperCampaign } from '@app/hooks/use-unenroll-me-from-super-campaign'
import { BaseDropdown } from '@app/views/components/BaseDropdown'
import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import MarketingEmailTemplateEditor from '../../components/MarketingEmailTemplateEditor'
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
  onDuplicate: () => void
  onUnenroll: () => void
}

function SuperCampaignAgentListColumnActions({
  superCampaign,
  onParticipateClick,
  onUnenroll,
  onDuplicate
}: SuperCampaignAgentListColumnActionsProps) {
  const classes = useStyles()
  const confirmation = useContext(ConfirmationModalContext)

  const isEnrolled = !!superCampaign.enrollment
  const isExecuted = isSuperCampaignReadOnly(superCampaign)

  const { unenrollMeFromSuperCampaign, isDeleting } =
    useUnenrollMeFromSuperCampaign(superCampaign.id, onUnenroll)

  // const handleNotify = () => {
  //   // TODO: Implement notify logic
  //   onNotify()
  // }

  // const { handleDuplicate, editor } = useAgentDuplicateSuperCampaign(
  //   superCampaign.template_instance
  // )

  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const openEditor = () => setIsEditorOpen(true)

  const closeEditor = () => setIsEditorOpen(false)

  const handleDuplicate = () => {
    // TODO: Implement notify logic
    // console.log('handleDuplicate')
    // onDuplicate()
    openEditor()
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

      {
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
              {/* TODO: Uncomment this when notify logic was ready */}
              {/* (isExecuted || isEnrolled) && (
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
            ) */}
              {(isExecuted || !isEnrolled) && (
                <MenuItem onClick={handleDuplicate}>
                  <Typography variant="body2">
                    Duplicate this campaign
                  </Typography>
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
      }
      {superCampaign.template_instance && isEditorOpen && (
        <MarketingEmailTemplateEditor
          template={superCampaign.template_instance}
          onClose={closeEditor}
          initialSubject={superCampaign.subject}
          // TODO: Find all the related tags according to the campaign tags
          // initialBCC={[{ recipient_type: 'Tag', tag: ''}]}
        />
      )}
    </div>
  )
}

export default SuperCampaignAgentListColumnActions
