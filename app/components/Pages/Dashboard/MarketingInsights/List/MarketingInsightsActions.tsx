import React, { useState, useContext } from 'react'
import { IconButton, MenuItem, Typography } from '@material-ui/core'
import { mdiDotsHorizontal } from '@mdi/js'

import { deleteEmailCampaign } from 'models/email/delete-email-campaign'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { BaseDropdown } from 'components/BaseDropdown'
import { EditEmailDrawer } from 'components/EmailCompose'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

interface Props {
  emailCampaign: IEmailCampaign
  isSent: boolean
  reloadList: () => void
  reloadItem: (emailCampaignId: UUID) => void
}

function Actions({ emailCampaign, isSent, reloadList, reloadItem }: Props) {
  const [isEditComposeOpen, setIsEditComposeOpen] = useState(false)

  const confirmation = useContext(ConfirmationModalContext)

  return (
    <>
      {!isSent && (
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
            <>
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
        />
      )}
      {!isSent && isEditComposeOpen && (
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
