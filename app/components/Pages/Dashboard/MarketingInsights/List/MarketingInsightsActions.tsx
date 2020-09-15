import React, { useState, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { IconButton, MenuItem, Typography, Divider } from '@material-ui/core'
import { mdiDotsHorizontal } from '@mdi/js'
import { addNotification } from 'reapop'

import { deleteEmailCampaign } from 'models/email/delete-email-campaign'
import { setEmailNotificationStatus } from 'models/email/set-email-notification-status'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { BaseDropdown } from 'components/BaseDropdown'
import { EditEmailDrawer } from 'components/EmailCompose'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import EmailNotificationSetting from 'components/EmailNotificationSetting'

import useLabeledSwitchHandlers from 'hooks/use-labeled-switch-handlers'

interface Props {
  emailCampaign: IEmailCampaign
  isSent: boolean
  reloadList: () => void
  reloadItem: (emailCampaignId: UUID) => void
}

function Actions({ emailCampaign, isSent, reloadList, reloadItem }: Props) {
  const [isEditComposeOpen, setIsEditComposeOpen] = useState(false)

  const confirmation = useContext(ConfirmationModalContext)

  const dispatch = useDispatch()

  const emailNotificationSettingHandlers = useLabeledSwitchHandlers(
    emailCampaign?.notifications_enabled,
    async checked => {
      try {
        await setEmailNotificationStatus(emailCampaign.id, checked)
        reloadItem(emailCampaign.id)
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

  return (
    <>
      <BaseDropdown
        PopperProps={{
          placement: 'bottom-end'
        }}
        renderDropdownButton={buttonProps => (
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
                    confirmation.setConfirmationModal({
                      appearance: 'danger',
                      message: 'Do you want to delete this scheduled email?',
                      description:
                        "The email will be deleted and you don't have access to it anymore. Are you sure?",
                      confirmLabel: 'Yes, Remove it',
                      onConfirm: () =>
                        deleteEmailCampaign(emailCampaign.id).then(reloadList)
                    })
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
          emailId={emailCampaign.id}
        />
      )}
    </>
  )
}

export default Actions
