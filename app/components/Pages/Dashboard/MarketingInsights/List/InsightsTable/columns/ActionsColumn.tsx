import { useState } from 'react'

import { IconButton, MenuItem, Typography, Divider } from '@material-ui/core'
import { mdiDotsHorizontal } from '@mdi/js'
import { useDispatch } from 'react-redux'

import { confirmation } from '@app/store_actions/confirmation'
import { BaseDropdown } from 'components/BaseDropdown'
import { EditEmailDrawer } from 'components/EmailCompose'
import EmailNotificationSetting from 'components/EmailNotificationSetting'
import { addNotification } from 'components/notification'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import useLabeledSwitchHandlers from 'hooks/use-labeled-switch-handlers'
import { deleteEmailCampaign } from 'models/email/delete-email-campaign'
import { setEmailNotificationStatus } from 'models/email/set-email-notification-status'

interface Props {
  item: IEmailCampaign<'template'>
  reloadList: () => void
  reloadItem: (id: UUID) => void
}

export function ActionsColumn({ item, reloadList, reloadItem }: Props) {
  const [isEditComposeOpen, setIsEditComposeOpen] = useState(false)
  const isSent = !!item.executed_at

  const dispatch = useDispatch()

  const emailNotificationSettingHandlers = useLabeledSwitchHandlers(
    item?.notifications_enabled,
    async checked => {
      try {
        await setEmailNotificationStatus(item.id, checked)
        reloadItem(item.id)
      } catch (error) {
        console.error(error)
        dispatch(
          addNotification({
            status: 'error',
            message: 'Unable to change email notification setting.'
          })
        )
      }
    }
  )

  const handleDelete = () => {
    dispatch(
      confirmation({
        appearance: 'danger',
        message: 'Do you want to delete this scheduled email?',
        description:
          "The email will be deleted and you don't have access to it anymore. Are you sure?",
        confirmLabel: 'Yes, Remove it',
        onConfirm: () => deleteEmailCampaign(item.id).then(reloadList)
      })
    )
  }

  return (
    <>
      <BaseDropdown
        PopperProps={{
          placement: 'bottom-end'
        }}
        renderDropdownButton={({ isActive, ...buttonProps }) => (
          <IconButton {...buttonProps} style={{ padding: 0 }}>
            <SvgIcon path={mdiDotsHorizontal} />
          </IconButton>
        )}
        renderMenu={({ close }) => (
          <div>
            <MenuItem>
              <EmailNotificationSetting
                variant="body1"
                {...emailNotificationSettingHandlers}
              />
            </MenuItem>

            {!isSent && (
              <>
                <Divider />

                <MenuItem
                  onClick={() => {
                    close()
                    setIsEditComposeOpen(true)
                  }}
                >
                  Edit
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    close()
                    handleDelete()
                  }}
                >
                  <Typography color="error">Delete</Typography>
                </MenuItem>
              </>
            )}
          </div>
        )}
      />

      {isEditComposeOpen && (
        <EditEmailDrawer
          isOpen
          onClose={() => setIsEditComposeOpen(false)}
          onEdited={reloadList}
          onDeleted={reloadList}
          emailId={item.id}
        />
      )}
    </>
  )
}
